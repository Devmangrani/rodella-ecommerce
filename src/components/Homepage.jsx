import React, { useState, useEffect, lazy } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Star, ArrowRight, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import SEO from './SEO';
import LazyImage from './LazyImage';
import { createWebSiteStructuredData, createStoreStructuredData, compositeMaterialsFAQs, createFAQStructuredData } from './StructuredData';

// Import all images
// import carbon200 from '/assets/200carbon.jpg';
import carbon3k1 from '/assets/Carbonfiber-3k-2-2twill-200gsm-1100:sqm1.jpeg';
import carbon200 from '/assets/Carbonfiber-3k-2-2twill-200gsm-1100:sqm2.jpeg';
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
      image: epoxy1,
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
      <div 
        className="min-h-screen text-white relative"
        style={{
          backgroundImage: "url('/assets/carbon-fiber-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      >
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
        
        {/* Content wrapper with relative positioning */}
        <div className="relative z-10">
     

     

      {/* Categories Section - Full Page */}
      <section className="min-h-screen flex flex-col py-8 sm:py-12 lg:py-16 pt-20 sm:pt-24 lg:pt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6">
              Main Categories
            </h2>
            <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-neutral-300 max-w-4xl mx-auto leading-relaxed">
              Discover our comprehensive range of composite materials and tools designed for professional applications
            </p>
          </motion.div>

          {/* Categories Grid */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-7xl">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
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
                      <div className="bg-neutral-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-neutral-700/50 hover:border-blue-500/70 h-full flex flex-col group-hover:bg-neutral-700/50 group-hover:scale-105">
                        {/* Image Container */}
                        <div className="aspect-square overflow-hidden flex-shrink-0 relative">
                          <LazyImage
                            src={category.image}
                            alt={`${category.name} - ${category.description} available at Rodella Composites`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-3 sm:p-4 lg:p-6 xl:p-8 flex-grow flex flex-col justify-between">
                          <div className="flex-grow">
                            <h3 className="font-bold text-white text-sm sm:text-base lg:text-lg xl:text-xl mb-2 lg:mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors duration-300">
                              {category.name}
                            </h3>
                            <p className="text-neutral-400 text-xs sm:text-sm lg:text-base mb-3 lg:mb-4 line-clamp-2 group-hover:text-neutral-300 transition-colors duration-300">
                              {category.description}
                            </p>
                          </div>
                          
                          {/* Product Count */}
                          <div className="flex items-center justify-between mt-auto">
                            <p className="text-blue-400 text-xs sm:text-sm lg:text-base font-medium group-hover:text-blue-300 transition-colors duration-300">
                              {category.productCount} products
                            </p>
                            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-neutral-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-8 sm:mt-12 lg:mt-16"
          >
            <p className="text-neutral-400 text-sm sm:text-base lg:text-lg mb-4">
              Need help choosing the right materials?
            </p>
            <a 
              href="https://wa.me/917723008905" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 lg:px-8 lg:py-4 bg-blue-600 hover:bg-blue-700 text-white 
              font-medium rounded-lg transition-all duration-300 text-sm lg:text-base"
            >
              Contact Our Experts
              <ArrowRight className="ml-2 w-4 h-4 lg:w-5 lg:h-5" />
            </a>
          </motion.div>
        </div>
      </section>    
        </div>
      </div>
    </>
  );
};

export default Homepage; 