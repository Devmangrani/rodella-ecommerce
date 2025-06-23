import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/myState';

const materials = {
  carbon_fiber: { density: 1.6, label: 'Carbon Fiber' },
  aluminum: { density: 2.7, label: 'Aluminum' },
  steel: { density: 7.85, label: 'Steel' },
};

const defaultPlate = {
  material: 'carbon_fiber',
  length: 400,
  breadth: 300,
  thickness: 2,
  unit: 'mm',
};

function convertToMM(value, unit) {
  if (unit === 'mm') return value;
  if (unit === 'inch') return value * 25.4;
  return value;
}

function calculateResults({ material, length, breadth, thickness, unit }) {
  // Convert all to mm for calculation
  const lenMM = convertToMM(Number(length), unit);
  const breadthMM = convertToMM(Number(breadth), unit);
  const thicknessMM = convertToMM(Number(thickness), unit);
  
  const volume = lenMM * breadthMM * thicknessMM; // mm³
  const area = lenMM * breadthMM; // mm²
  const mass = volume * materials[material].density / 1000; // g
  
  return {
    area: area.toFixed(2),
    mass: mass.toFixed(2),
    price: (mass * 2).toFixed(2), // Example price calculation
  };
}

const inputStyle = (active) =>
  `w-20 px-2 py-1 rounded-lg bg-neutral-900/50 border border-neutral-700 text-center text-white text-lg focus:outline-none focus:ring-2 focus:ring-neutral-600 transition-all duration-300 hover:border-neutral-600 ${
    active ? 'ring-2 ring-neutral-600' : ''
  }`;

const selectButton = (active) =>
  `px-6 py-3 rounded-xl text-base font-medium transition-all duration-300 transform hover:scale-105 ${
    active 
      ? 'bg-neutral-600 text-white shadow-lg shadow-neutral-600/20' 
      : 'bg-neutral-900/50 text-neutral-300 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800/50'
  }`;

const PlateSVG = ({ length, breadth, thickness }) => {
  const svgSize = 1500;
  const padding = 150;
  
  // Base point for the isometric drawing - adjusted to reduce top space
  const baseX = padding;
  const baseY = svgSize - padding - 500; // Reduced from svgSize - padding
  
  // Scale factors - adjusted for better thickness visualization
  const scale = Math.min((svgSize - 2 * padding) / (length + breadth), 
                        (svgSize - 2 * padding) / (thickness + length)) * 1.2;
                        
  // Calculate dimensions with enhanced thickness scaling
  const scaledLength = length * scale;
  const scaledBreadth = breadth * scale;
  const scaledThickness = thickness * scale * 3; // Increased thickness multiplier from 1.5 to 3
  
  // Isometric angles
  const angle = Math.PI / 6;
  const cos30 = Math.cos(angle);
  const sin30 = Math.sin(angle);

  // Calculate points for isometric view
  const points = {
    // Front face (bottom-left corner as starting point)
    frontBottomLeft: [baseX, baseY],
    frontBottomRight: [baseX + scaledLength, baseY],
    frontTopRight: [baseX + scaledLength, baseY - scaledThickness],
    frontTopLeft: [baseX, baseY - scaledThickness],

    // Back face points (offset by breadth * cos30 right and breadth * sin30 up)
    backBottomLeft: [baseX + scaledBreadth * cos30, baseY - scaledBreadth * sin30],
    backBottomRight: [baseX + scaledLength + scaledBreadth * cos30, baseY - scaledBreadth * sin30],
    backTopRight: [baseX + scaledLength + scaledBreadth * cos30, baseY - scaledThickness - scaledBreadth * sin30],
    backTopLeft: [baseX + scaledBreadth * cos30, baseY - scaledThickness - scaledBreadth * sin30],
  };

  // Helper function to create path from points
  const pointsToPath = (pointArray) => pointArray.map(p => p.join(',')).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full flex justify-center"
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="max-w-[1000px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="topGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#aaa', stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: '#888', stopOpacity: 0.9 }} />
          </linearGradient>
          <linearGradient id="frontGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ddd', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#bbb', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="sideGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#999', stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: '#666', stopOpacity: 0.9 }} />
          </linearGradient>
        </defs>

        {/* Top face */}
        <polygon
          points={pointsToPath([
            points.frontTopLeft,
            points.frontTopRight,
            points.backTopRight,
            points.backTopLeft,
          ])}
          fill="url(#topGradient)"
          stroke="#444"
          strokeWidth="2"
        />

        {/* Right face */}
        <polygon
          points={pointsToPath([
            points.frontTopRight,
            points.frontBottomRight,
            points.backBottomRight,
            points.backTopRight,
          ])}
          fill="url(#sideGradient)"
          stroke="#444"
          strokeWidth="2"
        />

        {/* Front face */}
        <polygon
          points={pointsToPath([
            points.frontBottomLeft,
            points.frontBottomRight,
            points.frontTopRight,
            points.frontTopLeft,
          ])}
          fill="url(#frontGradient)"
          stroke="#444"
          strokeWidth="2"
        />

        {/* Thickness visualization - enhanced with additional lines */}
        <line
          x1={points.frontTopLeft[0]}
          y1={points.frontTopLeft[1]}
          x2={points.backTopLeft[0]}
          y2={points.backTopLeft[1]}
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeDasharray="3,3"
        />
        <line
          x1={points.frontTopRight[0]}
          y1={points.frontTopRight[1]}
          x2={points.backTopRight[0]}
          y2={points.backTopRight[1]}
          stroke="#a3a3a3"
          strokeWidth="2"
          strokeDasharray="3,3"
        />

        {/* Dimension lines and labels */}
        {/* Length */}
        <line
          x1={points.frontBottomLeft[0]}
          y1={points.frontBottomLeft[1] + 40}
          x2={points.frontBottomRight[0]}
          y2={points.frontBottomRight[1] + 40}
          stroke="#a3a3a3"
          strokeWidth="2.5"
          strokeDasharray="5,5"
        />
        <text
          x={(points.frontBottomLeft[0] + points.frontBottomRight[0]) / 2}
          y={points.frontBottomLeft[1] + 80}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="20"
          fontWeight="bold"
        >
          Length: {length} mm
        </text>

        {/* Breadth */}
        <line
          x1={points.frontBottomRight[0]}
          y1={points.frontBottomRight[1]}
          x2={points.backBottomRight[0]}
          y2={points.backBottomRight[1]}
          stroke="#a3a3a3"
          strokeWidth="2.5"
          strokeDasharray="5,5"
        />
        <text
          x={points.frontBottomRight[0] + (points.backBottomRight[0] - points.frontBottomRight[0]) / 2}
          y={points.frontBottomRight[1] + (points.backBottomRight[1] - points.frontBottomRight[1]) / 2 - 20}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="20"
          fontWeight="bold"
        >
          Breadth: {breadth} mm
        </text>

        {/* Thickness measurement - enhanced */}
        <line
          x1={points.frontBottomLeft[0] - 40}
          y1={points.frontBottomLeft[1]}
          x2={points.frontTopLeft[0] - 40}
          y2={points.frontTopLeft[1]}
          stroke="#a3a3a3"
          strokeWidth="3"
          strokeDasharray="5,5"
        />
        <text
          x={points.frontBottomLeft[0] - 80}
          y={(points.frontBottomLeft[1] + points.frontTopLeft[1]) / 2}
          textAnchor="middle"
          fill="#a3a3a3"
          fontSize="20"
          fontWeight="bold"
          transform={`rotate(-90 ${points.frontBottomLeft[0] - 80} ${(points.frontBottomLeft[1] + points.frontTopLeft[1]) / 2})`}
        >
          Thickness: {thickness} mm
        </text>

        {/* Additional thickness indicator lines */}
        <line
          x1={points.frontBottomLeft[0]}
          y1={points.frontBottomLeft[1]}
          x2={points.frontTopLeft[0]}
          y2={points.frontTopLeft[1]}
          stroke="#a3a3a3"
          strokeWidth="1.5"
          strokeDasharray="2,2"
        />
        <line
          x1={points.frontBottomRight[0]}
          y1={points.frontBottomRight[1]}
          x2={points.frontTopRight[0]}
          y2={points.frontTopRight[1]}
          stroke="#a3a3a3"
          strokeWidth="1.5"
          strokeDasharray="2,2"
        />
      </svg>
    </motion.div>
  );
};

const CompositePlates = () => {
  const [plate, setPlate] = useState(defaultPlate);
  const [results, setResults] = useState(() => calculateResults(defaultPlate));
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addToCartWithAuth } = useCart();

  useEffect(() => {
    try {
      setResults(calculateResults(plate));
    } catch (err) {
      setError('Error calculating results. Please check your inputs.');
      console.error('Calculation error:', err);
    }
  }, [plate]);

  const handleChange = (field, value) => {
    try {
      if (field === 'thickness') {
        const thicknessValue = Math.max(0.2, Math.min(10, parseFloat(value))); // Allow between 0.2mm and 10mm
        setError('');
        setPlate((prev) => ({ ...prev, [field]: thicknessValue }));
        return;
      }
      
      // Updated validation for length and breadth
      if (field === 'length' || field === 'breadth') {
        const numValue = parseFloat(value);
        if (numValue < 200) {
          setError(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot be less than 200 mm`);
        } else if (numValue > 1000) {
          setError(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot be more than 1000 mm`);
        } else {
          setError('');
        }
        setPlate((prev) => ({ ...prev, [field]: value }));
        return;
      }
      
      setError('');
      setPlate((prev) => ({ ...prev, [field]: value }));
    } catch (err) {
      setError('Error updating plate properties. Please try again.');
      console.error('Update error:', err);
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(100, value));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    // Create a product object for the plate
    const product = {
      id: `composite_plate_${plate.material}_${plate.length}_${plate.breadth}_${plate.thickness}`,
      title: `Composite Plate - ${materials[plate.material].label}`,
      category: 'Composite Plates',
      images: ['https://via.placeholder.com/300x200?text=Composite+Plate'], // Add actual image URL
      details: {
        material: materials[plate.material].label,
        length: `${plate.length}mm`,
        breadth: `${plate.breadth}mm`,
        thickness: `${plate.thickness}mm`,
        weight: `${results.mass}g`,
      }
    };

    // Create calculations object
    const calculations = {
      area: parseFloat(results.area) || 0,
      weight: parseFloat(results.mass) / 1000 || 0, // Convert to kg
      mass: parseFloat(results.mass) || 0,
      price: parseFloat(results.price) || 0,
      mrp: parseFloat(results.price) || 0
    };

    // Use the global cart function with authentication check
    addToCartWithAuth(product, calculations, 1, navigate); // Plates don't have length parameter
  };

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
            Composite Plate Specifications
          </motion.h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800 w-full"
        >
          <div className="flex flex-col items-center">
          
          <div className="formfield flex flex-wrap gap-2 mb-4 sm:mb-8 justify-center">
            <div className="flex items-center gap-2">
              <p className="text-neutral-300 text-sm">Material:</p>
              <select
                className={selectButton(false) + ' w-42 sm:w-42'}
                value={plate.material}
                onChange={(e) => handleChange('material', e.target.value)}
              >
                <option value="carbon_fiber">Carbon Fiber</option>
                <option value="aluminum">Aluminum</option>
                <option value="steel">Steel</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 sm:mb-8 w-full max-w-3xl">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="formfield flex flex-col items-center"
            >
              <p className="text-neutral-300 text-sm mb-1">Length (mm)</p>
              <input
                type="number"
                className={`${inputStyle(true)} ${error.includes('Length') ? 'border-red-500' : ''}`}
                value={plate.length}
                onChange={(e) => handleChange('length', e.target.value)}
                autoComplete="off"
              />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="formfield flex flex-col items-center"
            >
              <p className="text-neutral-300 text-sm mb-1">Breadth (mm)</p>
              <input
                type="number"
                className={`${inputStyle(true)} ${error.includes('Breadth') ? 'border-red-500' : ''}`}
                value={plate.breadth}
                onChange={(e) => handleChange('breadth', e.target.value)}
                autoComplete="off"
              />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="formfield flex flex-col items-center"
            >
              <p className="text-neutral-300 text-sm mb-1">Thickness (mm)</p>
              <input
                type="number"
                step="0.1"
                className={inputStyle(true)}
                value={plate.thickness}
                onChange={(e) => handleChange('thickness', e.target.value)}
                autoComplete="off"
              />
            </motion.div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mb-4 text-center"
            >
              {error}
            </motion.div>
          )}

          <motion.div 
            className="w-full max-w-[600px] mb-1"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-neutral-300 text-center text-lg font-semibold mb-2">Plate View</p>
            <PlateSVG 
              length={Number(plate.length) >= 200 && Number(plate.length) <= 1000 ? Number(plate.length) : 400} 
              breadth={Number(plate.breadth) >= 200 && Number(plate.breadth) <= 1000 ? Number(plate.breadth) : 300}
              thickness={Number(plate.thickness)}
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mt-1">
            <div className="bg-neutral-800/50 p-3 sm:p-4 rounded-lg">
              <p className="text-neutral-300 text-sm">Surface Area</p>
              <p className="text-lg sm:text-xl">{results.area} mm²</p>
            </div>
          
            <div className="bg-neutral-800/50 p-3 sm:p-4 rounded-lg">
              <p className="text-neutral-300 text-sm">Mass</p>
              <p className="text-lg sm:text-xl">{results.mass} g</p>
            </div>

            <div className="bg-neutral-800/50 p-3 sm:p-4 rounded-lg">
              <p className="text-neutral-300 text-sm">Price</p>
              <p className="text-lg sm:text-xl">{results.price} rs</p>
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="w-full max-w-3xl mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-neutral-300 text-sm">Quantity:</p>
              <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-l-lg bg-neutral-900/50 border border-neutral-700 text-white hover:border-neutral-600 transition-all duration-300"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  -
                </motion.button>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 h-8 text-center bg-neutral-900/50 border-t border-b border-neutral-700 text-white focus:outline-none focus:border-neutral-600"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-r-lg bg-neutral-900/50 border border-neutral-700 text-white hover:border-neutral-600 transition-all duration-300"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </motion.button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-2 rounded-lg bg-neutral-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              onClick={handleAddToCart}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Add to Cart
            </motion.button>
          </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CompositePlates; 