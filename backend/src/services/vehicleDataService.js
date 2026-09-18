const axios = require('axios');
const logger = require('../config/logger');

class VehicleDataService {
  constructor() {
    this.provider = process.env.VEHICLE_API_PROVIDER || 'mock';
    this.apiUrl = process.env.VEHICLE_API_URL;
    this.apiKey = process.env.VEHICLE_API_KEY;
  }

  async getVehicleData(vin) {
    try {
      if (this.provider === 'mock') {
        return this.getMockVehicleData(vin);
      }
      
      // Add real API integrations here
      // Example for NHTSA (free, but limited data)
      return await this.getNHTSAData(vin);
      
    } catch (error) {
      logger.error('Vehicle data service error:', error);
      throw new Error('Unable to retrieve vehicle data');
    }
  }

  async getNHTSAData(vin) {
    try {
      const response = await axios.get(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`
      );

      const data = response.data.Results[0];

      if (data.ErrorCode !== '0') {
        throw new Error('Vehicle not found');
      }

      return {
        vin: vin,
        year: parseInt(data.ModelYear) || null,
        make: data.Make || 'Unknown',
        model: data.Model || 'Unknown',
        trim: data.Trim || null,
        bodyStyle: data.BodyClass || null,
        vehicleType: data.VehicleType || null,
        engine: `${data.EngineModel || ''} ${data.EngineCylinders || ''} ${data.FuelTypePrimary || ''}`.trim() || null,
        transmission: data.TransmissionStyle || null,
        fuelType: data.FuelTypePrimary || null,
        drivetrain: data.DriveType || null,
        countryOfManufacture: data.PlantCountry || null,
        manufacturerName: data.Manufacturer || null,
        plantCity: data.PlantCity || null,
        specifications: {
          doors: data.Doors,
          engineDisplacement: data.DisplacementL,
          cylinders: data.EngineCylinders,
          seats: data.Seats,
          gvwr: data.GVWR,
          plantInfo: data.PlantCompanyName,
          series: data.Series,
          abs: data.ABS,
          tpms: data.TPMS,
          airBagLocations: data.AirBagLocCurtain
        }
      };
    } catch (error) {
      logger.error('NHTSA API error:', error);
      throw error;
    }
  }

  getMockVehicleData(vin) {
    // Mock data for development - CLEARLY MARKED
    logger.warn('Using MOCK vehicle data - not for production');
    
    const year = parseInt(vin.substring(9, 10)) + 2000;
    const mockMakes = ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'BMW'];
    const mockModels = {
      'Honda': ['Civic', 'Accord', 'CR-V'],
      'Toyota': ['Camry', 'Corolla', 'RAV4'],
      'Ford': ['F-150', 'Mustang', 'Explorer'],
      'Chevrolet': ['Silverado', 'Malibu', 'Equinox'],
      'BMW': ['3 Series', '5 Series', 'X5']
    };

    const make = mockMakes[Math.floor(Math.random() * mockMakes.length)];
    const model = mockModels[make][Math.floor(Math.random() * mockModels[make].length)];

    return {
      vin: vin,
      year: year,
      make: make,
      model: model,
      trim: 'EX',
      bodyStyle: 'Sedan',
      vehicleType: 'Passenger Car',
      engine: '2.4L I4',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      drivetrain: 'FWD',
      countryOfManufacture: 'USA',
      manufacturerName: make,
      plantCity: 'Detroit',
      specifications: {
        doors: 4,
        engineDisplacement: '2.4',
        cylinders: 4,
        seats: 5,
        abs: 'Standard',
        tpms: 'Direct'
      },
      _isMockData: true // Flag for development
    };
  }

  async getVehicleHistory(vin) {
    // This would integrate with commercial vehicle history APIs
    // For now, return structured mock data
    
    logger.warn('Using MOCK vehicle history data - not for production');

    return {
      accidentRecords: [],
      mileageHistory: [
        { date: '2023-06-15', mileage: 45000, source: 'Service Record' },
        { date: '2022-12-10', mileage: 38000, source: 'State Inspection' },
        { date: '2022-06-05', mileage: 31000, source: 'Service Record' }
      ],
      titleHistory: [
        {
          date: '2021-03-15',
          event: 'Original Title',
          state: 'CA',
          titleBrand: 'Clean'
        }
      ],
      ownershipHistory: {
        numberOfOwners: 2,
        records: [
          { startDate: '2021-03-15', endDate: '2023-01-10', state: 'CA', type: 'Personal' },
          { startDate: '2023-01-10', state: 'CA', type: 'Personal' }
        ]
      },
      serviceHistory: [
        { date: '2023-06-15', mileage: 45000, type: 'Oil Change', location: 'Quick Lube' },
        { date: '2023-03-10', mileage: 42000, type: 'Tire Rotation', location: 'Tire Center' }
      ],
      recalls: [],
      theftRecords: [],
      _isMockData: true
    };
  }
}

module.exports = new VehicleDataService();
