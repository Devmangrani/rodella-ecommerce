import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
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
  
  // Calculate price based on material and mass
  let price = 0;
  if (material === 'carbon_fiber') {
    // Convert mass from grams to kilograms and apply Carbon Fiber Circular tube rate
    const massInKg = mass / 1000;
    const basePrice = massInKg * 13500; // 13,500 per kg for Carbon Fiber Circular tube
    price = basePrice * 1.10; // Add 10% margin
  } else if (material === 'glass_fiber') {
    // Convert mass from grams to kilograms and apply Glass Fiber rate
    const massInKg = mass / 1000;
    const basePrice = massInKg * 9000; // 9,000 per kg for Glass Fiber
    price = basePrice *1.10; // Add 10% margin
  }
  
  return {
    wall: wallMM.toFixed(3),
    outside: outMM.toFixed(3),
    area: area.toFixed(2),
    mass: mass.toFixed(2),
    I: I.toFixed(0),
    J: J.toFixed(2),
    D: D.toFixed(2),
    price: price.toFixed(2),
  };
}

const inputStyle = (hasError) =>
  `w-24 px-3 py-2 rounded-lg bg-neutral-800/70 backdrop-blur-sm text-center text-white text-base focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-all duration-200 hover:bg-neutral-700/70 ${
    hasError ? 'ring-2 ring-red-500/70' : ''
  }`;

const selectButton = () =>
  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-neutral-800/70 text-neutral-200 hover:bg-neutral-700/70 focus:outline-none focus:ring-2 focus:ring-neutral-500`;

const TubeSVG = ({ outside, inside, size = 180 }) => {
  const maxOuterDiameter = size * 0.99; // Adjust the visual scaling proportionally
  
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

const CircularTube = ({ selectedMaterial, onMaterialChange, materials, shapeType }) => {
  const [tube, setTube] = useState({ ...defaultTube, material: selectedMaterial || 'carbon_fiber' });
  const [results, setResults] = useState(() => calculateResults({ ...defaultTube, material: selectedMaterial || 'carbon_fiber' }, materials));
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [showGoToCart, setShowGoToCart] = useState(false);
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
    setShowGoToCart(true);
    
    // Hide the button after 5 seconds
    setTimeout(() => {
      setShowGoToCart(false);
    }, 5000);
  };

  // Navigate to cart
  const handleGoToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="w-full">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 bg-black/60 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-2xl border border-neutral-600/70">
        {/* Left Column - Controls and Data */}
        <div className="lg:col-span-1">
          {/* Material Selection */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-neutral-200 mb-3 text-center sm:text-left">
              Material Selection
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center sm:justify-start">
              <label className="text-neutral-200 text-sm font-semibold">Material:</label>
              <select
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-neutral-800/70 text-neutral-200 hover:bg-neutral-700/70 focus:outline-none focus:ring-2 focus:ring-neutral-500 border border-neutral-700"
                value={tube.material}
                onChange={(e) => handleChange('material', e.target.value)}
              >
                <option value="carbon_fiber">Carbon Fiber</option>
                <option value="glass_fiber">Glass Fiber</option>
                {/* <option value="carbon_kevlar">Carbon Kevlar</option> */}
              </select>
            </div>
          </div>

          {/* Dimensions */}
          <div className="mb-4">
            <h3 className="text-base font-semibold text-neutral-200 mb-3 text-center sm:text-left">
              Dimensions
            </h3>
            
            <div className="flex flex-wrap justify-center sm:justify-start items-end gap-3 sm:gap-4">
              <div className="text-center">
                <label className="block text-neutral-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Wall (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="10"
                  className="w-20 sm:w-24 px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-neutral-800/70 text-center text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-all duration-200 hover:bg-neutral-700/70 border border-neutral-700"
                  value={tube.wall}
                  onChange={(e) => handleChange('wall', parseFloat(e.target.value))}
                  autoComplete="off"
                />
              </div>
              
              <div className="text-center">
                <label className="block text-neutral-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Inner Ø (mm)
                </label>
                <select
                  className="w-20 sm:w-24 px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-neutral-800/70 text-center text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-all duration-200 hover:bg-neutral-700/70 border border-neutral-700"
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
                <label className="block text-neutral-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Length (mm)
                </label>
                <input
                  type="number"
                  step="any"
                  max="1100"
                  className="w-20 sm:w-24 px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-neutral-800/70 text-center text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-all duration-200 hover:bg-neutral-700/70 border border-neutral-700"
                  value={tube.length}
                  onChange={(e) => handleChange('length', e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-xs sm:text-sm text-center bg-red-400/10 rounded-lg p-2 mt-3">
                {error}
              </div>
            )}
          </div>

          {/* Calculations */}
          <div className="mb-4 lg:mb-6">
            <h3 className="text-base font-semibold text-neutral-200 mb-3 text-center sm:text-left">
              Calculations
            </h3>
            
            <div className="grid grid-cols-3 gap-2 lg:gap-3">
              <div className="bg-neutral-800/50 rounded-lg p-2 sm:p-3 text-center">
                <p className="text-neutral-400 text-xs mb-1">Mass</p>
                <p className="text-sm sm:text-lg font-semibold text-white">
                  {results.mass} <span className="text-xs text-neutral-400">g</span>
                </p>
              </div>
              
              <div className="bg-neutral-800/50 rounded-lg p-2 sm:p-3 text-center">
                <p className="text-neutral-400 text-xs mb-1">Wall</p>
                <p className="text-sm sm:text-lg font-semibold text-white">
                  {results.wall} <span className="text-xs text-neutral-400">mm</span>
                </p>
              </div>
              
              <div className="bg-neutral-800/50 rounded-lg p-2 sm:p-3 text-center">
                <p className="text-neutral-400 text-xs mb-1">Price</p>
                <p className="text-sm sm:text-lg font-semibold text-white">
                  ₹{results.price}
                </p>
              </div>
            </div>
          </div>

          {/* Cross Section Visualization - Mobile/Small screens only */}
          <div className="mb-4 lg:hidden">
            <h3 className="text-sm font-semibold text-neutral-200 mb-2 text-center">
              Cross Section
            </h3>
            <div className="w-full bg-neutral-800/30 rounded-lg p-2" style={{ height: '200px' }}>
              <TubeSVG outside={Number(results.outside)} inside={Number(tube.inside)} size={180} />
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
                  <span className="w-16 h-8 text-center bg-neutral-800 text-white flex items-center justify-center">
                    {quantity}
                  </span>
                  <button
                    className="w-8 h-8 rounded-r-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors duration-200 flex items-center justify-center"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart and Go to Cart Buttons */}
              <div className="space-y-3">
                <AnimatePresence mode="wait">
                  {!showGoToCart ? (
                    <motion.button
                      key="add-to-cart"
                      initial={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
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
                  ) : (
                    <motion.button
                      key="go-to-cart"
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        duration: 0.3,
                        ease: "easeOut"
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                      onClick={handleGoToCart}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.293 1.293A1 1 0 005 15h1.414m5.586 0h9m-7 4a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Go to Cart
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Visualization (Large screens only) */}
        <div className="hidden lg:col-span-1 lg:flex lg:items-center lg:justify-center">
          {/* Cross Section Visualization */}
          <div className="lg:w-full">
            <h3 className="text-sm font-semibold text-neutral-200 mb-2 text-center lg:mb-4">
              Cross Section
            </h3>
            <div className="w-full bg-neutral-800/30 rounded-lg p-2 lg:p-4" style={{ height: '320px' }}>
              <TubeSVG outside={Number(results.outside)} inside={Number(tube.inside)} size={280} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularTube; 