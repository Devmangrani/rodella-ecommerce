import { useState } from 'react';
import CircularTube from './CircularTube';
import RectangularTube from './RectangularTube';
import SquareTube from './SquareTube';
import { motion } from 'framer-motion';

const TubingComparison = () => {
  const [selectedShape, setSelectedShape] = useState('circular');

  const selectButton = (active) =>
    `px-6 py-3 rounded-xl text-base font-medium transition-all duration-300 transform hover:scale-105 ${
      active 
        ? 'bg-neutral-600 text-white shadow-lg shadow-neutral-600/20' 
        : 'bg-neutral-900/50 text-neutral-300 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50'
    }`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full bg-black text-white font-sans pt-20"
    >
      <div className="w-full h-full py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-4xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Composite Tube Specifications
          </motion.h1>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={selectButton(selectedShape === 'circular')}
              onClick={() => setSelectedShape('circular')}
            >
              Circular Tube
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={selectButton(selectedShape === 'rectangular')}
              onClick={() => setSelectedShape('rectangular')}
            >
              Rectangular Tube
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={selectButton(selectedShape === 'square')}
              onClick={() => setSelectedShape('square')}
            >
              Square Tube
            </motion.button>
          </motion.div>
        </motion.div>
        
        <motion.div
          key={selectedShape}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800 w-full"
        >
          {selectedShape === 'circular' ? (
            <CircularTube />
          ) : selectedShape === 'rectangular' ? (
            <RectangularTube />
          ) : (
            <SquareTube />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TubingComparison; 