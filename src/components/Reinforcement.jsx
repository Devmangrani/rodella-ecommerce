import React from 'react';
import { motion } from 'framer-motion';

const Reinforcement = () => {
  const reinforcementTypes = [
    {
      title: "Carbon Fiber Fabrics",
      description: "High-quality carbon fiber woven fabrics for structural applications",
      specs: ["Plain Weave", "Twill Weave", "Unidirectional", "Various Weights"],
      image: "/api/placeholder/400/300"
    },
    {
      title: "Prepreg Materials",
      description: "Pre-impregnated carbon fiber with optimized resin systems",
      specs: ["Room Temp Storage", "Aerospace Grade", "Multiple Resin Types", "Custom Layups"],
      image: "/api/placeholder/400/300"
    },
    {
      title: "Hybrid Composites",
      description: "Carbon-Kevlar and carbon-glass hybrid reinforcements",
      specs: ["Impact Resistant", "Lightweight", "High Strength", "Multi-directional"],
      image: "/api/placeholder/400/300"
    },
    {
      title: "Specialty Weaves",
      description: "Custom woven patterns for specific applications",
      specs: ["3D Weaves", "Complex Geometries", "Custom Patterns", "Engineered Properties"],
      image: "/api/placeholder/400/300"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
            Reinforcement Materials
          </h1>
          <p className="text-xl text-neutral-400 max-w-4xl mx-auto leading-relaxed">
            Advanced reinforcement materials for high-performance composite manufacturing. From carbon fiber fabrics to prepregs, we provide the building blocks for next-generation composites.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
        >
          {reinforcementTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-all duration-300"
            >
              <div className="aspect-video bg-neutral-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-neutral-500">Image Placeholder</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">{type.title}</h3>
              <p className="text-neutral-400 mb-4">{type.description}</p>
              <div className="grid grid-cols-2 gap-2">
                {type.specs.map((spec, idx) => (
                  <span
                    key={idx}
                    className="text-sm bg-neutral-700 px-3 py-1 rounded-full text-center"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center bg-neutral-900 rounded-xl p-12"
        >
          <h2 className="text-3xl font-bold mb-6">Custom Reinforcement Solutions</h2>
          <p className="text-xl text-neutral-400 mb-8 max-w-3xl mx-auto">
            Need a specific reinforcement pattern or hybrid material? Our engineering team can develop custom solutions tailored to your exact requirements.
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-neutral-200 transition-all duration-300 transform hover:scale-105">
            Contact Engineering Team
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Reinforcement; 