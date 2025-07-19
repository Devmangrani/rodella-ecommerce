import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/myState';

const materials = {
  carbon_fiber: { 
    density: 2, // g/cm³
    pricePerGram: 5, // ₹5 per gram
    label: 'Carbon Fiber', 
    bgImage: '/assets/carbon-fiber-sheet.jpg' 
  },
  glass_fiber: { 
    density: 2.7, // g/cm³
    pricePerGram: 3, // ₹3 per gram
    label: 'Glass Fiber', 
    bgImage: '/assets/glass-fiber-sheet.png' 
  },
  // steel: { density: 7.85, label: 'Steel', bgImage: '/assets/Steel plated.jpg' },
};

const defaultPlate = {
  material: 'carbon_fiber',
  length: 400,
  breadth: 300,
  thickness: 2,
  unit: 'mm',
};

function convertToMM(value, unit) {
  if (unit === 'mm') return value;
  if (unit === 'inch') return value * 25.4;
  return value;
}

function calculateResults({ material, length, breadth, thickness, unit }) {
  // Convert all to mm for calculation
  const lenMM = convertToMM(Number(length), unit);
  const breadthMM = convertToMM(Number(breadth), unit);
  const thicknessMM = convertToMM(Number(thickness), unit);
  
  const volume = lenMM * breadthMM * thicknessMM; // mm³
  const area = lenMM * breadthMM; // mm²
  // Mass calculation: volume(mm³) ÷ 1000 = volume(cm³), then × density(g/cm³) = mass(g)
  const mass = volume * materials[material].density / 1000; // g
  // Price calculation: mass(g) × price per gram(₹/g) = total price(₹)
  const price = mass * materials[material].pricePerGram;
  
  return {
    area: area.toFixed(2),
    mass: mass.toFixed(2),
    price: price.toFixed(2),
  };
}

const inputStyle = (hasError) =>
  `w-24 px-3 py-2 rounded-lg bg-neutral-800/70 backdrop-blur-sm text-center text-white text-base focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-all duration-200 hover:bg-neutral-700/70 ${
    hasError ? 'ring-2 ring-red-500/70' : ''
  }`;

const selectButton = () =>
  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-neutral-800/70 text-neutral-200 hover:bg-neutral-700/70 focus:outline-none focus:ring-2 focus:ring-neutral-500`;

const PlateSVG = ({ length, breadth, thickness }) => {
  const svgSize = 1200;
  const padding = 120;
  
  const baseX = padding;
  const baseY = svgSize - padding - 400;
  
  const scale = Math.min((svgSize - 2 * padding) / (length + breadth), 
                        (svgSize - 2 * padding) / (thickness + length)) * 1.2;
                        
  const scaledLength = length * scale;
  const scaledBreadth = breadth * scale;
  const scaledThickness = thickness * scale * 2.5;
  
  const angle = Math.PI / 6;
  const cos30 = Math.cos(angle);
  const sin30 = Math.sin(angle);

  const points = {
    frontBottomLeft: [baseX, baseY],
    frontBottomRight: [baseX + scaledLength, baseY],
    frontTopRight: [baseX + scaledLength, baseY - scaledThickness],
    frontTopLeft: [baseX, baseY - scaledThickness],
    backBottomLeft: [baseX + scaledBreadth * cos30, baseY - scaledBreadth * sin30],
    backBottomRight: [baseX + scaledLength + scaledBreadth * cos30, baseY - scaledBreadth * sin30],
    backTopRight: [baseX + scaledLength + scaledBreadth * cos30, baseY - scaledThickness - scaledBreadth * sin30],
    backTopLeft: [baseX + scaledBreadth * cos30, baseY - scaledThickness - scaledBreadth * sin30],
  };

  const pointsToPath = (pointArray) => pointArray.map(p => p.join(',')).join(' ');

  return (
    <div className="w-full flex justify-center">
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="max-w-[500px] h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="topGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="frontGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="sideGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#f5f5f5', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Top face */}
        <polygon
          points={pointsToPath([
            points.frontTopLeft,
            points.frontTopRight,
            points.backTopRight,
            points.backTopLeft,
          ])}
          fill="url(#topGradient)"
          stroke="#ffffff"
          strokeWidth="1.5"
        />

        {/* Right face */}
        <polygon
          points={pointsToPath([
            points.frontTopRight,
            points.frontBottomRight,
            points.backBottomRight,
            points.backTopRight,
          ])}
          fill="url(#sideGradient)"
          stroke="#ffffff"
          strokeWidth="1.5"
        />

        {/* Front face */}
        <polygon
          points={pointsToPath([
            points.frontBottomLeft,
            points.frontBottomRight,
            points.frontTopRight,
            points.frontTopLeft,
          ])}
          fill="url(#frontGradient)"
          stroke="#ffffff"
          strokeWidth="1.5"
        />

        {/* Dimension lines */}
        <line
          x1={points.frontBottomLeft[0]}
          y1={points.frontBottomLeft[1] + 30}
          x2={points.frontBottomRight[0]}
          y2={points.frontBottomRight[1] + 30}
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeDasharray="4,2"
        />
        <text
          x={(points.frontBottomLeft[0] + points.frontBottomRight[0]) / 2}
          y={points.frontBottomLeft[1] + 55}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="24"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {length} mm
        </text>

        <line
          x1={points.frontBottomRight[0]}
          y1={points.frontBottomRight[1]}
          x2={points.backBottomRight[0]}
          y2={points.backBottomRight[1]}
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeDasharray="4,2"
        />
        <text
          x={points.frontBottomRight[0] + (points.backBottomRight[0] - points.frontBottomRight[0]) / 2}
          y={points.frontBottomRight[1] + (points.backBottomRight[1] - points.frontBottomRight[1]) / 2 - 15}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="24"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {breadth} mm
        </text>

        <line
          x1={points.frontBottomLeft[0] - 30}
          y1={points.frontBottomLeft[1]}
          x2={points.frontTopLeft[0] - 30}
          y2={points.frontTopLeft[1]}
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeDasharray="4,2"
        />
        <text
          x={points.frontBottomLeft[0] - 55}
          y={(points.frontBottomLeft[1] + points.frontTopLeft[1]) / 2}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="24"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          transform={`rotate(-90 ${points.frontBottomLeft[0] - 55} ${(points.frontBottomLeft[1] + points.frontTopLeft[1]) / 2})`}
        >
          {thickness} mm
        </text>
      </svg>
    </div>
  );
};

const CompositePlates = () => {
  const [plate, setPlate] = useState(defaultPlate);
  const [results, setResults] = useState(() => calculateResults(defaultPlate));
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [showGoToCart, setShowGoToCart] = useState(false);
  const navigate = useNavigate();
  const { addToCartWithAuth } = useCart();

  useEffect(() => {
    try {
      setResults(calculateResults(plate));
    } catch (err) {
      setError('Error calculating results. Please check your inputs.');
      console.error('Calculation error:', err);
    }
  }, [plate]);

  const handleChange = (field, value) => {
    try {
      if (field === 'thickness') {
        const thicknessValue = Math.max(0.2, Math.min(10, parseFloat(value)));
        setError('');
        setPlate((prev) => ({ ...prev, [field]: thicknessValue }));
        return;
      }
      
      if (field === 'length' || field === 'breadth') {
        const numValue = parseFloat(value);
        if (numValue < 200) {
          setError(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot be less than 200 mm`);
        } else if (numValue > 1000) {
          setError(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot be more than 1000 mm`);
        } else {
          setError('');
        }
        setPlate((prev) => ({ ...prev, [field]: value }));
        return;
      }
      
      setError('');
      setPlate((prev) => ({ ...prev, [field]: value }));
    } catch (err) {
      setError('Error updating plate properties. Please try again.');
      console.error('Update error:', err);
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(100, value));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    const product = {
      id: `composite_plate_${plate.material}_${plate.length}_${plate.breadth}_${plate.thickness}`,
      title: `Composite Plate - ${materials[plate.material].label}`,
      category: 'Composite Plates',
      images: [materials[plate.material].bgImage], // Use the actual material image
      details: {
        material: materials[plate.material].label,
        length: `${plate.length}mm`,
        breadth: `${plate.breadth}mm`,
        thickness: `${plate.thickness}mm`,
        weight: `${results.mass}g`,
      },
      isCompositePlate: true,
      dimensions: {
        length: plate.length,
        breadth: plate.breadth,
        thickness: plate.thickness,
        unit: plate.unit
      }
    };

    const calculations = {
      area: parseFloat(results.area) || 0,
      weight: parseFloat(results.mass) / 1000 || 0,
      mass: parseFloat(results.mass) || 0,
      price: parseFloat(results.price) || 0,
      mrp: parseFloat(results.price) || 0,
      quantity: quantity
    };

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full bg-black text-white font-sans pt-20 relative mt-6"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out"
        style={{ 
          backgroundImage: `url(${materials[plate.material].bgImage})`,
          filter: 'blur(0.5px)',
        }}
      />
      <div className="absolute inset-0 bg-black/70" />
      
      <div className="relative z-10 w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Composite Plate Specifications
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto">
            Configure your custom composite plate dimensions and specifications
          </p>
        </motion.div>
        
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full"
          >
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 backdrop-blur-md rounded-lg p-4 sm:p-6 shadow-2xl border border-neutral-600/70">
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
                      value={plate.material}
                      onChange={(e) => handleChange('material', e.target.value)}
                    >
                      <option value="carbon_fiber">Carbon Fiber</option>
                      <option value="glass_fiber">Glass Fiber</option>
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
                        Length (mm)
                      </label>
                      <input
                        type="number"
                        className="w-20 sm:w-24 px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-neutral-800/70 text-center text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-all duration-200 hover:bg-neutral-700/70 border border-neutral-700"
                        value={plate.length}
                        onChange={(e) => handleChange('length', e.target.value)}
                        placeholder="200-1000"
                        autoComplete="off"
                      />
                    </div>
                    
                    <div className="text-center">
                      <label className="block text-neutral-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                        Width (mm)
                      </label>
                      <input
                        type="number"
                        className="w-20 sm:w-24 px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-neutral-800/70 text-center text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-all duration-200 hover:bg-neutral-700/70 border border-neutral-700"
                        value={plate.breadth}
                        onChange={(e) => handleChange('breadth', e.target.value)}
                        placeholder="200-1000"
                        autoComplete="off"
                      />
                    </div>
                    
                    <div className="text-center">
                      <label className="block text-neutral-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                        Thickness (mm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        className="w-20 sm:w-24 px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-neutral-800/70 text-center text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-all duration-200 hover:bg-neutral-700/70 border border-neutral-700"
                        value={plate.thickness}
                        onChange={(e) => handleChange('thickness', e.target.value)}
                        placeholder="0.2-10"
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
                      <p className="text-neutral-400 text-xs mb-1">Area</p>
                      <p className="text-sm sm:text-lg font-semibold text-white">
                        {results.area} <span className="text-xs text-neutral-400">mm²</span>
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

                {/* 3D Preview Visualization - Mobile/Small screens only */}
                <div className="mb-4 lg:hidden">
                  <h3 className="text-sm font-semibold text-neutral-200 mb-2 text-center">
                    3D Preview
                  </h3>
                  <div className="w-full bg-transparent rounded-lg p-2" style={{ height: '200px' }}>
                    <PlateSVG 
                      length={Number(plate.length) >= 200 && Number(plate.length) <= 1000 ? Number(plate.length) : 400} 
                      breadth={Number(plate.breadth) >= 200 && Number(plate.breadth) <= 1000 ? Number(plate.breadth) : 300}
                      thickness={Number(plate.thickness)}
                    />
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
                {/* 3D Preview Visualization */}
                <div className="lg:w-full">
                  <h3 className="text-sm font-semibold text-neutral-200 mb-2 text-center lg:mb-4">
                    3D Preview
                  </h3>
                  <div className="w-full bg-transparent rounded-lg p-2 lg:p-4" style={{ height: '320px' }}>
                    <PlateSVG 
                      length={Number(plate.length) >= 200 && Number(plate.length) <= 1000 ? Number(plate.length) : 400} 
                      breadth={Number(plate.breadth) >= 200 && Number(plate.breadth) <= 1000 ? Number(plate.breadth) : 300}
                      thickness={Number(plate.thickness)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompositePlates; 