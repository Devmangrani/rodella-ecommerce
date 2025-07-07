import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/myState';



const tubeSizes = {
  '18x28': { width: 28, height: 18 },
  '23.4x36': { width: 36, height: 23.4 },
  '65x75': { width: 75, height: 65 },
  '76x116': { width: 116, height: 76 },
};

const defaultTube = {
  material: 'carbon_fiber',
  size: '18x28',
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
  
  // Moment of inertia for rectangular tube
  const Ix = (wMM * Math.pow(hMM, 3) - (wMM - 2 * wallMM) * Math.pow(hMM - 2 * wallMM, 3)) / 12;
  const Iy = (hMM * Math.pow(wMM, 3) - (hMM - 2 * wallMM) * Math.pow(wMM - 2 * wallMM, 3)) / 12;
  
  const mass = area * lenMM * materials[material].density / 1000; // g
  // Deflection (simplified, not real-world accurate)
  const D = (0.9 * 9.81 * Math.pow(lenMM, 3)) / (3 * 200 * Math.min(Ix, Iy));
  
  // Calculate price based on material and mass
  let price = 0;
  if (material === 'carbon_fiber') {
    // Convert mass from grams to kilograms and apply Carbon Fiber Rectangular tube rate
    const massInKg = mass / 1000;
    const basePrice = massInKg * 1650; // 1,650 per kg for Carbon Fiber Rectangular tube
    price = basePrice * 1.10; // Add 10% margin
  }
  
  return {
    wall: wallMM.toFixed(3),
    area: area.toFixed(2),
    mass: mass.toFixed(2),
    Ix: Ix.toFixed(0),
    Iy: Iy.toFixed(0),
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

const TubeSVG = ({ size: tubeSize, wall, svgSize = 190 }) => {
  const dimensions = tubeSizes[tubeSize] || tubeSizes['18x28'];
  const { width, height } = dimensions;
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
          y1={(svgSize + totalHeight) / 2 + 15}
          x2={(svgSize + totalWidth) / 2}
          y2={(svgSize + totalHeight) / 2 + 15}
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
          y={(svgSize + totalHeight) / 2 + 32}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="12"
          fontWeight="bold"
        >
          Outer Width: {outerWidth.toFixed(1)} mm
        </motion.text>

        {/* Inner Width measurement line */}
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          x1={(svgSize - w) / 2 + 15}
          y1={(svgSize - h) / 2 + 15}
          x2={(svgSize + w) / 2 - 15}
          y2={(svgSize - h) / 2 + 15}
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
          y={(svgSize - h) / 2 + 30}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="12"
          fontWeight="bold"
        >
          IW: {width.toFixed(1)} mm
        </motion.text>

        {/* Outer Height measurement line */}
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          x1={(svgSize - totalWidth) / 2 - 15}
          y1={(svgSize - totalHeight) / 2}
          x2={(svgSize - totalWidth) / 2 - 15}
          y2={(svgSize + totalHeight) / 2}
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Outer Height text */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          x={(svgSize - totalWidth) / 2 - 25}
          y={svgSize / 2}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="12"
          fontWeight="bold"
          transform={`rotate(-90 ${(svgSize - totalWidth) / 2 - 25} ${svgSize / 2})`}
        >
          Outer Height: {outerHeight.toFixed(1)} mm
        </motion.text>

        {/* Inner Height measurement line */}
        <motion.line
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          x1={(svgSize + w) / 2 + 15}
          y1={(svgSize - h) / 2 + 15}
          x2={(svgSize + w) / 2 + 15}
          y2={(svgSize + h) / 2 - 15}
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Inner Height text */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          x={(svgSize + w) / 2 + 25}
          y={svgSize / 2}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="12"
          fontWeight="bold"
          transform={`rotate(-90 ${(svgSize + w) / 2 + 25} ${svgSize / 2})`}
        >
          IH: {height.toFixed(1)} mm
        </motion.text>
      </svg>
    </motion.div>
  );
};



const RectangularTube = ({ selectedMaterial, onMaterialChange, materials, shapeType }) => {
  const [tube, setTube] = useState({
    ...defaultTube,
    material: selectedMaterial || 'carbon_fiber',
    size: '18x28',
    wall: 1
  });
  const [results, setResults] = useState(() => calculateResults({
    ...defaultTube,
    material: selectedMaterial || 'carbon_fiber',
    size: '18x28',
    wall: 1
  }, materials));
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
      id: `rectangular_tube_${tube.material}_${tube.size}_${tube.wall}`,
      title: `Rectangular Tube - ${materials[tube.material].label}`,
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
      tubeType: 'rectangular',
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
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 justify-center sm:justify-start">
              {/* Material Section */}
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <label className="text-neutral-200 text-sm font-semibold">Material:</label>
                <select
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-neutral-800/70 text-neutral-200 hover:bg-neutral-700/70 focus:outline-none focus:ring-2 focus:ring-neutral-500 border border-neutral-700"
                  value={tube.material}
                  onChange={(e) => handleChange('material', e.target.value)}
                >
                  <option value="carbon_fiber">Carbon Fiber</option>
                  <option value="glass_fiber">Glass Fiber</option>
                  <option value="carbon_kevlar">Carbon Kevlar</option>
                </select>
              </div>
              
              {/* Size Section */}
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <label className="text-neutral-200 text-sm font-semibold">Size:</label>
                <select
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-neutral-800/70 text-neutral-200 hover:bg-neutral-700/70 focus:outline-none focus:ring-2 focus:ring-neutral-500 border border-neutral-700"
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
                  className="w-20 sm:w-24 px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-neutral-800/70 text-center text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-all duration-200 hover:bg-neutral-700/70 border border-neutral-700"
                  value={tube.wall}
                  onChange={(e) => handleChange('wall', e.target.value)}
                  autoComplete="off"
                />
              </div>
              
              <div className="text-center">
                <label className="block text-neutral-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Length (mm)
                </label>
                <input
                  type="number"
                  step="any"
                  max="1200"
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
              <TubeSVG size={tube.size} wall={Number(tube.wall)} svgSize={230} />
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
              <TubeSVG size={tube.size} wall={Number(tube.wall)} svgSize={420} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RectangularTube;