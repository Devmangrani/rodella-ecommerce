import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import productsData from '../data/coreMaterialProducts.json';
import ProductCard from './ProductCard';
import { useCart } from '../context/myState';

const CoreMaterial = () => {
  // State to track length input for each product
  const [productLengths, setProductLengths] = useState({});
  
  // State to track current image index for each product
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // Navigation and cart hooks
  const navigate = useNavigate();
  const { addToCartWithAuth } = useCart();

  // Get all products from all categories
  const getAllProducts = () => {
    let allProducts = [];
    
    allProducts = [
      ...allProducts, 
      ...productsData.rohacell.map(p => ({ ...p, category: 'Rohacell PMI Foam' }))
    ];
    
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
    
    // Extract quantity from calculations, default to 1 if not provided
    const quantity = calculations.quantity || 1;
    
    // Get the length for this product (convert to mm for consistency)
    const lengthInMeters = productLengths[product.id] || 1;
    const lengthInMM = lengthInMeters * 1000;
    
    // Extract dimensions from product details
    const sizeMatch = product.details.size ? product.details.size.match(/(\d+)mm x (\d+)mm/) : null;
    const width = sizeMatch ? parseInt(sizeMatch[1]) : 600; // Default 600mm
    const height = sizeMatch ? parseInt(sizeMatch[2]) : 600; // Default 600mm
    const thickness = product.details.thickness ? parseInt(product.details.thickness.match(/\d+/)[0]) : 2; // Default 2mm
    
    // Create enhanced product object with core material-specific information
    const enhancedProduct = {
      ...product,
      isCoreProduct: true,
      dimensions: {
        width: width, // Width from product size
        height: height, // Height from product size  
        thickness: thickness, // Thickness in mm
        length: lengthInMM, // Length in mm (user input)
        lengthInMeters: lengthInMeters, // Also store in meters for display
        density: product.details.density,
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
            Core Materials
          </motion.h1>
          <motion.p 
            className="text-base sm:text-lg lg:text-xl text-neutral-400 max-w-3xl mx-auto mb-6 lg:mb-8 px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            High-quality core materials for composite sandwich structures.
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full"
        >
          {allProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-400 text-base lg:text-lg mb-4">No products found</div>
              <div className="text-neutral-500 text-sm">Please check back later for available products</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 lg:gap-8 auto-rows-fr">
              {allProducts.map((product, index) => (
                <div key={`${product.category}-${product.id}`} id={`product-${product.id}`} className="flex">
                  <ProductCard
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
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CoreMaterial; 