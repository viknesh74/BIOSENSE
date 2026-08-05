/**
 * mockData.js — Shared seed/demo data
 * Kept separate to avoid circular imports between cattleService and telemetryService.
 */

export const CENTER_LAT = 9.9252;
export const CENTER_LNG = 78.1198;

export const MOCK_CATTLE = [
  {
    id: '101',
    name: 'Meenu',
    breed: 'Gir (Desi)',
    age: '4 Years',
    gender: 'Female',
    farmerId: 'farmer-uma',
    photo: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500&auto=format&fit=crop&q=80',
    telemetry: {
      heartRate: 72,
      temperature: 38.6,
      battery: 88,
      gps: { lat: CENTER_LAT + 0.0003, lng: CENTER_LNG + 0.0002 },
      lastUpdated: 'Demo'
    },
    history: {
      heartRate: [68, 70, 72, 75, 71, 73, 72],
      temperature: [38.5, 38.6, 38.4, 38.7, 38.6, 38.5, 38.6],
      timeLabels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00']
    },
    status: 'Healthy'
  },
  {
    id: '102',
    name: 'Ganga',
    breed: 'Jersey',
    age: '3.5 Years',
    gender: 'Female',
    farmerId: 'farmer-uma',
    photo: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=500&auto=format&fit=crop&q=80',
    telemetry: {
      heartRate: 78,
      temperature: 39.1,
      battery: 15,
      gps: { lat: CENTER_LAT - 0.0002, lng: CENTER_LNG + 0.0005 },
      lastUpdated: 'Demo'
    },
    history: {
      heartRate: [74, 76, 75, 80, 82, 85, 78],
      temperature: [38.9, 39.0, 39.2, 39.4, 39.3, 39.2, 39.1],
      timeLabels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00']
    },
    status: 'Warning'
  }
];
