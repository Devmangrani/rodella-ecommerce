import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from './Navbar';

const Homepage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    "/api/placeholder/1200/600", // Carbon fiber texture
    "/api/placeholder/1200/600", // Drone manufacturing
    "/api/placeholder/1200/600", // Composite plates
    "/api/placeholder/1200/600"  // Carbon fiber tubes
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const products = [
    {
      title: "Composite Tubes",
      description: "High-performance carbon fiber and fiberglass tubes for aerospace, automotive, and UAV applications. Available in various diameters and wall thicknesses.",
      features: ["Carbon Fiber", "Fiberglass", "Carbon-Kevlar", "Custom Sizes"],
      link: "/Composite-tubes",
      icon: "🛠️"
    },
    {
      title: "Composite Plates",
      description: "Lightweight, high-strength composite plates perfect for structural applications in drones, aircraft, and high-performance vehicles.",
      features: ["Ultra-lightweight", "High Strength", "Precision Cut", "Various Thicknesses"],
      link: "/composite-plates",
      icon: "📐"
    },
    {
      title: "Reinforcement",
      description: "Advanced reinforcement materials including carbon fiber fabrics, prepregs, and hybrid composites for complex manufacturing requirements.",
      features: ["Carbon Fabrics", "Prepregs", "Hybrid Materials", "Custom Weaves"],
      link: "/reinforcement",
      icon: "🔗"
    },
    {
      title: "Epoxy System",
      description: "Professional-grade epoxy systems and resins optimized for composite manufacturing with superior mechanical properties and durability.",
      features: ["High-temp Resins", "Fast Cure", "Low Viscosity", "Aerospace Grade"],
      link: "/epoxy-system",
      icon: "🧪"
    }
  ];



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50 container mx-auto px-4 pt-2">
        <Header />
      </div>
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-black opacity-90 z-10"></div>
        
        {/* Background Animation */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-800/20 to-neutral-600/20"></div>
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative z-20 text-center max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
              COMPOSITES
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-neutral-300 max-w-4xl mx-auto leading-relaxed">
              Niche Composites Manufacturer
            </p>
            <p className="text-lg md:text-xl mb-12 text-neutral-400 max-w-4xl mx-auto">
              Specializing in low volume production of high-performance carbon fiber components for aerospace, automotive, and next-generation applications
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex justify-center"
          >
            <button className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-neutral-200 transition-all duration-300 transform hover:scale-105">
              Explore Products
            </button>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full opacity-60"
          animate={{
            y: [0, -20, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-1 h-1 bg-neutral-400 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
      </section>

      {/* Products Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Products</h2>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Cutting-edge composite materials engineered for the most demanding applications
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {products.map((product, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <Link to={product.link}>
                  <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-8 h-full hover:border-neutral-600 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-4">{product.icon}</span>
                      <h3 className="text-2xl font-bold">{product.title}</h3>
                    </div>
                    <p className="text-neutral-400 mb-6 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {product.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-sm bg-neutral-700 px-3 py-1 rounded-full text-center"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-white group-hover:text-neutral-300 transition-colors">
                      <span className="mr-2">Learn More</span>
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default Homepage; 