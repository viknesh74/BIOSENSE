import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

// Read .env file manually so we don't need to install dotenv
let envFile;
try {
  envFile = fs.readFileSync(envPath, 'utf-8');
} catch (e) {
  console.error(`❌ Configuration not found: Could not read .env file at ${envPath}`);
  process.exit(1);
}
const dbUrlMatch = envFile.match(/VITE_FIREBASE_DATABASE_URL=[\'"]?(https?:\/\/[^\'"]+)[\'"]?/);
const projectIdMatch = envFile.match(/VITE_FIREBASE_PROJECT_ID=[\'"]?([^\'"\r\n]+)[\'"]?/);

if (!dbUrlMatch || !projectIdMatch) {
  console.error("❌ Could not find VITE_FIREBASE_DATABASE_URL or VITE_FIREBASE_PROJECT_ID in .env");
  process.exit(1);
}

const dbUrl = dbUrlMatch[1].replace(/\/$/, ""); // Remove trailing slash
const projectId = projectIdMatch[1];
console.log(`✅ Using Database URL: ${dbUrl}`);

const STATIC_LOCATIONS = [
  { lat: 11.077809, lng: 77.142879 },
  { lat: 11.077073, lng: 77.142729 },
  { lat: 11.077788, lng: 77.142827 }
];

const CENTER_LAT = 11.077809;
const CENTER_LNG = 77.142879;

let locationIndex = 0;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// Fetch all cattle IDs from Firestore
async function getCattleIds() {
  try {
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/cattle`;
    const res = await fetch(firestoreUrl);
    if (!res.ok) {
      console.log("⚠️ Could not fetch from Firestore (maybe rules restricted). Falling back to mock IDs.");
      return ['101', '102'];
    }
    const data = await res.json();
    if (!data.documents) return ['101', '102'];

    // Extract the ID from the end of the document name string
    return data.documents.map(doc => {
      const parts = doc.name.split('/');
      return parts[parts.length - 1];
    });
  } catch (e) {
    return ['101', '102'];
  }
}

async function updateTelemetry() {
  const MOCK_CATTLE_IDS = await getCattleIds();

  MOCK_CATTLE_IDS.forEach(async (id, idx) => {
    const isEmergency = Math.random() > 0.90; // 10% chance to spike vitals
    const targetGps = STATIC_LOCATIONS[(locationIndex + idx) % STATIC_LOCATIONS.length];

    const data = {
      heartRate: isEmergency ? Math.floor(getRandomArbitrary(100, 120)) : Math.floor(getRandomArbitrary(65, 85)),
      temperature: isEmergency ? parseFloat(getRandomArbitrary(39.5, 41.0).toFixed(1)) : parseFloat(getRandomArbitrary(38.0, 39.1).toFixed(1)),
      battery: Math.floor(getRandomArbitrary(20, 100)),
      gps: {
        lat: targetGps.lat,
        lng: targetGps.lng
      },
      timestamp: Date.now()
    };

    try {
      // Using Firebase Realtime Database REST API to push data
      const response = await fetch(`${dbUrl}/telemetry/${id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log(`📡 Pushed data for Collar ${id}: HR=${data.heartRate} Temp=${data.temperature}`);
      } else {
        console.error(`⚠️ Failed to push for ${id}:`, await response.text());
      }
    } catch (e) {
      console.error(`⚠️ Error updating Collar ${id}:`, e.message);
    }
  });
  locationIndex = (locationIndex + 1) % STATIC_LOCATIONS.length;
}

// Run every 5 seconds
console.log("🚀 Starting Dynamic Collar Simulation... Press Ctrl+C to stop.");
updateTelemetry();
setInterval(updateTelemetry, 5000);
