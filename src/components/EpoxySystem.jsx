import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import productsData from '../data/epoxyProducts.json';
import ProductCard from './ProductCard';
import { useCart } from '../context/myState';

const EpoxySystem = () => {
  // State to track length input for each product
  const [productLengths, setProductLengths] = useState({});
  
  // State to track current image index for each product
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // Navigation and cart hooks
  const navigate = useNavigate();
  const { addToCartWithAuth } = useCart();

  // Get all products
  const getAllProducts = () => {
    let allProducts = [];
    
    allProducts = [...allProducts, ...productsData.aerospaceGrade.map(p => ({ ...p, category: 'Aerospace Grade' }))];
    allProducts = [...allProducts, ...productsData.fastCure.map(p => ({ ...p, category: 'Fast Cure Systems' }))];
    allProducts = [...allProducts, ...productsData.structuralAdhesives.map(p => ({ ...p, category: 'Structural Adhesives' }))];
    allProducts = [...allProducts, ...productsData.vacuumInfusion.map(p => ({ ...p, category: 'Vacuum Infusion' }))];
    
    return allProducts;
  };

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
    
    // Use the global cart function with authentication check
    addToCartWithAuth(product, calculations, productLengths[product.id] || 1, navigate);
  };

  const allProducts = getAllProducts();

  return (
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

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-full"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6">
            {allProducts.map((product, index) => (
              <div className="flex justify-center">
                <ProductCard
                  key={`${product.category}-${product.id}`}
                  product={product}
                  index={index}
                  onAddToCart={handleAddToCart}
                  onLengthChange={handleLengthChange}
                  onImageChange={handleImageChange}
                  externalLength={productLengths[product.id] || 1}
                  externalImageIndex={currentImageIndex[product.id] || 0}
                  showCategory={false}
                  animationDelay={0.1}
                  simple={true}
                />
              </div>
            ))}
          </div>
        </motion.div>

        

        
      </div>
    </motion.div>
  );
};

export default EpoxySystem; 