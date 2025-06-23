import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-black text-white overflow-hidden pt-20">
      

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