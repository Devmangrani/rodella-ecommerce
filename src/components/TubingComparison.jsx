import { useState } from 'react';
import CircularTube from './CircularTube';
import RectangularTube from './RectangularTube';
import SquareTube from './SquareTube';
import { motion } from 'framer-motion';

const materials = {
  carbon_fiber: { 
    density: 1.6, 
    label: 'Carbon Fiber',
    bgImages: {
      circular: '/assets/circular-tube-carbon-fiber.jpg',
      rectangular: '/assets/Rectangular-Carbon-fiber-tube.webp',
      square: '/assets/carbon-fiber-square-tubes.webp'
    }
  },
  glass_fiber: { 
    density: 2.7, 
    label: 'Glass Fiber',
    bgImages: {
      circular: '/assets/circular-tube-carbon-fiber.jpg',
      rectangular: '/assets/Rectangular-Carbon-fiber-tube.webp',
      square: '/assets/carbon-fiber-square-tubes.webp'
    }
  },
  // carbon_kevlar: { 
  //   density: 1.44, 
  //   label: 'Carbon Kevlar',
  //   bgImages: {
  //     circular: '/assets/circular-tube-carbon-fiber.jpg',
  //     rectangular: '/assets/Rectangular-Carbon-fiber-tube.webp',
  //    square: '/assets/carbon-fiber-square-tubes.webp'
  //   }
  // },
};

const TubingComparison = () => {
  const [selectedShape, setSelectedShape] = useState('circular');
  const [selectedMaterial, setSelectedMaterial] = useState('carbon_fiber');

  const selectButton = (active) =>
    `px-6 py-3 rounded-xl text-base font-medium transition-all duration-300 transform hover:scale-105 ${
      active 
        ? 'bg-neutral-600 text-white shadow-lg shadow-neutral-600/20' 
        : 'bg-neutral-900/50 text-neutral-300 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50'
    }`;

  // Get the background image based on selected shape and material
  const getCurrentBackgroundImage = () => {
    return materials[selectedMaterial]?.bgImages?.[selectedShape] || materials[selectedMaterial]?.bgImages?.circular;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full bg-black text-white font-sans pt-20 relative"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out"
        style={{ 
          backgroundImage: `url(${getCurrentBackgroundImage()})`,
        }}
      />
      <div className="absolute inset-0 bg-black/70" />
      
      <div className="relative z-10 w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Composite Tube Specifications
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto">
            Configure your custom composite tube dimensions and specifications
          </p>
        </motion.div>
        
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-neutral-900/80 rounded-xl p-6 sm:p-8 shadow-2xl"
          >
            {/* Shape Selection */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-neutral-200 mb-3 text-center sm:text-left">
                Tube Shape Selection
              </h3>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                    selectedShape === 'circular'
                      ? 'bg-neutral-600 text-white shadow-lg shadow-neutral-600/20' 
                      : 'bg-neutral-900/50 text-neutral-300 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50'
                  }`}
                  onClick={() => setSelectedShape('circular')}
                >
                  Circular
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                    selectedShape === 'rectangular'
                      ? 'bg-neutral-600 text-white shadow-lg shadow-neutral-600/20' 
                      : 'bg-neutral-900/50 text-neutral-300 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50'
                  }`}
                  onClick={() => setSelectedShape('rectangular')}
                >
                  Rectangular
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                    selectedShape === 'square'
                      ? 'bg-neutral-600 text-white shadow-lg shadow-neutral-600/20' 
                      : 'bg-neutral-900/50 text-neutral-300 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50'
                  }`}
                  onClick={() => setSelectedShape('square')}
                >
                  Square
                </motion.button>
              </div>
            </div>
            
            {/* Tube Component */}
            <motion.div
              key={selectedShape}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {selectedShape === 'circular' ? (
                <CircularTube 
                  selectedMaterial={selectedMaterial} 
                  onMaterialChange={setSelectedMaterial}
                  materials={materials}
                  shapeType="circular"
                />
              ) : selectedShape === 'rectangular' ? (
                <RectangularTube 
                  selectedMaterial={selectedMaterial} 
                  onMaterialChange={setSelectedMaterial}
                  materials={materials}
                  shapeType="rectangular"
                />
              ) : (
                <SquareTube 
                  selectedMaterial={selectedMaterial} 
                  onMaterialChange={setSelectedMaterial}
                  materials={materials}
                  shapeType="square"
                />
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TubingComparison; 