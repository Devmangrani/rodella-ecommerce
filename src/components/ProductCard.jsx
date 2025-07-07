import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
  simple = false,
  // New props for epoxy products
  isEpoxyProduct = false,
  onSizeChange = () => {},
  selectedSize = '1L'
}) => {
  // Internal state for length, quantity and image index (used if external state not provided)
  const [internalLength, setInternalLength] = useState(defaultLength);
  const [internalImageIndex, setInternalImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showGoToCart, setShowGoToCart] = useState(false);
  
  const navigate = useNavigate();

  // Use external state if provided, otherwise use internal state
  const currentLength = externalLength !== null ? externalLength : internalLength;
  const currentImageIndex = externalImageIndex !== null ? externalImageIndex : internalImageIndex;

  // Function to calculate product details based on length
  const calculateProductDetails = (product, length) => {
    // For epoxy products, use size-specific pricing
    if (isEpoxyProduct && product.sizes) {
      const sizeInfo = product.sizes[selectedSize];
      const price = sizeInfo ? sizeInfo.price : product.mrp;
      return {
        area: 1, // Not applicable for epoxy products
        mrp: price,
        weight: 1 // Not applicable for epoxy products
      };
    }

    // Original calculation for other products
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

  // Function to handle size change for epoxy products
  const handleSizeChange = (size) => {
    onSizeChange(product.id, size);
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

  // Enhanced add to cart handler
  const handleAddToCart = () => {
    onAddToCart(product, { mrp: isEpoxyProduct ? calculations.mrp : calculations.mrp, quantity });
    setShowGoToCart(true);
    
    // Hide the button after 5 seconds
    setTimeout(() => {
      setShowGoToCart(false);
    }, 5000);
  };

  // Enhanced add to cart handler for non-simple cards
  const handleAddToCartDetailed = () => {
    onAddToCart(product, { ...calculations, quantity });
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
    // New epoxy categories
    'Resins': 'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-300',
    'Adhesives': 'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-300',
    'Gelcoats': 'from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-300',
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
      className={`bg-gradient-to-br from-neutral-800/70 to-neutral-900/50 border border-neutral-700/40 rounded-xl p-2 sm:p-3 lg:p-4 hover:border-neutral-600/60 transition-all duration-300 shadow-lg hover:shadow-xl w-full h-full min-h-[380px] sm:min-h-[420px] lg:min-h-[480px] flex flex-col ${customClassName}`}
    >
      {/* Category Badge */}
      {showCategory && product.category && !simple && (
        <div className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium mb-1 sm:mb-2 bg-gradient-to-r ${getCategoryColor(product.category)} border w-fit`}>
          {product.category}
        </div>
      )}

      {/* Product Image with Navigation */}
      <div className="relative aspect-[4/3] sm:aspect-video bg-gradient-to-br from-neutral-700/50 to-neutral-800/50 rounded-lg mb-2 sm:mb-3 overflow-hidden group w-full">
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
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 sm:p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-3 sm:h-3">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Next Button */}
            <button
              onClick={() => handleImageNavigation('next')}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 sm:p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-3 sm:h-3">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}
      </div>
        
      {/* Simple Card: Only Title and Price */}
      {simple ? (
        <div className="flex flex-col flex-1 justify-between min-h-0">
          <h3 className="text-sm sm:text-base font-bold text-white leading-tight mb-1 line-clamp-2">{product.title}</h3>
          <div className="mt-auto">
            <div className="text-base sm:text-lg lg:text-xl font-bold text-green-400 mb-2">₹{product.mrp.toLocaleString()}</div>
            
            {/* Quantity Controls for Simple Card */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xs font-semibold text-neutral-300">Qty:</span>
              <div className="flex items-center bg-gradient-to-r from-neutral-700/80 to-neutral-800/60 border border-neutral-600/50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-b from-neutral-600/80 to-neutral-700/80 hover:from-neutral-500/80 hover:to-neutral-600/80 disabled:from-neutral-800/50 disabled:to-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed border-r border-neutral-600/40 flex items-center justify-center text-white transition-all duration-200 text-xs font-semibold hover:scale-105 active:scale-95"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="relative">
                  <span className="w-10 sm:w-12 h-6 sm:h-7 text-center bg-transparent text-white text-xs font-semibold flex items-center justify-center border-none">
                    {quantity}
                  </span>
                </div>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 100}
                  className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-b from-neutral-600/80 to-neutral-700/80 hover:from-neutral-500/80 hover:to-neutral-600/80 disabled:from-neutral-800/50 disabled:to-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed border-l border-neutral-600/40 flex items-center justify-center text-white transition-all duration-200 text-xs font-semibold hover:scale-105 active:scale-95"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to Cart and Go to Cart Buttons */}
            <div className="space-y-2">
              <AnimatePresence mode="wait">
                {!showGoToCart ? (
                  <motion.button
                    key="add-to-cart"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Add to Cart ({quantity})
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
                    onClick={handleGoToCart}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.293 1.293A1 1 0 005 15h1.414m5.586 0h9m-7 4a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Go to Cart
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 space-y-1.5 sm:space-y-2 lg:space-y-3 min-h-0">
          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-bold text-white leading-tight line-clamp-2">
            {product.title}
          </h3>
          
          {/* Size Selection for Epoxy Products */}
          {isEpoxyProduct && product.sizes && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">
                Size:
              </label>
              <div className="flex gap-2">
                {Object.keys(product.sizes).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                      selectedSize === size
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                        : 'bg-neutral-700/80 border-neutral-600/50 text-neutral-300 hover:bg-neutral-600/80 hover:border-neutral-500/70'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Length Input (only for non-epoxy products) */}
          {showLengthInput && !isEpoxyProduct && (
            <div className="flex items-center gap-2 sm:gap-3">
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
                  className="w-18 sm:w-20 lg:w-24 bg-gradient-to-r from-neutral-700/80 to-neutral-800/60 border border-neutral-600/50 hover:border-neutral-500/70 focus:border-blue-500/70 rounded-lg pl-2 pr-5 sm:pl-3 sm:pr-6 py-1.5 sm:py-2 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-sm hover:shadow-md"
                />
                <div className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 text-neutral-400 text-xs pointer-events-none">
                  m
                </div>
              </div>
            </div>
          )}

          {/* Quantity Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <label className="text-xs font-semibold text-neutral-300 whitespace-nowrap flex-shrink-0 min-w-fit">
              Quantity:
            </label>
            <div className="flex items-center bg-gradient-to-r from-neutral-700/80 to-neutral-800/60 border border-neutral-600/50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-b from-neutral-600/80 to-neutral-700/80 hover:from-neutral-500/80 hover:to-neutral-600/80 disabled:from-neutral-800/50 disabled:to-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed border-r border-neutral-600/40 flex items-center justify-center text-white transition-all duration-200 text-sm font-semibold hover:scale-105 active:scale-95"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <div className="relative">
                <span className="w-14 sm:w-16 h-7 sm:h-8 text-center bg-transparent text-white text-xs font-semibold flex items-center justify-center border-none">
                  {quantity}
                </span>
              </div>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 100}
                className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-b from-neutral-600/80 to-neutral-700/80 hover:from-neutral-500/80 hover:to-neutral-600/80 disabled:from-neutral-800/50 disabled:to-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed border-l border-neutral-600/40 flex items-center justify-center text-white transition-all duration-200 text-sm font-semibold hover:scale-105 active:scale-95"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Calculated Values (only for non-epoxy products) */}
          {!isEpoxyProduct && (
            <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
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
          )}

          {/* Price Display for Epoxy Products */}
          {isEpoxyProduct && (
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/6 border border-green-500/20 px-3 py-2 rounded-lg text-center">
              <span className="block text-green-300 text-xs font-medium">Price ({selectedSize})</span>
              <span className="text-green-400 font-bold text-sm">₹{calculations.mrp.toLocaleString()}</span>
            </div>
          )}
          
          {/* Specifications (only for non-epoxy products) */}
          {!isEpoxyProduct && (
            <div className="flex-1 space-y-1.5 sm:space-y-2 min-h-0">
              <h4 className="text-xs font-semibold text-neutral-300 flex items-center gap-2">
                <span className="w-1 h-2 sm:h-3 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                Specifications
              </h4>
              <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
                {[
                  // Original specifications for non-epoxy products
                  product.details.weight && { label: "Weight", value: product.details.weight, color: "from-orange-500/8 to-red-500/4 border-orange-500/15" },
                  product.details.thickness && { label: "Thickness", value: product.details.thickness, color: "from-orange-500/8 to-red-500/4 border-orange-500/15" },
                  product.details.cell && { label: "Cell Size", value: product.details.cell, color: "from-cyan-500/8 to-blue-500/4 border-cyan-500/15" },
                  product.details.cellSize && { label: "Cell Size", value: product.details.cellSize, color: "from-cyan-500/8 to-blue-500/4 border-cyan-500/15" },
                  product.details.width && { label: "Width", value: product.details.width, color: "from-violet-500/8 to-purple-500/4 border-violet-500/15" },
                  product.details.size && { label: "Size", value: product.details.size, color: "from-violet-500/8 to-purple-500/4 border-violet-500/15" }
                ].filter(Boolean).slice(0, 6).map((spec, index) => (
                  <div 
                    key={spec.label}
                    className={`bg-gradient-to-br ${spec.color} px-1 sm:px-1.5 py-1 sm:py-1.5 rounded-lg text-center`}
                  >
                    <span className="block text-neutral-400 text-xs leading-tight">{spec.label}</span>
                    <span className="text-white font-semibold text-xs leading-tight">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Additional specifications for different product types */}
              <>
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
              </>
            </div>
          )}
          
          {/* Add to Cart Button */}
          <div className="mt-auto pt-2">
            <div className="space-y-2">
              <AnimatePresence mode="wait">
                {!showGoToCart ? (
                  <motion.button
                    key="add-to-cart"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleAddToCartDetailed}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Add to Cart ({quantity})
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
                    onClick={handleGoToCart}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.293 1.293A1 1 0 005 15h1.414m5.586 0h9m-7 4a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Go to Cart
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductCard; 