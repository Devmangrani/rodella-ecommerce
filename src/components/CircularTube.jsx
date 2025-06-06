import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const materials = {
  carbon_fiber: { density: 1.6, label: 'Carbon Fiber' },
  aluminum: { density: 2.7, label: 'Glass Fiber' },
  steel: { density: 7.85, label: 'Carbon Kevlar' },
};



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

function calculateResults({ material, wall, inside, length, unit }) {
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

const CircularTube = () => {
  const [tube, setTube] = useState(defaultTube);
  const [results, setResults] = useState(() => calculateResults(defaultTube));
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    setResults(calculateResults(tube));
  }, [tube]);

  const handleChange = (field, value) => {
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
            Circular Tube 
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4 sm:mb-8 w-full max-w-3xl">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="formfield flex flex-col items-center"
            >
              <p className="text-neutral-300 text-sm mb-1">Wall Thickness (mm)</p>
              <input
                type="number"
                step="0.1"
                min="0.2"
                max="10"
                className={inputStyle(true)}
                value={tube.wall}
                onChange={(e) => handleChange('wall', parseFloat(e.target.value))}
                autoComplete="off"
              />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="formfield flex flex-col items-center"
            >
              <p className="text-neutral-300 text-sm mb-1">Inner Diameter (mm)</p>
              <select
                className={`${selectButton(false)} w-22 ${error ? 'border-red-500' : ''}`}
                value={tube.inside}
                onChange={(e) => handleChange('inside', parseFloat(e.target.value))}
              >
                {insideDiameters.map((diameter) => (
                  <option key={diameter} value={diameter}>
                    {diameter}
                  </option>
                ))}
              </select>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="formfield flex flex-col items-center"
            >
              <p className="text-neutral-300 text-sm mb-1">Length (mm)</p>
              <input
                type="number"
                step="any"
                max="1100"
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
              <TubeSVG outside={Number(results.outside)} inside={Number(tube.inside)} />
            </motion.div>

            <motion.div 
              className="flex-1 w-full max-w-[600px]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-neutral-300 text-center mb-4 text-lg font-semibold">Side View</p>
              <TubeLengthSVG 
                length={Number(tube.length)} 
                outside={Number(results.outside)} 
                inside={Number(tube.inside)}
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

export default CircularTube; 