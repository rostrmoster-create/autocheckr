const validateVIN = (vin) => {
  if (!vin || typeof vin !== 'string') {
    return { isValid: false, error: 'VIN is required' };
  }

  // Convert to uppercase and remove spaces
  const cleanVIN = vin.toUpperCase().replace(/\s/g, '');

  // Check length
  if (cleanVIN.length !== 17) {
    return { isValid: false, error: 'VIN must be exactly 17 characters' };
  }

  // Check for invalid characters (I, O, Q are not used in VINs)
  if (/[IOQ]/.test(cleanVIN)) {
    return { isValid: false, error: 'VIN contains invalid characters (I, O, Q)' };
  }

  // Check for valid characters (alphanumeric excluding I, O, Q)
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(cleanVIN)) {
    return { isValid: false, error: 'VIN contains invalid characters' };
  }

  // VIN check digit validation (simplified)
  // In production, implement full check digit algorithm
  const isValidCheckDigit = validateVINCheckDigit(cleanVIN);
  if (!isValidCheckDigit) {
    return { isValid: false, error: 'Invalid VIN check digit' };
  }

  return { isValid: true, vin: cleanVIN };
};

const validateVINCheckDigit = (vin) => {
  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  const transliteration = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9
  };

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin[i];
    const value = isNaN(char) ? transliteration[char] : parseInt(char);
    sum += value * weights[i];
  }

  const checkDigit = sum % 11;
  const ninthChar = vin[8];
  const expectedCheckDigit = checkDigit === 10 ? 'X' : checkDigit.toString();

  return ninthChar === expectedCheckDigit;
};

module.exports = { validateVIN };
