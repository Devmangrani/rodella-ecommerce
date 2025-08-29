// Math utilities to prevent NaN errors in production

/**
 * Safe number conversion that prevents NaN
 */
export const safeNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined || isNaN(value)) {
    return defaultValue;
  }
  return Number(value);
};

/**
 * Safe division that prevents NaN
 */
export const safeDivision = (numerator, denominator, defaultValue = 0) => {
  const num = safeNumber(numerator);
  const den = safeNumber(denominator);
  
  if (den === 0) {
    return defaultValue;
  }
  
  const result = num / den;
  return isNaN(result) ? defaultValue : result;
};

/**
 * Safe multiplication that prevents NaN
 */
export const safeMultiplication = (value1, value2, defaultValue = 0) => {
  const val1 = safeNumber(value1);
  const val2 = safeNumber(value2);
  
  const result = val1 * val2;
  return isNaN(result) ? defaultValue : result;
};

/**
 * Safe toFixed that prevents NaN
 */
export const safeToFixed = (value, decimals = 2, defaultValue = '0.00') => {
  const num = safeNumber(value);
  
  if (isNaN(num)) {
    return defaultValue;
  }
  
  return num.toFixed(decimals);
};

/**
 * Safe percentage calculation
 */
export const safePercentage = (value, total, defaultValue = 0) => {
  const val = safeNumber(value);
  const tot = safeNumber(total);
  
  if (tot === 0) {
    return defaultValue;
  }
  
  const result = (val / tot) * 100;
  return isNaN(result) ? defaultValue : result;
};

/**
 * Format currency safely
 */
export const safeCurrencyFormat = (value, currency = '₹', defaultValue = '0.00') => {
  const num = safeNumber(value);
  
  if (isNaN(num)) {
    return `${currency}${defaultValue}`;
  }
  
  return `${currency}${num.toLocaleString('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

/**
 * Safe weight calculation (kg)
 */
export const safeWeightFormat = (weight, quantity = 1, defaultValue = '0.000') => {
  const result = safeMultiplication(weight, quantity);
  return safeToFixed(result, 3, defaultValue);
};

/**
 * Safe area calculation (m²)
 */
export const safeAreaFormat = (area, quantity = 1, defaultValue = '0.00') => {
  const result = safeMultiplication(area, quantity);
  return safeToFixed(result, 2, defaultValue);
};

/**
 * Safe length conversion (mm to m)
 */
export const safeLengthToMeters = (lengthMm, defaultValue = '0.0') => {
  const result = safeDivision(lengthMm, 1000);
  return safeToFixed(result, 1, defaultValue);
};

export default {
  safeNumber,
  safeDivision,
  safeMultiplication,
  safeToFixed,
  safePercentage,
  safeCurrencyFormat,
  safeWeightFormat,
  safeAreaFormat,
  safeLengthToMeters
};
