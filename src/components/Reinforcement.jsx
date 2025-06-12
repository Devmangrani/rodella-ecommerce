import { useState } from 'react';
import { motion } from 'framer-motion';
import productsData from '../data/reinforcementProducts.json';
import ProductCard from './ProductCard';

const Reinforcement = () => {
  // State for selected categories
  const [selectedCategories, setSelectedCategories] = useState({
    carbonFiber: true,
    // glassFiber: true,
    aramid: true,
    mixed: true
  });

  // State to track length input for each product
  const [productLengths, setProductLengths] = useState({});
  
  // State to track current image index for each product
  const [currentImageIndex, setCurrentImageIndex] = useState({});

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

  // Function to handle length input change
  const handleLengthChange = (productId, length) => {
    setProductLengths(prev => ({
      ...prev,
      [productId]: length
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
    // Add your cart logic here
  };

  const filteredProducts = getFilteredProducts();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full bg-black text-white font-sans"
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

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Filter Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full lg:w-64 bg-gradient-to-br from-neutral-900/80 to-neutral-800/60 backdrop-blur-sm rounded-xl p-4 border border-neutral-700/50 h-fit lg:sticky lg:top-8 shadow-lg"
          >
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              {/* <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span> */}
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
                    ({productsData.carbonFiber.length + (productsData.glassFiber?.length || 0) + productsData.aramid.length + productsData.mixed.length})
                  </span>
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
                  <ProductCard
                    key={`${product.category}-${product.id}`}
                    product={product}
                    index={index}
                    onAddToCart={handleAddToCart}
                    onLengthChange={handleLengthChange}
                    onImageChange={handleImageChange}
                    externalLength={productLengths[product.id] || 1}
                    externalImageIndex={currentImageIndex[product.id] || 0}
                    showCategory={true}
                    animationDelay={0.1}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Reinforcement; 