import React, { useState, useEffect, lazy } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Star, ArrowRight, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import SEO from './SEO';
import LazyImage from './LazyImage';
import { createWebSiteStructuredData, createStoreStructuredData, compositeMaterialsFAQs, createFAQStructuredData } from './StructuredData';

// Import all images
import carbon200 from '/assets/200carbon.jpg';
import carbon3k1 from '/assets/Carbonfiber-3k-2-2twill-200gsm-1100:sqm1.jpeg';
import carbon3k2 from '/assets/Carbonfiber-3k-2-2twill-200gsm-1100:sqm2.jpeg';
import carbon3k3 from '/assets/Carbonfiber-3k-2-2twill-200gsm-1100:sqm3.jpeg';
import aramid1 from '/assets/Aramid200gsm1.jpeg';
import aramid2 from '/assets/Aramid200gsm2.jpeg';
import aramid3 from '/assets/Aramid200gsm3.jpeg';
import core1 from '/assets/core1.jpeg';
import epoxy1 from '/assets/Epoxy one image.png';
import epoxy2 from '/assets/Epoxy-resins-556(1).png';
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

  // Categories data - updated with actual product counts from JSON files
  const categories = [
    {
      id: 1,
      name: "Composite Tubes",
      image: compositeTube,
      description: "Carbon fiber & fiberglass tubes",
      productCount: 8, // Placeholder for tubes (no data file yet)
      link: "/Composite-tubes"
    },
    {
      id: 2,
      name: "Composite Plates",
      image: compositePlate,
      description: "High-strength composite plates",
      productCount: 6, // Placeholder for plates (no data file yet)
      link: "/composite-plates"
    },
    {
      id: 3,
      name: "Reinforcement",
      image: aramid1,
      description: "Carbon fabrics & prepregs",
      productCount: 4, // 2 carbon fiber + 1 aramid + 1 mixed = 4 total
      link: "/reinforcement"
    },
    {
      id: 4,
      name: "Epoxy System",
      image: epoxy2,
      description: "Professional epoxy resins",
      productCount: 10, // 4 resins + 4 adhesives + 2 gelcoats = 10 total
      link: "/epoxy-system"
    },
    {
      id: 5,
      name: "Core Materials",
      image: core2,
      description: "Foam cores & honeycomb",
      productCount: 2, // 2 rohacell products
      link: "/core-material"
    },
   
  ];

  // Featured products - using real data from JSON files
  const featuredProducts = [
    {
      id: 1,
      name: "200 GSM 12K twill weave fabric (Aerospace series)",
      price: 1100,
      originalPrice: 1300,
      rating: 4.8,
      reviewCount: 127,
      image: carbon200,
      category: "Reinforcement",
      isNew: true,
      reinforcementCategory: "carbonFiber",
      productId: "2"
    },
    {
      id: 2,
      name: "Rohacell PMI Foam - 2mm",
      price: 1800,
      originalPrice: 2200,
      rating: 4.6,
      reviewCount: 89,
      image: core1,
      category: "Core Materials",
      isNew: false
    },
    {
      id: 3,
      name: "Aramid - 200gsm Plain Weave",
      price: 1500,
      originalPrice: 1800,
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
      name: "compound 556 + Hardner",
      price: 1200,
      originalPrice: 1500,
      rating: 4.7,
      reviewCount: 156,
      image: epoxy1,
      category: "Epoxy System",
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

  // SEO Data
  const websiteStructuredData = createWebSiteStructuredData();
  const storeStructuredData = createStoreStructuredData();
  const faqStructuredData = createFAQStructuredData(compositeMaterialsFAQs);

  return (
    <>
      <SEO
        title="Rodella Composites - Premium Carbon Fiber, Glass Fiber & Composite Materials | Professional Grade"
        description="Leading supplier of high-performance carbon fiber, glass fiber, aramid fabrics, composite tubes & plates, epoxy resins, and adhesives. Professional-grade materials for aerospace, automotive, marine, and industrial applications. Shop now!"
        canonical="https://rodella.shop"
        keywords="carbon fiber India, glass fiber materials, aramid kevlar fabric, composite tubes, composite plates, epoxy resin, carbon kevlar sheets, aerospace materials, automotive composites, marine composites, structural materials, prepreg carbon fiber, gelcoat, adhesives, rohacell foam"
        type="website"
        image="https://rodella.shop/assets/200carbon.jpg"
        imageAlt="Premium carbon fiber materials by Rodella Composites"
        structuredData={[websiteStructuredData, storeStructuredData, faqStructuredData]}
      />
      <div className="min-h-screen bg-black text-white mt-16">
     

     

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
            <div className="mt-4">
              <a
                href="https://rodella.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium"
              >
                <span>Visit rodella AEROSPACE LABS</span>
                <ChevronRight size={16} className="ml-1" />
              </a>
            </div>
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
                        <LazyImage
                          src={category.image}
                          alt={`${category.name} - ${category.description} available at Rodella Composites`}
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
              to="/reinforcement"
              className="hidden md:flex items-center text-blue-400 hover:text-blue-300 font-semibold"
            >
              View All Products
              <ChevronRight size={20} className="ml-2" />
            </Link>
          </motion.div>

          <div className="flex justify-center">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group w-full"
                >
                  <div 
                    className="bg-neutral-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-700 hover:border-blue-500 h-full flex flex-col cursor-pointer"
                    onClick={() => handleFeaturedProductClick(product)}
                  >
                                          <div className="relative">
                      <div className="aspect-square overflow-hidden flex-shrink-0">
                        <LazyImage
                          src={product.image}
                          alt={`${product.name} - ${product.category} from Rodella Composites. Professional grade composite material.`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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

                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <p className="text-neutral-400 text-xs font-medium mb-1">
                          {product.category}
                        </p>
                        <h3 className="font-semibold text-white text-sm md:text-base mb-1 line-clamp-2">
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
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-auto">
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
                  </div>
                </motion.div>
              ))}
            </div>
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
    </>
  );
};

export default Homepage; 