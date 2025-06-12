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
  onImageChange = () => {}
}) => {
  // Internal state for length and image index (used if external state not provided)
  const [internalLength, setInternalLength] = useState(defaultLength);
  const [internalImageIndex, setInternalImageIndex] = useState(0);

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
    
    // Extract GSM value from product weight details (e.g., "80 gsm" -> 80)
    const gsmValue = parseInt(product.details.weight.match(/\d+/)[0]);
    const weight = area * gsmValue; // weight in grams
    
    return {
      area,
      mrp,
      weight: weight / 1000 // convert to kg
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
      className={`bg-gradient-to-br from-neutral-800/70 to-neutral-900/50 border border-neutral-700/40 rounded-xl p-4 hover:border-neutral-600/60 transition-all duration-300 shadow-lg hover:shadow-xl w-full max-w-full h-auto ${customClassName}`}
    >
      {/* Category Badge */}
      {showCategory && product.category && (
        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 bg-gradient-to-r ${getCategoryColor(product.category)} border`}>
          {product.category}
        </div>
      )}

      {/* Product Image with Navigation */}
      <div className="relative aspect-video bg-gradient-to-br from-neutral-700/50 to-neutral-800/50 rounded-lg mb-3 overflow-hidden group">
        <img 
          src={product.images[currentImageIndex]} 
          alt={`${product.title} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500 ease-out"
        />
        
        {/* Navigation Buttons */}
        {product.images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={() => handleImageNavigation('prev')}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Next Button */}
            <button
              onClick={() => handleImageNavigation('next')}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}
      </div>
        
      <div className="space-y-3">
        {/* Product Title */}
        <h3 className="text-base font-bold text-white leading-tight">
          {product.title}
        </h3>
        
        {/* Length Input */}
        {showLengthInput && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-neutral-300 whitespace-nowrap flex-shrink-0">
              Length (m):
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              placeholder="1.0"
              value={currentLength}
              onChange={(e) => handleLengthChange(e.target.value)}
              className="w-18 bg-neutral-700/60 border border-neutral-600/40 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200"
            />
          </div>
        )}

        {/* Calculated Values */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gradient-to-br from-blue-500/8 to-blue-600/4 border border-blue-500/15 px-2 py-1.5 rounded-lg text-center">
            <span className="block text-blue-300 text-xs font-medium">Area</span>
            <span className="text-white font-bold text-xs">{calculations.area.toFixed(2)} m²</span>
          </div>
          <div className="bg-gradient-to-br from-purple-500/8 to-purple-600/4 border border-purple-500/15 px-2 py-1.5 rounded-lg text-center">
            <span className="block text-purple-300 text-xs font-medium">Weight</span>
            <span className="text-white font-bold text-xs">{calculations.weight.toFixed(2)} kg</span>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/6 border border-green-500/20 px-2 py-1.5 rounded-lg text-center">
            <span className="block text-green-300 text-xs font-medium">Total MRP</span>
            <span className="text-green-400 font-bold text-xs">₹{calculations.mrp.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Specifications */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-neutral-300 flex items-center gap-2">
            <span className="w-1 h-3 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
            Specifications
          </h4>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              product.details.weight && { label: "Weight", value: product.details.weight, color: "from-orange-500/8 to-red-500/4 border-orange-500/15" },
              product.details.cell && { label: "Cell Size", value: product.details.cell, color: "from-cyan-500/8 to-blue-500/4 border-cyan-500/15" },
              product.details.width && { label: "Width", value: product.details.width, color: "from-violet-500/8 to-purple-500/4 border-violet-500/15" }
            ].filter(Boolean).map((spec, idx) => (
              <div 
                key={spec.label}
                className={`bg-gradient-to-br ${spec.color} px-1.5 py-1.5 rounded-lg text-center`}
              >
                <span className="block text-neutral-400 text-xs leading-tight">{spec.label}</span>
                <span className="text-white font-semibold text-xs leading-tight">{spec.value}</span>
              </div>
            ))}
          </div>

          {/* Show weave information if available */}
          {product.details.weave && (
            <div className="bg-gradient-to-br from-indigo-500/8 to-indigo-600/4 border border-indigo-500/15 px-2 py-1.5 rounded-lg">
              <span className="block text-indigo-300 text-xs font-medium">Weave</span>
              <span className="text-white font-semibold text-xs">{product.details.weave}</span>
            </div>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product, calculations)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 rounded-xl font-semibold text-xs transition-all duration-200 shadow-lg hover:shadow-xl mt-4"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard; 