import React from 'react';
import { motion } from 'framer-motion';

const EpoxySystem = () => {
  const epoxyTypes = [
    {
      title: "Aerospace Grade Epoxy",
      description: "High-temperature, high-performance epoxy systems for critical applications",
      properties: ["300°C Service Temp", "Low Outgassing", "Radiation Resistant", "Long Pot Life"],
      applications: ["Satellites", "Aircraft", "Rockets", "UAVs"],
      image: "/api/placeholder/400/300"
    },
    {
      title: "Fast Cure Systems",
      description: "Rapid curing epoxy systems for high-volume production",
      properties: ["5-15 min Cure", "Room Temp Cure", "High Strength", "Low Viscosity"],
      applications: ["Prototyping", "Repair", "Small Parts", "Quick Builds"],
      image: "/api/placeholder/400/300"
    },
    {
      title: "Structural Adhesives",
      description: "High-strength bonding systems for critical structural joints",
      properties: ["High Peel Strength", "Fatigue Resistant", "Environmental Stable", "Gap Filling"],
      applications: ["Bonding", "Assembly", "Structural Joints", "Repairs"],
      image: "/api/placeholder/400/300"
    },
    {
      title: "Vacuum Infusion Resins",
      description: "Low-viscosity systems optimized for vacuum infusion processes",
      properties: ["Ultra Low Viscosity", "Long Working Time", "Excellent Wet-out", "Void-free"],
      applications: ["Large Parts", "Complex Geometries", "Thick Laminates", "Wind Energy"],
      image: "/api/placeholder/400/300"
    }
  ];

  const technicalSpecs = [
    { property: "Glass Transition Temperature", value: "Up to 300°C", unit: "" },
    { property: "Tensile Strength", value: "80-120", unit: "MPa" },
    { property: "Flexural Modulus", value: "3-5", unit: "GPa" },
    { property: "Viscosity Range", value: "200-2000", unit: "mPa·s" },
    { property: "Pot Life", value: "30-180", unit: "minutes" },
    { property: "Cure Time", value: "2-24", unit: "hours" }
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
            Epoxy Systems
          </h1>
          <p className="text-xl text-neutral-400 max-w-4xl mx-auto leading-relaxed">
            Professional-grade epoxy systems and resins engineered for high-performance composite manufacturing. From aerospace-grade to fast-cure systems, we have the right solution for your application.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
        >
          {epoxyTypes.map((epoxy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-all duration-300"
            >
              <div className="aspect-video bg-neutral-700 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-neutral-500">🧪 Epoxy Sample</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">{epoxy.title}</h3>
              <p className="text-neutral-400 mb-4">{epoxy.description}</p>
              
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2 text-neutral-300">Properties:</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {epoxy.properties.map((property, idx) => (
                    <span
                      key={idx}
                      className="text-sm bg-neutral-700 px-3 py-1 rounded-full text-center"
                    >
                      {property}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2 text-neutral-300">Applications:</h4>
                <div className="flex flex-wrap gap-2">
                  {epoxy.applications.map((app, idx) => (
                    <span
                      key={idx}
                      className="text-sm border border-neutral-600 px-3 py-1 rounded-full text-center"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Technical Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-neutral-900 rounded-xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Technical Specifications Range</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicalSpecs.map((spec, index) => (
              <div key={index} className="text-center p-4 bg-neutral-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{spec.property}</h3>
                <div className="text-2xl font-bold text-white mb-1">
                  {spec.value} <span className="text-lg text-neutral-400">{spec.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Custom Formulations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl p-12"
        >
          <h2 className="text-3xl font-bold mb-6">Custom Epoxy Formulations</h2>
          <p className="text-xl text-neutral-400 mb-8 max-w-3xl mx-auto">
            Need a specific cure profile, temperature resistance, or mechanical property? Our chemists can formulate custom epoxy systems to meet your exact specifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-neutral-200 transition-all duration-300 transform hover:scale-105">
              Request Custom Formulation
            </button>
            <button className="border border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
              Download Technical Data Sheets
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EpoxySystem; 