import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/myState';

const tubeSizes = {
  '8x8': { width: 8, height: 8 },
  '10x10': { width: 10, height: 10 },
  '12x12': { width: 12, height: 12 },
  '13x13': { width: 13, height: 13 },
  '14x14': { width: 14, height: 14 },
  '16x16': { width: 16, height: 16 },
  '18x18': { width: 18, height: 18 },
  '20x20': { width: 20, height: 20 },
  '22x22': { width: 22, height: 22 },
  '24x24': { width: 24, height: 24 },
  '26x26': { width: 26, height: 26 },
  '28x28': { width: 28, height: 28 },
  '30x30': { width: 30, height: 30 },
  '38x38': { width: 38, height: 38 },
  '38.5x38.5': { width: 38.5, height: 38.5 },
  '39x39': { width: 39, height: 39 },
  '53x53': { width: 53, height: 53 },
};

const defaultTube = {
  material: 'carbon_fiber',
  size: '8x8',
  wall: 2,
  length: 400,
  unit: 'mm',
};

function convertToMM(value, unit) {
  if (unit === 'mm') return value;
  if (unit === 'inch') return value * 25.4;
  return value;
}

function calculateResults({ material, size, wall, length, unit }, materials) {
  // Convert all to mm for calculation
  const { width, height } = tubeSizes[size];
  const wMM = convertToMM(Number(width), unit);
  const hMM = convertToMM(Number(height), unit);
  const wallMM = convertToMM(Number(wall), unit);
  const lenMM = convertToMM(Number(length), unit);
  
  const outerArea = wMM * hMM;
  const innerArea = (wMM - 2 * wallMM) * (hMM - 2 * wallMM);
  const area = outerArea - innerArea;
  
  // Moment of inertia for square tube
  const Ix = (wMM * Math.pow(hMM, 3) - (wMM - 2 * wallMM) * Math.pow(hMM - 2 * wallMM, 3)) / 12;
  const Iy = (hMM * Math.pow(wMM, 3) - (hMM - 2 * wallMM) * Math.pow(wMM - 2 * wallMM, 3)) / 12;
  
  const mass = area * lenMM * materials[material].density / 1000; // g
  // Deflection (simplified, not real-world accurate)
  const D = (0.9 * 9.81 * Math.pow(lenMM, 3)) / (3 * 200 * Math.min(Ix, Iy));
  
  return {
    wall: wallMM.toFixed(3),
    area: area.toFixed(2),
    mass: mass.toFixed(2),
    Ix: Ix.toFixed(0),
    Iy: Iy.toFixed(0),
    D: D.toFixed(2),
    price: (mass * 2).toFixed(2), // Example price calculation
  };
}

const inputStyle = (hasError) =>
  `w-24 px-3 py-2 rounded-lg bg-neutral-800/70 backdrop-blur-sm text-center text-white text-base focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-all duration-200 hover:bg-neutral-700/70 ${
    hasError ? 'ring-2 ring-red-500/70' : ''
  }`;

const selectButton = () =>
  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-neutral-800/70 text-neutral-200 hover:bg-neutral-700/70 focus:outline-none focus:ring-2 focus:ring-neutral-500`;

const TubeSVG = ({ size: tubeSize, wall }) => {
  const dimensions = tubeSizes[tubeSize] || tubeSizes['8x8'];
  const { width, height } = dimensions;
  const svgSize = 300;
  const padding = 60;
  
  // Calculate outer dimensions by adding wall thickness to inner dimensions
  const outerWidth = width + wall * 2;
  const outerHeight = height + wall * 2;
  
  const scale = (svgSize - padding * 2) / Math.max(outerWidth, outerHeight);
  const w = width * scale;
  const h = height * scale;
  const wallScaled = wall * scale;
  
  // Calculate total dimensions including wall thickness
  const totalWidth = w + wallScaled * 2;
  const totalHeight = h + wallScaled * 2;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full flex justify-center"
    >
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
        {/* Tube visualization */}
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          x={(svgSize - totalWidth) / 2}
          y={(svgSize - totalHeight) / 2}
          width={totalWidth}
          height={totalHeight}
          fill="#FFF"
        />
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          x={(svgSize - w) / 2}
          y={(svgSize - h) / 2}
          width={w}
          height={h}
          fill="#222"
          stroke="#FFF"
          strokeWidth={scale}
        />

        {/* Outer Width measurement line */}
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          x1={(svgSize - totalWidth) / 2}
          y1={(svgSize + totalHeight) / 2 + 20}
          x2={(svgSize + totalWidth) / 2}
          y2={(svgSize + totalHeight) / 2 + 20}
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Outer Width text */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          x={svgSize / 2}
          y={(svgSize + totalHeight) / 2 + 40}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="14"
          fontWeight="bold"
        >
          Outer Width: {outerWidth.toFixed(2)} mm
        </motion.text>

        {/* Inner Width measurement line */}
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          x1={(svgSize - w) / 2 + 20}
          y1={(svgSize - h) / 2 + 20}
          x2={(svgSize + w) / 2 - 20}
          y2={(svgSize - h) / 2 + 20}
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Inner Width text */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          x={svgSize / 2}
          y={(svgSize - h) / 2 + 35}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="14"
          fontWeight="bold"
        >
          {width.toFixed(2)} mm
        </motion.text>

        {/* Outer Height measurement line */}
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          x1={(svgSize - totalWidth) / 2 - 20}
          y1={(svgSize - totalHeight) / 2}
          x2={(svgSize - totalWidth) / 2 - 20}
          y2={(svgSize + totalHeight) / 2}
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Outer Height text */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          x={(svgSize - totalWidth) / 2 - 35}
          y={svgSize / 2}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="14"
          fontWeight="bold"
          transform={`rotate(-90 ${(svgSize - totalWidth) / 2 - 35} ${svgSize / 2})`}
        >
          Outer Height: {outerHeight.toFixed(2)} mm
        </motion.text>

        {/* Inner Height measurement line */}
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          x1={(svgSize - w) / 2 + 20}
          y1={(svgSize - h) / 2 + 20}
          x2={(svgSize - w) / 2 + 20}
          y2={(svgSize + h) / 2 - 20}
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Inner Height text */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          x={(svgSize - w) / 2 + 35}
          y={svgSize / 2}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="14"
          fontWeight="bold"
          transform={`rotate(-90 ${(svgSize - w) / 2 + 35} ${svgSize / 2})`}
        >
          {height.toFixed(2)} mm
        </motion.text>

        {/* Wall thickness measurement line */}
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          x1={(svgSize + totalWidth) / 2 + 20}
          y1={(svgSize - totalHeight) / 2}
          x2={(svgSize + totalWidth) / 2 + 20}
          y2={(svgSize - totalHeight) / 2 + wallScaled}
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Wall thickness text */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          x={(svgSize + totalWidth) / 2 + 35}
          y={(svgSize - totalHeight) / 2 + wallScaled / 2}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="14"
          fontWeight="bold"
          transform={`rotate(-90 ${(svgSize + totalWidth) / 2 + 35} ${(svgSize - totalHeight) / 2 + wallScaled / 2})`}
        >
          Wall: {wall.toFixed(2)} mm
        </motion.text>
      </svg>
    </motion.div>
  );
};

const TubeLengthSVG = ({ length, size, wall, unit }) => {
  const dimensions = tubeSizes[size] || tubeSizes['8x8'];
  const { width, height } = dimensions;
  const svgHeight = 300;
  const maxWidth = Math.min(window.innerWidth - 40, 600);
  const scale = Math.min(maxWidth / length, 1);
  const scaledLength = length * scale;
  const centerX = (maxWidth - scaledLength) / 2;
  
  // Calculate outer dimensions by adding wall thickness to inner dimensions
  const outerHeight = height + wall * 2;
  const tubeHeight = outerHeight * 2;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full flex justify-center overflow-x-auto"
    >
      <svg width={maxWidth} height={svgHeight} viewBox={`0 0 ${maxWidth} ${svgHeight}`} className="min-w-[300px]">
        <defs>
          <linearGradient id="tubeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#fff', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#fff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#fff', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="innerTubeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#000', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#111', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#000', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#fff', stopOpacity: 0.5 }} />
            <stop offset="50%" style={{ stopColor: '#fff', stopOpacity: 0.5 }} />
            <stop offset="100%" style={{ stopColor: '#fff', stopOpacity: 0.5 }} />
          </linearGradient>
        </defs>
        
        {/* Length measurement line and text */}
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          x1={centerX}
          y1={(svgHeight - tubeHeight) / 2 - 30}
          x2={centerX + scaledLength}
          y2={(svgHeight - tubeHeight) / 2 - 30}
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          x={centerX + scaledLength / 2}
          y={(svgHeight - tubeHeight) / 2 - 45}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="16"
          fontWeight="bold"
        >
          {length} {unit}
        </motion.text>

        {/* Wall thickness measurement line and text */}
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          x1={centerX - 30}
          y1={(svgHeight - tubeHeight) / 2}
          x2={centerX - 30}
          y2={(svgHeight - tubeHeight) / 2 + wall * 2}
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          x={centerX - 45}
          y={(svgHeight - tubeHeight) / 2 + wall}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="16"
          fontWeight="bold"
          transform={`rotate(-90 ${centerX - 45} ${(svgHeight - tubeHeight) / 2 + wall})`}
        >
          Wall: {wall} {unit}
        </motion.text>
        
        {/* Tube body */}
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          x={centerX}
          y={(svgHeight - tubeHeight) / 2}
          width={scaledLength}
          height={tubeHeight}
          fill="url(#tubeGradient)"
        />
        
        {/* Inner tube */}
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          x={centerX}
          y={(svgHeight - height * 2) / 2}
          width={scaledLength}
          height={height * 2}
          fill="url(#innerTubeGradient)"
        />
        
        {/* Top highlight */}
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          x={centerX}
          y={(svgHeight - tubeHeight) / 2}
          width={scaledLength}
          height={2}
          fill="url(#highlightGradient)"
        />
        
        {/* Bottom highlight */}
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          x={centerX}
          y={(svgHeight + tubeHeight) / 2 - 2}
          width={scaledLength}
          height={2}
          fill="url(#highlightGradient)"
        />
      </svg>
    </motion.div>
  );
};

const SquareTube = ({ selectedMaterial, onMaterialChange, materials, shapeType }) => {
  const [tube, setTube] = useState({
    ...defaultTube,
    material: selectedMaterial || 'carbon_fiber',
    size: '8x8',
    wall: 1
  });
  const [results, setResults] = useState(() => calculateResults({
    ...defaultTube,
    material: selectedMaterial || 'carbon_fiber',
    size: '8x8',
    wall: 1
  }, materials));
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addToCartWithAuth } = useCart();

  useEffect(() => {
    if (selectedMaterial) {
      setTube(prev => ({ ...prev, material: selectedMaterial }));
    }
  }, [selectedMaterial]);

  useEffect(() => {
    try {
      setResults(calculateResults(tube, materials));
    } catch (err) {
      setError('Error calculating results. Please check your inputs.');
      console.error('Calculation error:', err);
    }
  }, [tube, materials]);

  const handleChange = (field, value) => {
    if (field === 'material' && onMaterialChange) {
      onMaterialChange(value);
    }
    
    try {
      if (field === 'wall') {
        const wallValue = Math.max(0.2, Math.min(10, parseFloat(value))); // Allow between 0.2mm and 10mm
        setError('');
        setTube((prev) => ({ ...prev, [field]: wallValue }));
        return;
      }
      if (field === 'length' && parseFloat(value) > 1200) {
        setError('Length cannot be more than 1200 mm');
        return;
      }
      setError('');
      setTube((prev) => ({ ...prev, [field]: value }));
    } catch (err) {
      setError('Error updating tube properties. Please try again.');
      console.error('Update error:', err);
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(100, value));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    // Create a product object for the tube
    const product = {
      id: `square_tube_${tube.material}_${tube.size}_${tube.wall}`,
      title: `Square Tube - ${materials[tube.material].label}`,
      category: 'Composite Tubes',
      images: [materials[tube.material].bgImages[shapeType]], // Use shape-specific image
      details: {
        material: materials[tube.material].label,
        size: tube.size,
        wall: `${tube.wall}mm`,
        weight: `${results.mass}g`,
        length: `${tube.length}mm`,
      },
      isTubeProduct: true,
      tubeType: 'square',
      dimensions: {
        size: tube.size,
        wallThickness: tube.wall,
        length: tube.length,
        unit: tube.unit
      }
    };

    // Create calculations object
    const calculations = {
      area: parseFloat(results.area) || 0,
      weight: parseFloat(results.mass) / 1000 || 0, // Convert to kg
      mass: parseFloat(results.mass) || 0,
      price: parseFloat(results.price) || 0,
      mrp: parseFloat(results.price) || 0,
      quantity: quantity,
      length: tube.length / 1000 // Convert mm to m and store in calculations
    };

    // Use the global cart function with authentication check
    addToCartWithAuth(product, calculations, quantity, navigate);
  };

  return (
    <div className="w-full">
      {/* Material Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-neutral-200 mb-4 text-center sm:text-left">
          Material Selection
        </h3>
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          <label className="text-neutral-300 text-sm font-medium">Material:</label>
          <select
            className={selectButton()}
            value={tube.material}
            onChange={(e) => handleChange('material', e.target.value)}
          >
            <option value="carbon_fiber">Carbon Fiber</option>
            <option value="glass_fiber">Glass Fiber</option>
            <option value="carbon_kevlar">Carbon Kevlar</option>
          </select>
          
          <label className="text-neutral-300 text-sm font-medium">Size:</label>
          <select
            className={selectButton()}
            value={tube.size}
            onChange={(e) => handleChange('size', e.target.value)}
          >
            {Object.keys(tubeSizes).map((size) => (
              <option key={size} value={size}>
                {size} mm
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
        {/* Input Fields */}
        <div className="space-y-4 lg:space-y-6">
          <h3 className="text-lg font-semibold text-neutral-200 mb-3 lg:mb-4">
            Dimensions
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-center">
              <label className="block text-neutral-300 text-sm font-medium mb-2">
                Wall Thickness (mm)
              </label>
              <input
                type="number"
                step="0.1"
                className={inputStyle(error.includes('Wall'))}
                value={tube.wall}
                onChange={(e) => handleChange('wall', e.target.value)}
                autoComplete="off"
              />
            </div>
            
            <div className="text-center">
              <label className="block text-neutral-300 text-sm font-medium mb-2">
                Length (mm)
              </label>
              <input
                type="number"
                step="any"
                max="1200"
                className={inputStyle(error.includes('Length'))}
                value={tube.length}
                onChange={(e) => handleChange('length', e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Results */}
          <div className="mt-6 lg:mt-8 space-y-3 lg:space-y-4">
            <h3 className="text-lg font-semibold text-neutral-200">
              Calculations
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-neutral-800/50 rounded-lg p-4 text-center">
                <p className="text-neutral-400 text-sm mb-1">Mass</p>
                <p className="text-xl font-semibold text-white">
                  {results.mass} <span className="text-sm text-neutral-400">grams</span>
                </p>
              </div>
              
              <div className="bg-neutral-800/50 rounded-lg p-4 text-center">
                <p className="text-neutral-400 text-sm mb-1">Wall Thickness</p>
                <p className="text-xl font-semibold text-white">
                  {results.wall} <span className="text-sm text-neutral-400">mm</span>
                </p>
              </div>
              
              <div className="bg-neutral-800/50 rounded-lg p-4 text-center">
                <p className="text-neutral-400 text-sm mb-1">Price</p>
                <p className="text-xl font-semibold text-white">
                  ₹{results.price}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Visualization */}
        <div className="flex flex-col items-center space-y-6">
          <div className="w-full">
            <h3 className="text-lg font-semibold text-neutral-200 mb-2 lg:mb-3 text-center">
              Cross Section View
            </h3>
            <div className="w-full bg-neutral-800/30 rounded-lg p-2 lg:p-3">
              <TubeSVG size={tube.size} wall={Number(tube.wall)} />
            </div>
          </div>
          
          <div className="w-full">
            <h3 className="text-lg font-semibold text-neutral-200 mb-2 lg:mb-3 text-center">
              Side View
            </h3>
            <div className="w-full bg-neutral-800/30 rounded-lg p-2 lg:p-3">
              <TubeLengthSVG 
                length={Number(tube.length)} 
                size={tube.size}
                wall={Number(tube.wall)}
                unit={tube.unit}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add to Cart Section */}
      <div className="border-t border-neutral-700 pt-3 sm:pt-4 lg:pt-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-neutral-300 text-sm font-medium">Quantity:</span>
            <div className="flex items-center">
              <button
                className="w-8 h-8 rounded-l-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors duration-200 flex items-center justify-center"
                onClick={() => handleQuantityChange(quantity - 1)}
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-16 h-8 text-center bg-neutral-800 text-white focus:outline-none focus:bg-neutral-700 transition-colors duration-200"
              />
              <button
                className="w-8 h-8 rounded-r-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors duration-200 flex items-center justify-center"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
            onClick={handleAddToCart}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.293 1.293A1 1 0 005 15h1.414m5.586 0h9m-7 4a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SquareTube; 