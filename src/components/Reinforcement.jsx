import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import productsData from '../data/reinforcementProducts.json';
import ProductCard from './ProductCard';
import { useCart } from '../context/myState';
import SEO from './SEO';
import { createCollectionPageStructuredData, createProductStructuredData } from './StructuredData';

const Reinforcement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse URL parameters
  const urlParams = new URLSearchParams(location.search);
  const categoryParam = urlParams.get('category');
  const productParam = urlParams.get('product');

  // State for selected categories - initialize based on URL params
  const [selectedCategories, setSelectedCategories] = useState(() => {
    if (categoryParam) {
      // If a specific category is requested, only select that category
      return {
        carbonFiber: categoryParam === 'carbonFiber',
        glassFiber: false,
        aramid: categoryParam === 'aramid',
        mixed: categoryParam === 'mixed'
      };
    }
    // Default state - all categories selected
    return {
      carbonFiber: true,
      glassFiber: false,
      aramid: true,
      mixed: true
    };
  });

  // State to track length input for each product (allow empty values)
  const [productLengths, setProductLengths] = useState({});
  
  // State to track current image index for each product
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // State for mobile filter visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Effect to handle screen size changes
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Navigation and cart hooks
  const { addToCartWithAuth } = useCart();

  // Effect to scroll to specific product when navigating from homepage
  useEffect(() => {
    if (productParam) {
      // Wait for the component to render, then scroll to the product
      setTimeout(() => {
        const productElement = document.getElementById(`product-${productParam}`);
        if (productElement) {
          productElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          // Add a highlight effect
          productElement.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
          setTimeout(() => {
            productElement.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
          }, 3000);
        }
      }, 500);
    }
  }, [productParam]);

  // Get all products based on selected categories
  const getFilteredProducts = () => {
    let allProducts = [];
    
    if (selectedCategories.carbonFiber) {
      allProducts = [...allProducts, ...productsData.carbonFiber.map(p => ({ ...p, category: 'Carbon Fiber' }))];
    }
    // if (selectedCategories.glassFiber) {
    //   allProducts = [...allProducts, ...productsData.glassFiber.map(p => ({ ...p, category: 'Glass Fiber' }))];
    // }
    if (selectedCategories.aramid) {
      allProducts = [...allProducts, ...productsData.aramid.map(p => ({ ...p, category: 'Aramid' }))];
    }
    if (selectedCategories.mixed) {
      allProducts = [...allProducts, ...productsData.mixed.map(p => ({ ...p, category: 'Mixed Materials' }))];
    }
    
    return allProducts;
  };

  // Function to handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Function to handle "All" checkbox
  const handleAllCategoriesChange = () => {
    const allSelected = Object.values(selectedCategories).every(value => value);
    const newState = !allSelected;
    
    setSelectedCategories({
      carbonFiber: newState,
      glassFiber: newState,
      aramid: newState,
      mixed: newState
    });
  };

  // Check if all categories are selected
  const allCategoriesSelected = Object.values(selectedCategories).every(value => value);

  // Function to handle length input change with production-ready validation
  const handleLengthChange = (productId, length) => {
    // Allow empty string or valid positive numbers only
    if (length === '') {
      // Allow empty input
      setProductLengths(prev => ({
        ...prev,
        [productId]: ''
      }));
    } else if (!isNaN(length) && parseFloat(length) >= 0) {
      // Allow valid positive numbers (including zero)
      setProductLengths(prev => ({
        ...prev,
        [productId]: length
      }));
    }
    // Reject invalid inputs (negative numbers, non-numeric strings, etc.)
  };

  // Function to handle image navigation
  const handleImageChange = (productId, newIndex) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: newIndex
    }));
  };

  // Function to handle add to cart
  const handleAddToCart = (product, calculations) => {
    console.log('Adding to cart:', { product, calculations });
    
    // Extract quantity from calculations, default to 1 if not provided
    const quantity = calculations.quantity || 1;
    
    // Get the length for this product - validate and default to 1 if empty or invalid
    const inputLength = productLengths[product.id];
    let lengthInMeters = 1; // Default value
    
    // Validate and parse input length
    if (inputLength !== undefined && inputLength !== '' && !isNaN(inputLength)) {
      const parsedLength = parseFloat(inputLength);
      if (parsedLength > 0) {
        lengthInMeters = parsedLength;
      }
    }
    
    const lengthInMM = lengthInMeters * 1000;
    
    // Create enhanced product object with reinforcement-specific information
    const enhancedProduct = {
      ...product,
      isReinforcementProduct: true,
      dimensions: {
        width: 1000, // Fixed width for reinforcement materials (from JSON data)
        length: lengthInMM, // Length in mm
        lengthInMeters: lengthInMeters, // Also store in meters for display
        weight: product.details.weight,
        unit: 'mm'
      }
    };
    
    // Enhance calculations with length information and ensure quantity is included
    const enhancedCalculations = {
      ...calculations,
      lengthInMeters: lengthInMeters,
      quantity: quantity
    };
    
    // Use the global cart function with authentication check
    addToCartWithAuth(enhancedProduct, enhancedCalculations, quantity, navigate);
  };

  const filteredProducts = getFilteredProducts();

  // SEO Data
  const collectionStructuredData = createCollectionPageStructuredData(
    'Reinforcement Materials', 
    filteredProducts, 
    'https://rodella.shop'
  );

  const productStructuredData = filteredProducts.slice(0, 5).map(product => 
    createProductStructuredData(product, 'Reinforcement Material', 'https://rodella.shop')
  );

  return (
    <>
      <SEO
        title="Reinforcement Materials - Carbon Fiber, Aramid & Mixed Composites | Rodella Composites"
        description="Premium reinforcement materials including carbon fiber fabrics, aramid kevlar, and mixed composite materials. High-quality 200GSM, 3K weave patterns for aerospace, automotive, and industrial applications."
        canonical="https://rodella.shop/reinforcement"
        keywords="carbon fiber fabric, aramid kevlar fabric, composite reinforcement, 200gsm carbon fiber, 3k carbon fiber, twill weave carbon, spread tow fabric, aerospace carbon fiber, automotive composites, structural reinforcement"
        type="webpage"
        image="https://rodella.shop/assets/Carbonfiber-3k-2-2twill-200gsm-1100:sqm1.jpeg"
        imageAlt="Premium carbon fiber reinforcement materials"
        structuredData={[collectionStructuredData, ...productStructuredData]}
        breadcrumbs={[
          { name: 'Home', url: 'https://rodella.shop' },
          { name: 'Reinforcement Materials', url: 'https://rodella.shop/reinforcement' }
        ]}
      />
      <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full bg-black text-white font-sans pt-20"
    >
      <div className="w-full h-full py-6 sm:py-8 lg:py-12 px-3 sm:px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 lg:mb-12"
        >
          <motion.h1 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 lg:mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Reinforcement Materials
          </motion.h1>
          <motion.p 
            className="text-base sm:text-lg lg:text-xl text-neutral-400 max-w-3xl mx-auto mb-6 lg:mb-8 px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Every possible reinforcement material available with us.
          </motion.p>
        </motion.div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full bg-gradient-to-r from-neutral-800/90 to-neutral-700/90 hover:from-neutral-700/90 hover:to-neutral-600/90 border border-neutral-600/60 rounded-lg p-3 flex items-center justify-between transition-all duration-200 backdrop-blur-sm shadow-md"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              <span className="text-white font-medium text-sm">Filters</span>
              <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-500/30">
                {filteredProducts.length}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isFilterOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Filter Sidebar */}
          <AnimatePresence>
            {(isFilterOpen || !isMobile) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:opacity-100 lg:h-auto"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="w-full lg:w-64 bg-gradient-to-br from-neutral-900/90 to-neutral-800/70 backdrop-blur-sm rounded-lg p-3 lg:p-4 border border-neutral-700/50 h-fit lg:sticky lg:top-8 shadow-lg"
                >
                  <h3 className="hidden lg:flex text-sm lg:text-base font-bold text-white mb-3 lg:mb-4 items-center gap-2">
                    <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                    Filters
                  </h3>
                  
                  <div className="space-y-1.5 lg:space-y-2">
                    {/* All Categories Checkbox */}
                    <motion.label
                      whileHover={{ scale: 1.002 }}
                      whileTap={{ scale: 0.998 }}
                      className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-neutral-800/40 transition-all duration-200 border-b border-neutral-700/30 mb-2 group"
                    >
                      <div className="relative flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={allCategoriesSelected}
                          onChange={handleAllCategoriesChange}
                          className="sr-only"
                        />
                        <div className={`w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-md border transition-all duration-200 flex items-center justify-center ${
                          allCategoriesSelected 
                            ? 'bg-blue-500 border-blue-500 shadow-sm' 
                            : 'border-neutral-500 bg-transparent group-hover:border-blue-400 group-hover:bg-neutral-800/30'
                        }`}>
                          {allCategoriesSelected && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.15, type: "spring", stiffness: 400 }}
                              width="8"
                              height="8"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="text-white"
                            >
                              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            </motion.svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium text-xs lg:text-sm truncate group-hover:text-blue-100 transition-colors duration-200">All Categories</span>
                          <span className="text-neutral-400 text-xs ml-1 flex-shrink-0 group-hover:text-neutral-300 transition-colors duration-200">
                            ({productsData.carbonFiber.length + (productsData.glassFiber?.length || 0) + productsData.aramid.length + productsData.mixed.length})
                          </span>
                        </div>
                      </div>
                    </motion.label>

                      {/* Individual Category Checkboxes */}
                      {[
                        { key: 'carbonFiber', label: 'Carbon Fiber', count: productsData.carbonFiber.length, color: 'text-blue-400' },
                        { key: 'aramid', label: 'Aramid', count: productsData.aramid.length, color: 'text-purple-400' },
                        { key: 'mixed', label: 'Mixed Materials', count: productsData.mixed.length, color: 'text-orange-400' }
                      ].map((category) => (
                        <motion.label
                          key={category.key}
                          whileHover={{ scale: 1.002 }}
                          whileTap={{ scale: 0.998 }}
                          className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-neutral-800/30 transition-all duration-200 group"
                        >
                          <div className="relative flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={selectedCategories[category.key]}
                              onChange={() => handleCategoryChange(category.key)}
                              className="sr-only"
                            />
                            <div className={`w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-md border transition-all duration-200 flex items-center justify-center ${
                              selectedCategories[category.key] 
                                ? 'bg-blue-500 border-blue-500 shadow-sm' 
                                : 'border-neutral-500 bg-transparent group-hover:border-blue-400 group-hover:bg-neutral-800/30'
                            }`}>
                              {selectedCategories[category.key] && (
                                <motion.svg
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.15, type: "spring", stiffness: 400 }}
                                  width="8"
                                  height="8"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="text-white"
                                >
                                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                                </motion.svg>
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs">{category.icon}</span>
                                <span className={`font-medium text-xs lg:text-sm ${category.color} truncate group-hover:opacity-90 transition-opacity duration-200`}>
                                  {category.label}
                                </span>
                              </div>
                              <span className="text-neutral-500 text-xs ml-1 flex-shrink-0 group-hover:text-neutral-400 transition-colors duration-200">({category.count})</span>
                            </div>
                          </div>
                        </motion.label>
                    ))}
                  </div>

                  {/* Results Counter */}
                  <div className="mt-3 lg:mt-4 pt-2 lg:pt-3 border-t border-neutral-700/50">
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-md p-2 text-center">
                      <span className="text-blue-300 text-xs font-medium">
                        {filteredProducts.length} products found
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex-1"
          >
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-neutral-400 text-base lg:text-lg mb-4">No products found</div>
                <div className="text-neutral-500 text-sm">Please select at least one category to view products</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
                {filteredProducts.map((product, index) => (
                  <div key={`${product.category}-${product.id}`} id={`product-${product.id}`}>
                    <ProductCard
                      product={product}
                      index={index}
                      onAddToCart={handleAddToCart}
                      onLengthChange={handleLengthChange}
                      onImageChange={handleImageChange}
                      externalLength={productLengths[product.id] || ''}
                      externalImageIndex={currentImageIndex[product.id] || 0}
                      showCategory={true}
                      animationDelay={0.1}
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default Reinforcement; 