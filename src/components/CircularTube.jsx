import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/myState';

const defaultTube = {
  material: 'carbon_fiber',
  wall: 1,
  inside: 14,
  length: 400,
  unit: 'mm',
};

const insideDiameters = [
  4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15,
  16, 17,18,19, 20, 21, 22, 23, 24, 25, 26,
  27, 28, 30, 31, 32, 33, 34, 35, 36, 37,
  38, 40, 42, 44, 45, 46, 48, 50,
  52, 54, 56, 57, 60, 62, 64, 67, 70,
  73, 102, 109, 143, 147
];

function convertToMM(value, unit) {
  if (unit === 'mm') return value;
  if (unit === 'inch') return value * 25.4;
  return value;
}

function calculateResults({ material, wall, inside, length, unit }, materials) {
  // Convert all to mm for calculation
  const wallMM = convertToMM(Number(wall), unit);
  const inMM = convertToMM(Number(inside), unit);
  const lenMM = convertToMM(Number(length), unit);
  const outMM = inMM + (2 * wallMM); // Calculate outer diameter from wall thickness
  
  const area = Math.PI * (Math.pow(outMM / 2, 2) - Math.pow(inMM / 2, 2));
  const I = Math.PI * (Math.pow(outMM, 4) - Math.pow(inMM, 4)) / 64;
  const J = Math.PI * (Math.pow(outMM, 4) - Math.pow(inMM, 4)) / 32;
  
  const mass = area * lenMM * materials[material].density / 1000; // g
  // Deflection (simplified, not real-world accurate)
  const D = (0.9 * 9.81 * Math.pow(lenMM, 3)) / (3 * 200 * I);
  
  return {
    wall: wallMM.toFixed(3),
    outside: outMM.toFixed(3),
    area: area.toFixed(2),
    mass: mass.toFixed(2),
    I: I.toFixed(0),
    J: J.toFixed(2),
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

const TubeSVG = ({ outside, inside }) => {
  const size = 300;
  const maxOuterDiameter = 280; // Maximum visual size for outer circle
  
  // Calculate scaling factor to maintain proportions
  const scale = maxOuterDiameter / Math.max(outside, 1);
  const out = outside * scale;
  const in_ = inside * scale;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full flex justify-center"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Tube visualization */}
        <motion.circle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          cx={size / 2} cy={size / 2} r={out / 2} fill="#FFF"
        />
        <motion.circle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          cx={size / 2} cy={size / 2} r={in_ / 2} fill="#222"
        />

        {/* Inner diameter measurement line */}
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          x1={size / 2 - in_ / 2}
          y1={size / 2 + 30}
          x2={size / 2 + in_ / 2}
          y2={size / 2 + 30}
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Inner diameter text */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          x={size / 2}
          y={size / 2 + 45}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="14"
          fontWeight="bold"
        >
          ID: {inside} mm
        </motion.text>

        {/* Outer diameter measurement line */}
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          x1={size / 2 - out / 2}
          y1={size / 2 + 60}
          x2={size / 2 + out / 2}
          y2={size / 2 + 60}
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Outer diameter text */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          x={size / 2}
          y={size / 2 + 75}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="14"
          fontWeight="bold"
        >
          OD: {outside} mm
        </motion.text>
      </svg>
    </motion.div>
  );
};

const TubeLengthSVG = ({ length, outside, inside, unit }) => {
  const height = 300;
  const maxWidth = Math.min(window.innerWidth - 40, 600); // Make width responsive to screen size
  
  // Limit the visual inner diameter to 102mm
  const maxVisualInside = 102;
  const visualInside = Math.min(inside, maxVisualInside);
  
  // Calculate wall thickness for visual representation
  const wall = (outside - inside) / 2;
  const visualOutside = visualInside + (2 * wall);
  
  const tubeHeight = visualOutside * 2;
  
  // Limit the visual length to 485mm
  const maxVisualLength = 485;
  const visualLength = Math.min(length, maxVisualLength);
  
  // Scale the length to fit within maxWidth while maintaining proportions
  const scale = Math.min(maxWidth / visualLength, 1);
  const scaledLength = visualLength * scale;
  
  // Calculate center position for small lengths
  const centerX = (maxWidth - scaledLength) / 2;
  
  // Calculate measurement position based on tube height
  const measurementY = (height - tubeHeight) / 2 - 30; // Position above the tube
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full flex justify-center overflow-x-auto"
    >
      <svg width={maxWidth} height={height} viewBox={`0 0 ${maxWidth} ${height}`} className="min-w-[300px]">
        {/* Tube body with gradient for 3D effect */}
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
        
        {/* Length measurement line and text - positioned above tube */}
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          x1={centerX}
          y1={measurementY + 15}
          x2={centerX + scaledLength}
          y2={measurementY + 15}
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          x={centerX + scaledLength / 2}
          y={measurementY}
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
          y1={(height - tubeHeight) / 2}
          x2={centerX - 30}
          y2={(height - tubeHeight) / 2 + wall * 2}
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          x={centerX - 45}
          y={(height - tubeHeight) / 2 + wall}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="16"
          fontWeight="bold"
          transform={`rotate(-90 ${centerX - 45} ${(height - tubeHeight) / 2 + wall})`}
        >
          T: {wall.toFixed(1)} {unit}
        </motion.text>
        
        {/* Tube body */}
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          x={centerX}
          y={(height - tubeHeight) / 2}
          width={scaledLength}
          height={tubeHeight}
          fill="url(#tubeGradient)"
          rx={0}
        />
        
        {/* Inner tube */}
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          x={centerX}
          y={(height - visualInside * 2) / 2}
          width={scaledLength}
          height={visualInside * 2}
          fill="url(#innerTubeGradient)"
          rx={0}
        />
        
        {/* Top highlight */}
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          x={centerX}
          y={(height - tubeHeight) / 2}
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
          y={(height + tubeHeight) / 2 - 2}
          width={scaledLength}
          height={2}
          fill="url(#highlightGradient)"
        />
      </svg>
    </motion.div>
  );
};

const CircularTube = ({ selectedMaterial, onMaterialChange, materials, shapeType }) => {
  const [tube, setTube] = useState({ ...defaultTube, material: selectedMaterial || 'carbon_fiber' });
  const [results, setResults] = useState(() => calculateResults({ ...defaultTube, material: selectedMaterial || 'carbon_fiber' }, materials));
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
    setResults(calculateResults(tube, materials));
  }, [tube, materials]);

  const handleChange = (field, value) => {
    if (field === 'material' && onMaterialChange) {
      onMaterialChange(value);
    }
    
    if (field === 'wall' && parseFloat(value) < 0.2) {
      setError('Wall thickness cannot be less than 0.2 mm');
      return;
    }
    if (field === 'wall' && parseFloat(value) > 10) {
      setError('Wall thickness cannot be more than 10 mm');
      return;
    }
    if (field === 'inside' && parseFloat(value) >= parseFloat(tube.outside)) {
      setError('Inside diameter cannot be greater than or equal to outside diameter');
      return;
    }
    if (field === 'length' && parseFloat(value) > 1100) {
      setError('Length cannot be more than 1100 mm');
      return;
    }
    setError('');
    setTube((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(100, value));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    // Create a product object for the tube
    const product = {
      id: `circular_tube_${tube.material}_${tube.inside}_${tube.wall}`,
      title: `Circular Tube - ${materials[tube.material].label}`,
      category: 'Composite Tubes',
      images: [materials[tube.material].bgImages[shapeType]], // Use shape-specific image
      details: {
        material: materials[tube.material].label,
        inside: `${tube.inside}mm`,
        wall: `${tube.wall}mm`,
        weight: `${results.mass}g`,
        length: `${tube.length}mm`,
      },
      isTubeProduct: true,
      tubeType: 'circular',
      dimensions: {
        innerDiameter: tube.inside,
        wallThickness: tube.wall,
        length: tube.length,
        outerDiameter: parseFloat(results.outside),
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
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
        {/* Input Fields */}
        <div className="space-y-4 lg:space-y-6">
          <h3 className="text-lg font-semibold text-neutral-200 mb-3 lg:mb-4">
            Dimensions
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <label className="block text-neutral-300 text-sm font-medium mb-2">
                Wall Thickness (mm)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.2"
                max="10"
                className={inputStyle(error.includes('Wall'))}
                value={tube.wall}
                onChange={(e) => handleChange('wall', parseFloat(e.target.value))}
                autoComplete="off"
              />
            </div>
            
            <div className="text-center">
              <label className="block text-neutral-300 text-sm font-medium mb-2">
                Inner Diameter (mm)
              </label>
              <select
                className={inputStyle(error.includes('Inside'))}
                value={tube.inside}
                onChange={(e) => handleChange('inside', parseFloat(e.target.value))}
              >
                {insideDiameters.map((diameter) => (
                  <option key={diameter} value={diameter}>
                    {diameter}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="text-center">
              <label className="block text-neutral-300 text-sm font-medium mb-2">
                Length (mm)
              </label>
              <input
                type="number"
                step="any"
                max="1100"
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
              <TubeSVG outside={Number(results.outside)} inside={Number(tube.inside)} />
            </div>
          </div>
          
          <div className="w-full">
            <h3 className="text-lg font-semibold text-neutral-200 mb-2 lg:mb-3 text-center">
              Side View
            </h3>
            <div className="w-full bg-neutral-800/30 rounded-lg p-2 lg:p-3">
              <TubeLengthSVG 
                length={Number(tube.length)} 
                outside={Number(results.outside)} 
                inside={Number(tube.inside)}
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

export default CircularTube; 