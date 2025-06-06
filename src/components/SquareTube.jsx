import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const materials = {
  carbon_fiber: { density: 1.6, label: 'Carbon Fiber' },
  aluminum: { density: 2.7, label: 'Aluminum' },
  steel: { density: 7.85, label: 'Steel' },
};

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

function calculateResults({ material, size, wall, length, unit }) {
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
  };
}

const inputStyle = (active) =>
  `w-20 px-2 py-1 rounded-lg bg-neutral-900/50 border border-neutral-700 text-center text-white text-lg focus:outline-none focus:ring-2 focus:ring-neutral-600 transition-all duration-300 hover:border-neutral-600 ${
    active ? 'ring-2 ring-neutral-600' : ''
  }`;

const selectButton = (active) =>
  `px-6 py-3 rounded-xl text-base font-medium transition-all duration-300 transform hover:scale-105 ${
    active 
      ? 'bg-neutral-600 text-white shadow-lg shadow-neutral-600/20' 
      : 'bg-neutral-900/50 text-neutral-300 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50'
  }`;

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

const SquareTube = () => {
  const [tube, setTube] = useState({
    ...defaultTube,
    size: '8x8', // Ensure size is set in initial state
    wall: 1 // Ensure wall thickness starts at 1mm
  });
  const [results, setResults] = useState(() => calculateResults({
    ...defaultTube,
    size: '8x8',
    wall: 1 // Ensure wall thickness starts at 1mm
  }));
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      setResults(calculateResults(tube));
    } catch (err) {
      setError('Error calculating results. Please check your inputs.');
      console.error('Calculation error:', err);
    }
  }, [tube]);

  const handleChange = (field, value) => {
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
    // TODO: Implement cart functionality
    console.log('Adding to cart:', { ...tube, quantity });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full bg-black text-white font-sans"
    >
      <div className="w-full h-full py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-4xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Square Tube
          </motion.h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6  border-neutral-800 w-full"
        >
          <div className="flex flex-col items-center">
          
          <div className="formfield flex flex-wrap gap-2 mb-4 sm:mb-8 justify-center">
            <div className="flex items-center gap-2">
              <p className="text-neutral-300 text-sm">Material:</p>
              <select
                className={selectButton(false) + ' w-42 sm:w-42'}
                value={tube.material}
                onChange={(e) => handleChange('material', e.target.value)}
              >
                <option value="carbon_fiber">Carbon Fiber</option>
                <option value="aluminum">Aluminum</option>
                <option value="steel">Steel</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-neutral-300 text-sm">Size:</p>
              <select
                className={selectButton(false) + ' w-42 sm:w-42'}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 sm:mb-8 w-full max-w-3xl">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="formfield flex flex-col items-center"
            >
              <p className="text-neutral-300 text-sm mb-1">Wall Thickness</p>
              <input
                type="number"
                step="0.1"
                className={inputStyle(true)}
                value={tube.wall}
                onChange={(e) => handleChange('wall', e.target.value)}
                autoComplete="off"
              />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="formfield flex flex-col items-center"
            >
              <p className="text-neutral-300 text-sm mb-1">Length (mm)</p>
              <input
                type="number"
                step="any"
                max="1200"
                className={`${inputStyle(true)} ${error ? 'border-red-500' : ''}`}
                value={tube.length}
                onChange={(e) => handleChange('length', e.target.value)}
                autoComplete="off"
              />
            </motion.div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mb-4 text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-12 w-full">
            <motion.div 
              className="flex-1 w-full max-w-[300px]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-neutral-300 text-center mb-4 text-lg font-semibold">Cross Section View</p>
              <TubeSVG size={tube.size} wall={Number(tube.wall)} />
            </motion.div>

            <motion.div 
              className="flex-1 w-full max-w-[600px]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-neutral-300 text-center mb-4 text-lg font-semibold">Side View</p>
              <TubeLengthSVG 
                length={Number(tube.length)} 
                size={tube.size}
                wall={Number(tube.wall)}
                unit={tube.unit}
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl mt-8 sm:mt-12">
            <div className="bg-neutral-800/50 p-3 sm:p-4 rounded-lg">
              <p className="text-neutral-300 text-sm">Wall Thickness</p>
              <p className="text-lg sm:text-xl">{results.wall} mm</p>
            </div>
          
            <div className="bg-neutral-800/50 p-3 sm:p-4 rounded-lg">
              <p className="text-neutral-300 text-sm">Mass</p>
              <p className="text-lg sm:text-xl">{results.mass} g</p>
            </div>

            <div className="bg-neutral-800/50 p-3 sm:p-4 rounded-lg">
              <p className="text-neutral-300 text-sm">Price</p>
              <p className="text-lg sm:text-xl">{results.mass} rs</p>
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="w-full max-w-3xl mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-neutral-300 text-sm">Quantity:</p>
              <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-l-lg bg-neutral-900/50 border border-neutral-700 text-white hover:border-neutral-600 transition-all duration-300"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  -
                </motion.button>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 h-8 text-center bg-neutral-900/50 border-t border-b border-neutral-700 text-white focus:outline-none focus:border-neutral-600"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-r-lg bg-neutral-900/50 border border-neutral-700 text-white hover:border-neutral-600 transition-all duration-300"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </motion.button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-2 rounded-lg bg-neutral-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              onClick={handleAddToCart}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Add to Cart
            </motion.button>
          </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SquareTube; 