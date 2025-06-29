import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Star, ArrowRight, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';

// Import all images
import carbon200 from '/assets/200carbon.jpg';
import carbon3k1 from '/assets/Carbonfiber-3k-2-2twill-200gsm-1100:sqm1.jpeg';
import carbon3k2 from '/assets/Carbonfiber-3k-2-2twill-200gsm-1100:sqm2.jpeg';
import carbon3k3 from '/assets/Carbonfiber-3k-2-2twill-200gsm-1100:sqm3.jpeg';
import aramid1 from '/assets/Aramid200gsm1.jpeg';
import aramid2 from '/assets/Aramid200gsm2.jpeg';
import aramid3 from '/assets/Aramid200gsm3.jpeg';
import core1 from '/assets/core1.jpeg';
import core2 from '/assets/core2.jpeg';
import carbonAramid1 from '/assets/Carbon-Aramidmixed3K200GSM1.jpeg';
import carbonAramid2 from '/assets/Carbon-Aramidmixed3K200GSM2.jpeg';
import compositeTube from '/assets/composite-tube.jpg';
import compositePlate from '/assets/compositePlate.jpg';

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  // Hero carousel images
  const heroImages = [
    {
      url: carbon200,
      title: "Premium Carbon Fiber Materials",
      subtitle: "High-performance composites for aerospace and automotive"
    },
    {
      url: carbon3k1,
      title: "Advanced Composite Solutions",
      subtitle: "Innovative materials for next-generation applications"
    },
    {
      url: aramid1,
      title: "Professional Grade Materials",
      subtitle: "Trusted by industry leaders worldwide"
    }
  ];

  // Categories data
  const categories = [
    {
      id: 1,
      name: "Composite Tubes",
      image: compositeTube,
      description: "Carbon fiber & fiberglass tubes",
      productCount: 24,
      link: "/Composite-tubes"
    },
    {
      id: 2,
      name: "Composite Plates",
      image: compositePlate,
      description: "High-strength composite plates",
      productCount: 18,
      link: "/composite-plates"
    },
    {
      id: 3,
      name: "Reinforcement",
      image: aramid1,
      description: "Carbon fabrics & prepregs",
      productCount: 32,
      link: "/reinforcement"
    },
    {
      id: 4,
      name: "Epoxy System",
      image: core1,
      description: "Professional epoxy resins",
      productCount: 15,
      link: "/epoxy-system"
    },
    {
      id: 5,
      name: "Core Materials",
      image: core2,
      description: "Foam cores & honeycomb",
      productCount: 12,
      link: "/core-material"
    },
   
  ];

  // Featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Carbon Fiber 3K 2x2 Twill 200GSM",
      price: 4599,
      originalPrice: 5999,
      rating: 4.8,
      reviewCount: 127,
      image: carbon3k1,
      category: "Reinforcement",
      isNew: true,
      reinforcementCategory: "carbonFiber",
      productId: "3"
    },
    {
      id: 2,
      name: "Rohacell PMI Foam Core 2mm",
      price: 3250,
      originalPrice: 4000,
      rating: 4.6,
      reviewCount: 89,
      image: core1,
      category: "Core Materials",
      isNew: false
    },
    {
      id: 3,
      name: "Aramid - 200gsm",
      price: 6799,
      originalPrice: 7999,
      rating: 4.9,
      reviewCount: 203,
      image: aramid1,
      category: "Reinforcement",
      isNew: false,
      reinforcementCategory: "aramid",
      productId: "12"
    },
    {
      id: 4,
      name: "Carbon Fiber Tube 12mm",
      price: 2875,
      originalPrice: 3500,
      rating: 4.7,
      reviewCount: 156,
      image: carbon3k2,
      category: "Composite Tubes",
      isNew: true
    }
  ];

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle featured product click
  const handleFeaturedProductClick = (product) => {
    // Map product categories to reinforcement page categories
    const categoryMapping = {
      'Reinforcement': 'reinforcement',
      'Core Materials': 'core-material',
      'Epoxy System': 'epoxy-system',
      'Composite Plates': 'composite-plates',
      'Composite Tubes': 'Composite-tubes'
    };

    const targetCategory = categoryMapping[product.category];
    
    if (targetCategory === 'reinforcement') {
      // For reinforcement products, use the pre-defined category and product ID
      const reinforcementCategory = product.reinforcementCategory;
      const productId = product.productId;
      
      // Navigate to reinforcement page with category and product parameters
      navigate(`/reinforcement?category=${reinforcementCategory}&product=${productId}`);
    } else {
      // For other categories, navigate to their respective pages
      navigate(`/${targetCategory}`);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0">
          <img
            src={heroImages[currentImageIndex].url}
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-white"
              >
              
                <p className="text-xl md:text-4xl mb-8 text-gray-200">
                  Premium composite materials for aerospace, automotive, and industrial applications
                </p>
              </motion.div>

              {/* Search Bar */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                onSubmit={handleSearch}
                className="relative max-w-2xl"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for carbon fiber, epoxy, tools, and more..."
                    className="w-full px-6 py-5 text-lg rounded-full border-2 border-transparent focus:border-blue-500 focus:outline-none shadow-2xl bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-600 pr-16"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </motion.form>
            </div>
          </div>
        </div>

        {/* Hero Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Info Banner */}
      <section className="bg-neutral-900 py-8 border-b border-neutral-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/contact" className="group">
              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-neutral-800 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="bg-blue-900 p-3 rounded-lg group-hover:bg-blue-800 transition-colors duration-300">
                  <Phone className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors duration-300">Expert Help & Advice</h3>
                  <p className="text-neutral-300 text-sm group-hover:text-neutral-200 transition-colors duration-300">By phone, email, and live chat</p>
                </div>
              </div>
            </Link>
            <Link to="/contact" className="group">
              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-neutral-800 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="bg-green-900 p-3 rounded-lg group-hover:bg-green-800 transition-colors duration-300">
                  <Star className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-green-300 transition-colors duration-300">Guaranteed Quality & Value</h3>
                  <p className="text-neutral-300 text-sm group-hover:text-neutral-200 transition-colors duration-300">We won't be beaten on quality or price</p>
                </div>
              </div>
            </Link>
            <Link to="/contact" className="group">
              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-neutral-800 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <div className="bg-orange-900 p-3 rounded-lg group-hover:bg-orange-800 transition-colors duration-300">
                  <MapPin className="w-6 h-6 text-orange-400 group-hover:text-orange-300 transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-orange-300 transition-colors duration-300">Fast Shipping</h3>
                  <p className="text-neutral-300 text-sm group-hover:text-neutral-200 transition-colors duration-300">Quick delivery across India</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Main Categories
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Discover our comprehensive range of composite materials and tools
            </p>
          </motion.div>

          <div className="flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group w-full"
                >
                  <Link to={category.link} className="block h-full">
                    <div className="bg-neutral-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-700 hover:border-blue-500 h-full flex flex-col">
                      <div className="aspect-square overflow-hidden flex-shrink-0">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-white text-sm md:text-base mb-1 line-clamp-2">
                            {category.name}
                          </h3>
                          <p className="text-neutral-400 text-xs md:text-sm mb-2 line-clamp-2">
                            {category.description}
                          </p>
                        </div>
                        <p className="text-blue-400 text-xs font-medium mt-auto">
                          {category.productCount} products
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-neutral-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Featured Products
              </h2>
              <p className="text-lg text-neutral-300">
                Top-rated materials chosen by our customers
              </p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center text-blue-400 hover:text-blue-300 font-semibold"
            >
              View All Products
              <ChevronRight size={20} className="ml-2" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-neutral-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-700 hover:border-blue-500 cursor-pointer"
                onClick={() => handleFeaturedProductClick(product)}
              >
                <div className="relative">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        NEW
                      </span>
                    )}
                  </div>

              

                  
                </div>

                <div className="p-4">
                  <p className="text-neutral-400 text-xs font-medium mb-1">
                    {product.category}
                  </p>
                  <h3 className="font-semibold text-white text-sm mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-neutral-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-400 ml-1">
                      ({product.reviewCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-neutral-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile View All Button */}
          <div className="md:hidden text-center mt-8">
            <Link
              to="/products"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              View All Products
              <ChevronRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

    
    </div>
  );
};

export default Homepage; 