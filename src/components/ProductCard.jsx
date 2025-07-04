import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProductCard = ({ 
  product, 
  index = 0,
  onAddToCart = () => {},
  showCategory = true,
  customCategoryColors = {},
  customClassName = "",
  animationDelay = 0.1,
  showLengthInput = true,
  defaultLength = 1,
  onLengthChange = () => {},
  externalLength = null,
  externalImageIndex = null,
  onImageChange = () => {},
  simple = false
}) => {
  // Internal state for length, quantity and image index (used if external state not provided)
  const [internalLength, setInternalLength] = useState(defaultLength);
  const [internalImageIndex, setInternalImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Use external state if provided, otherwise use internal state
  const currentLength = externalLength !== null ? externalLength : internalLength;
  const currentImageIndex = externalImageIndex !== null ? externalImageIndex : internalImageIndex;

  // Function to calculate product details based on length
  const calculateProductDetails = (product, length) => {
    const lengthInMeters = parseFloat(length) || 1;
    const widthInMeters = 1; // 1000mm = 1m
    const area = lengthInMeters * widthInMeters; // sq meters
    const pricePerSqMeter = product.mrp; // Use product's specific MRP per sq meter
    const mrp = area * pricePerSqMeter;
    
    // Handle different product types (reinforcement vs core materials)
    let weight = 0;
    
    if (product.details.weight) {
      // For reinforcement products (e.g., "80 gsm" -> 80)
      const gsmValue = parseInt(product.details.weight.match(/\d+/)[0]);
      weight = area * gsmValue; // weight in grams
    } else if (product.details.thickness) {
      // For core material products (e.g., "10mm" -> 10)
      const thicknessValue = parseInt(product.details.thickness.match(/\d+/)[0]);
      const density = product.details.density ? parseInt(product.details.density.match(/\d+/)[0]) : 100; // default density
      weight = area * (thicknessValue / 1000) * density; // weight in kg (thickness in mm to m, then * density)
    }
    
    return {
      area,
      mrp,
      weight: product.details.weight ? weight / 1000 : weight // convert to kg for reinforcement, already in kg for core materials
    };
  };

  // Function to handle length input change
  const handleLengthChange = (length) => {
    if (externalLength !== null) {
      // Use external handler if external state is provided
      onLengthChange(product.id, length);
    } else {
      // Use internal state
      setInternalLength(length);
    }
  };

  // Function to handle quantity change
  const handleQuantityChange = (newQuantity) => {
    const validQuantity = Math.max(1, Math.min(100, newQuantity));
    setQuantity(validQuantity);
  };

  // Function to handle image navigation
  const handleImageNavigation = (direction) => {
    const totalImages = product.images.length;
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentImageIndex === totalImages - 1 ? 0 : currentImageIndex + 1;
    } else {
      newIndex = currentImageIndex === 0 ? totalImages - 1 : currentImageIndex - 1;
    }
    
    if (externalImageIndex !== null) {
      // Use external handler if external state is provided
      onImageChange(product.id, newIndex);
    } else {
      // Use internal state
      setInternalImageIndex(newIndex);
    }
  };

  // Default category colors
  const defaultCategoryColors = {
    'Carbon Fiber': 'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-300',
    'Glass Fiber': 'from-green-500/10 to-green-600/5 border-green-500/20 text-green-300',
    'Aramid': 'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-300',
    'Mixed Materials': 'from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-300',
    'PVC Foam': 'from-teal-500/10 to-teal-600/5 border-teal-500/20 text-teal-300',
    'Aluminum Honeycomb': 'from-slate-500/10 to-slate-600/5 border-slate-500/20 text-slate-300',
    'Balsa Wood': 'from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-300',
    'Syntactic Foam': 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-300',
    'Rohacell PMI Foam': 'from-rose-500/10 to-rose-600/5 border-rose-500/20 text-rose-300',
    'default': 'from-neutral-500/10 to-neutral-600/5 border-neutral-500/20 text-neutral-300'
  };

  // Get category color
  const getCategoryColor = (category) => {
    return customCategoryColors[category] || defaultCategoryColors[category] || defaultCategoryColors.default;
  };

  // Calculate product details
  const calculations = calculateProductDetails(product, currentLength);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * animationDelay,
        ease: "easeOut"
      }}
      className={`bg-gradient-to-br from-neutral-800/70 to-neutral-900/50 border border-neutral-700/40 rounded-xl p-3 sm:p-4 hover:border-neutral-600/60 transition-all duration-300 shadow-lg hover:shadow-xl w-full h-full min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col ${customClassName}`}
    >
      {/* Category Badge */}
      {showCategory && product.category && !simple && (
        <div className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium mb-2 sm:mb-3 bg-gradient-to-r ${getCategoryColor(product.category)} border w-fit`}>
          {product.category}
        </div>
      )}

      {/* Product Image with Navigation */}
      <div className="relative aspect-video bg-gradient-to-br from-neutral-700/50 to-neutral-800/50 rounded-lg mb-2 sm:mb-3 overflow-hidden group w-full">
        <img 
          src={product.images[currentImageIndex]} 
          alt={`${product.title} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500 ease-out"
        />
        
        {/* Navigation Buttons */}
        {product.images.length > 1 && !simple && (
          <>
            {/* Previous Button */}
            <button
              onClick={() => handleImageNavigation('prev')}
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 sm:p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-3.5 sm:h-3.5">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Next Button */}
            <button
              onClick={() => handleImageNavigation('next')}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 sm:p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-3.5 sm:h-3.5">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}
      </div>
        
      {/* Simple Card: Only Title and Price */}
      {simple ? (
        <div className="flex flex-col flex-1 justify-between min-h-0">
          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white leading-tight mb-1 line-clamp-2">{product.title}</h3>
          <div className="mt-auto">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400 mb-2">₹{product.mrp.toLocaleString()}</div>
            
            {/* Quantity Controls for Simple Card */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-xs font-semibold text-neutral-300">Qty:</span>
              <div className="flex items-center bg-gradient-to-r from-neutral-700/80 to-neutral-800/60 border border-neutral-600/50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-7 h-7 bg-gradient-to-b from-neutral-600/80 to-neutral-700/80 hover:from-neutral-500/80 hover:to-neutral-600/80 disabled:from-neutral-800/50 disabled:to-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed border-r border-neutral-600/40 flex items-center justify-center text-white transition-all duration-200 text-xs font-semibold hover:scale-105 active:scale-95"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-12 h-7 text-center bg-transparent text-white text-xs font-semibold focus:outline-none focus:bg-neutral-600/30 transition-colors duration-200 border-none"
                    aria-label="Product quantity"
                  />
                </div>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 100}
                  className="w-7 h-7 bg-gradient-to-b from-neutral-600/80 to-neutral-700/80 hover:from-neutral-500/80 hover:to-neutral-600/80 disabled:from-neutral-800/50 disabled:to-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed border-l border-neutral-600/40 flex items-center justify-center text-white transition-all duration-200 text-xs font-semibold hover:scale-105 active:scale-95"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            
            <button
              onClick={() => onAddToCart(product, { mrp: product.mrp, quantity })}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Add to Cart ({quantity})
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 space-y-2 sm:space-y-3 min-h-0">
          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-bold text-white leading-tight line-clamp-2">
            {product.title}
          </h3>
          
          {/* Length Input */}
          {showLengthInput && (
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-neutral-300 whitespace-nowrap">
                Length (m):
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="1.0"
                  value={currentLength}
                  onChange={(e) => handleLengthChange(e.target.value)}
                  className="w-20 sm:w-24 bg-gradient-to-r from-neutral-700/80 to-neutral-800/60 border border-neutral-600/50 hover:border-neutral-500/70 focus:border-blue-500/70 rounded-lg pl-3 pr-6 py-2 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-sm hover:shadow-md"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-xs pointer-events-none">
                  m
                </div>
              </div>
            </div>
          )}

          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-neutral-300 whitespace-nowrap flex-shrink-0 min-w-fit">
              Quantity:
            </label>
            <div className="flex items-center bg-gradient-to-r from-neutral-700/80 to-neutral-800/60 border border-neutral-600/50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-b from-neutral-600/80 to-neutral-700/80 hover:from-neutral-500/80 hover:to-neutral-600/80 disabled:from-neutral-800/50 disabled:to-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed border-r border-neutral-600/40 flex items-center justify-center text-white transition-all duration-200 text-sm font-semibold hover:scale-105 active:scale-95"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 sm:w-18 h-8 sm:h-9 text-center bg-transparent text-white text-xs font-semibold focus:outline-none focus:bg-neutral-600/30 transition-colors duration-200 border-none"
                  aria-label="Product quantity"
                />
              </div>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 100}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-b from-neutral-600/80 to-neutral-700/80 hover:from-neutral-500/80 hover:to-neutral-600/80 disabled:from-neutral-800/50 disabled:to-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed border-l border-neutral-600/40 flex items-center justify-center text-white transition-all duration-200 text-sm font-semibold hover:scale-105 active:scale-95"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Calculated Values */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <div className="bg-gradient-to-br from-blue-500/8 to-blue-600/4 border border-blue-500/15 px-1.5 sm:px-2 py-1.5 rounded-lg text-center">
              <span className="block text-blue-300 text-xs font-medium">Area</span>
              <span className="text-white font-bold text-xs">{calculations.area.toFixed(2)} m²</span>
            </div>
            <div className="bg-gradient-to-br from-purple-500/8 to-purple-600/4 border border-purple-500/15 px-1.5 sm:px-2 py-1.5 rounded-lg text-center">
              <span className="block text-purple-300 text-xs font-medium">Weight</span>
              <span className="text-white font-bold text-xs">{calculations.weight.toFixed(2)} kg</span>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/6 border border-green-500/20 px-1.5 sm:px-2 py-1.5 rounded-lg text-center">
              <span className="block text-green-300 text-xs font-medium">Total MRP</span>
              <span className="text-green-400 font-bold text-xs">₹{calculations.mrp.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Specifications */}
          <div className="flex-1 space-y-2 min-h-0">
            <h4 className="text-xs font-semibold text-neutral-300 flex items-center gap-2">
              <span className="w-1 h-3 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
              Specifications
            </h4>
            <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
              {[
                // Handle both weight (reinforcement) and thickness (core materials)
                product.details.weight && { label: "Weight", value: product.details.weight, color: "from-orange-500/8 to-red-500/4 border-orange-500/15" },
                product.details.thickness && { label: "Thickness", value: product.details.thickness, color: "from-orange-500/8 to-red-500/4 border-orange-500/15" },
                // Handle both cell (reinforcement) and cellSize (core materials)
                product.details.cell && { label: "Cell Size", value: product.details.cell, color: "from-cyan-500/8 to-blue-500/4 border-cyan-500/15" },
                product.details.cellSize && { label: "Cell Size", value: product.details.cellSize, color: "from-cyan-500/8 to-blue-500/4 border-cyan-500/15" },
                // Handle both width (reinforcement) and size (core materials)
                product.details.width && { label: "Width", value: product.details.width, color: "from-violet-500/8 to-purple-500/4 border-violet-500/15" },
                product.details.size && { label: "Size", value: product.details.size, color: "from-violet-500/8 to-purple-500/4 border-violet-500/15" }
              ].filter(Boolean).slice(0, 3).map((spec, idx) => (
                <div 
                  key={spec.label}
                  className={`bg-gradient-to-br ${spec.color} px-1 sm:px-1.5 py-1.5 rounded-lg text-center`}
                >
                  <span className="block text-neutral-400 text-xs leading-tight">{spec.label}</span>
                  <span className="text-white font-semibold text-xs leading-tight">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* Show density information if available (core materials) */}
            {product.details.density && (
              <div className="bg-gradient-to-br from-indigo-500/8 to-indigo-600/4 border border-indigo-500/15 px-2 py-1.5 rounded-lg">
                <span className="block text-indigo-300 text-xs font-medium">Density</span>
                <span className="text-white font-semibold text-xs">{product.details.density}</span>
              </div>
            )}

            {/* Show weave information if available (reinforcement) */}
            {product.details.weave && (
              <div className="bg-gradient-to-br from-indigo-500/8 to-indigo-600/4 border border-indigo-500/15 px-2 py-1.5 rounded-lg">
                <span className="block text-indigo-300 text-xs font-medium">Weave</span>
                <span className="text-white font-semibold text-xs">{product.details.weave}</span>
              </div>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <div className="mt-auto pt-2">
            <button
              onClick={() => onAddToCart(product, { ...calculations, quantity })}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Add to Cart ({quantity})
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard; 