import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import productsData from '../data/epoxyProducts.json';
import ProductCard from './ProductCard';
import { useCart } from '../context/myState';
import SEO from './SEO';
import { createCollectionPageStructuredData, createProductStructuredData } from './StructuredData';

const EpoxySystem = () => {
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
        resins: categoryParam === 'resins',
        adhesives: categoryParam === 'adhesives',
        gelcoats: categoryParam === 'gelcoats'
      };
    }
    // Default state - all categories selected
    return {
      resins: true,
      adhesives: true,
      gelcoats: true
    };
  });

  // State to track selected size for each product
  const [selectedSizes, setSelectedSizes] = useState({});
  
  // State to track current image index for each product
  const [currentImageIndex, setCurrentImageIndex] = useState({});

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
    
    if (selectedCategories.resins) {
      allProducts = [...allProducts, ...productsData.resins.map(p => ({ ...p, category: 'Resins' }))];
    }
    if (selectedCategories.adhesives) {
      allProducts = [...allProducts, ...productsData.adhesives.map(p => ({ ...p, category: 'Adhesives' }))];
    }
    if (selectedCategories.gelcoats) {
      allProducts = [...allProducts, ...productsData.gelcoats.map(p => ({ ...p, category: 'Gelcoats' }))];
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
      resins: newState,
      adhesives: newState,
      gelcoats: newState
    });
  };

  // Check if all categories are selected
  const allCategoriesSelected = Object.values(selectedCategories).every(value => value);

  // Function to handle size selection
  const handleSizeChange = (productId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
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
    
    // Get selected size for this product (default to 1L)
    const selectedSize = selectedSizes[product.id] || '1L';
    const sizeInfo = product.sizes[selectedSize];
    
    // Create enhanced product object with size-specific information
    const enhancedProduct = {
      ...product,
      selectedSize: selectedSize,
      mrp: sizeInfo.price,
      sizeSpecificId: sizeInfo.id,
      isEpoxyProduct: true
    };
    
    // Extract quantity from calculations, default to 1 if not provided
    const quantity = calculations.quantity || 1;
    
    // Enhance calculations with size information
    const enhancedCalculations = {
      ...calculations,
      selectedSize: selectedSize,
      quantity: quantity
    };
    
    // Use the global cart function with authentication check
    addToCartWithAuth(enhancedProduct, enhancedCalculations, quantity, navigate);
  };

  const filteredProducts = getFilteredProducts();

  // SEO Data
  const collectionStructuredData = createCollectionPageStructuredData(
    'Epoxy Systems', 
    filteredProducts, 
    'https://rodella.shop'
  );

  const productStructuredData = filteredProducts.slice(0, 5).map(product => 
    createProductStructuredData(product, 'Epoxy System', 'https://rodella.shop')
  );

  return (
    <>
      <SEO
        title="Professional Epoxy Systems - Resins, Adhesives & Gelcoats | Rodella Composites"
        description="High-performance epoxy resins, adhesives, and gelcoats for composite manufacturing. Premium compounds with various service temperatures, cure times, and viscosities for aerospace and industrial applications."
        canonical="https://rodella.shop/epoxy-system"
        keywords="epoxy resin, composite adhesives, gelcoats, high temperature epoxy, aerospace epoxy, industrial adhesives, marine gelcoat, tooling gelcoat, epoxy system, composite resin"
        type="webpage"
        image="https://rodella.shop/assets/Epoxy-resins-556(1).png"
        imageAlt="Professional epoxy systems and resins"
        structuredData={[collectionStructuredData, ...productStructuredData]}
        breadcrumbs={[
          { name: 'Home', url: 'https://rodella.shop' },
          { name: 'Epoxy Systems', url: 'https://rodella.shop/epoxy-system' }
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
            Epoxy Systems
          </motion.h1>
          <motion.p 
            className="text-base sm:text-lg lg:text-xl text-neutral-400 max-w-3xl mx-auto mb-6 lg:mb-8 px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Professional-grade epoxy systems and resins engineered for high-performance composite manufacturing.
          </motion.p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Filter Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full lg:w-64 bg-gradient-to-br from-neutral-900/80 to-neutral-800/60 backdrop-blur-sm rounded-xl p-4 border border-neutral-700/50 h-fit lg:sticky lg:top-8 shadow-lg"
          >
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              Filters
            </h3>
            
            <div className="space-y-2">
              {/* All Categories Checkbox */}
              <motion.label
                whileHover={{ scale: 1.01 }}
                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-neutral-800/40 transition-all duration-200 border-b border-neutral-700/30 mb-2"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={allCategoriesSelected}
                    onChange={handleAllCategoriesChange}
                    className="w-4 h-4 rounded border-2 border-neutral-600 bg-neutral-700 text-blue-500 focus:ring-blue-500 focus:ring-1 transition-all duration-200"
                  />
                  {allCategoriesSelected && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-blue-400">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-white font-semibold text-sm">All Categories</span>
                  <span className="text-neutral-400 text-xs ml-2">
                    ({productsData.resins.length + productsData.adhesives.length + productsData.gelcoats.length})
                  </span>
                </div>
              </motion.label>

              {/* Individual Category Checkboxes */}
              {[
                { key: 'resins', label: 'Resins', count: productsData.resins.length, color: 'text-blue-400' },
                { key: 'adhesives', label: 'Adhesives', count: productsData.adhesives.length, color: 'text-purple-400' },
                { key: 'gelcoats', label: 'Gelcoats', count: productsData.gelcoats.length, color: 'text-orange-400' }
              ].map((category) => (
                <motion.label
                  key={category.key}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-neutral-800/30 transition-all duration-200"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedCategories[category.key]}
                      onChange={() => handleCategoryChange(category.key)}
                      className="w-4 h-4 rounded border-2 border-neutral-600 bg-neutral-700 text-blue-500 focus:ring-blue-500 focus:ring-1 transition-all duration-200"
                    />
                    {selectedCategories[category.key] && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-blue-400">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className={`font-medium text-sm ${category.color}`}>{category.label}</span>
                    <span className="text-neutral-500 text-xs ml-1">({category.count})</span>
                  </div>
                </motion.label>
              ))}
            </div>

            {/* Results Counter */}
            <div className="mt-4 pt-3 border-t border-neutral-700/50">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-2 text-center">
                <span className="text-blue-300 text-xs font-medium">
                  {filteredProducts.length} products found
                </span>
              </div>
            </div>
          </motion.div>

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
                      onSizeChange={handleSizeChange}
                      onImageChange={handleImageChange}
                      selectedSize={selectedSizes[product.id] || '1L'}
                      externalImageIndex={currentImageIndex[product.id] || 0}
                      showCategory={true}
                      animationDelay={0.1}
                      isEpoxyProduct={true}
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

export default EpoxySystem; 