# 🐄 BioSense — Smart Livestock Collar & AI-Powered Cattle Health Platform

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-RTDB_%26_Firestore_%26_Auth-FFCA28.svg?logo=firebase)](https://firebase.google.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-Android_%26_iOS-119EFF.svg?logo=capacitor)](https://capacitorjs.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini_Flash-8E75B2.svg?logo=google-gemini)](https://ai.google.dev/)
[![Groq](https://img.shields.io/badge/LLM-Groq_Llama--3.3--70B-F55036.svg)](https://groq.com/)
[![ESP32](https://img.shields.io/badge/IoT-ESP32_Microcontroller-E7352C.svg?logo=espressif)](https://www.espressif.com/)
[![Leaflet](https://img.shields.io/badge/GIS-Leaflet_%26_OpenStreetMap-199900.svg?logo=leaflet)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**BioSense** is a comprehensive, production-grade IoT and AI-driven smart livestock monitoring, biometric telemetry, and veterinary telehealth ecosystem. Built to modernize smallholder dairy farming and commercial cattle operations, BioSense bridges smart wearable IoT collars, cloud databases, AI diagnostic vision/chat models, and cross-platform client interfaces (Web, Android, and iOS).

---

## 📑 Table of Contents

- [🌟 System Overview & Value Proposition](#-system-overview--value-proposition)
- [🏗️ Complete System Architecture](#️-complete-system-architecture)
- [✨ Core Capabilities & Feature Matrix](#-core-capabilities--feature-matrix)
  - [1. Farmer Intelligence & Telemetry](#1-farmer-intelligence--telemetry)
  - [2. Veterinarian Telehealth & EMR Hub](#2-veterinarian-telehealth--emr-hub)
  - [3. CattleCare AI & Multilingual Diagnostics](#3-cattlecare-ai--multilingual-diagnostics)
  - [4. Geospatial Tracking & Geofencing](#4-geospatial-tracking--geofencing)
  - [5. Developer & Testing Simulation Tools](#5-developer--testing-simulation-tools)
- [🔌 Hardware & IoT Firmware Specifications](#-hardware--iot-firmware-specifications)
  - [Pinout & Wiring Diagram](#pinout--wiring-diagram)
  - [Sensor Telemetry Payload Schema](#sensor-telemetry-payload-schema)
  - [Firmware Communication Pipeline](#firmware-communication-pipeline)
- [💻 Software Tech Stack](#-software-tech-stack)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🚀 Quick Start & Installation Guide](#-quick-start--installation-guide)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Launch Development Server](#4-launch-development-server)
  - [5. Run Collar Telemetry Simulator](#5-run-collar-telemetry-simulator)
- [📱 Mobile Build Guide (Capacitor 6)](#-mobile-build-guide-capacitor-6)
- [🔥 Firebase & Cloud Architecture](#-firebase--cloud-architecture)
  - [Realtime Database (RTDB)](#realtime-database-rtdb)
  - [Cloud Firestore & Security Rules](#cloud-firestore--security-rules)
  - [Authentication](#authentication)
- [🌐 Multilingual Localization (5 Languages)](#-multilingual-localization-5-languages)
- [🔧 Troubleshooting & FAQ](#-troubleshooting--faq)
- [📜 License](#-license)

---

## 🌟 System Overview & Value Proposition

Dairy farmers frequently suffer severe economic losses due to **late detection of bovine diseases** (e.g., Mastitis, Lumpy Skin Disease, Bovine Respiratory Disease), **unnoticed heat (estrus) cycles**, and **cattle straying or theft**. In rural regions, qualified veterinary doctors are located miles away.

BioSense addresses these challenges through a unified 4-pillar system:
1. **Wearable IoT Collar**: Non-invasive neck collar capturing heart rate (BPM), blood oxygenation (SpO2), body temperature, ambient humidity, and live GPS coordinates.
2. **Real-time Cloud Sync**: Ultra-low latency telemetry synchronized via Firebase Realtime Database with automatic fallback to offline demo mock data.
3. **CattleCare AI Diagnostic Suite**: Dual-engine intelligence utilizing **Google Gemini** and **Groq (Llama-3.3-70b)** for instantaneous image lesion diagnostics, treatment suggestions (Allopathic & Ayurvedic), and 24/7 conversational advice.
4. **Cross-Platform Portals**: Specialized Farmer and Veterinarian dashboards localized in 5 Indian languages with instant tele-consultation video/chat, e-prescriptions, and insurance scheme discovery.

---

## 🏗️ Complete System Architecture

The following diagram illustrates the end-to-end data flow, state management, UI layers, cloud services, and hardware components:

```mermaid
graph TD
    %% User Actor
    User([👨‍🌾 Farmer or 👨‍⚕️ Veterinarian]) -->|Opens Application| AppRoot[Vite + React 19 AppRoot<br/>index.html / App.jsx]

    %% Shell & Presentation
    subgraph UI_Shell [Client Application Shell]
        AppRoot --> MainLayout[Main Workspace Layout<br/>Sidebar.jsx & Header Nav]
        MainLayout --> RoleSwitch{Role Switcher<br/>activeRole}
    end

    %% State and Data Subgraph
    subgraph StateAndData [State Management & Data Layer]
        AppContext[App Context Provider<br/>AppContext.jsx]
        
        useCattle[Cattle Hook<br/>useCattle.js]
        useTelemetry[Telemetry Hook<br/>useTelemetry.js]
        useAlerts[Alerts Hook<br/>useAlerts.js]
        useConsultations[Consultation Hook<br/>useConsultations.js]

        cattleService[Cattle Service<br/>cattleService.js]
        telemetryService[Telemetry Service<br/>telemetryService.js]
        alertService[Alerts Service<br/>alertService.js]
        consultationService[Consultation Service<br/>consultationService.js]

        AppContext --> useCattle
        AppContext --> useTelemetry
        AppContext --> useAlerts
        AppContext --> useConsultations

        useCattle --> cattleService
        useTelemetry --> telemetryService
        useAlerts --> alertService
        useConsultations --> consultationService

        mockData[(Mock Fallback Data<br/>mockData.js)]
        firebaseClient[(Firebase Client SDK<br/>firebase.js)]

        cattleService --> mockData
        cattleService --> firebaseClient
        telemetryService --> mockData
        telemetryService --> firebaseClient
        alertService --> firebaseClient
        consultationService --> firebaseClient
    end

    %% Farmer Experience
    subgraph FarmerViews [Farmer Workflows & Real-Time Tracking]
        RoleSwitch -->|Role = Farmer| FD[Farmer Dashboard<br/>FarmerDashboard.jsx]
        RoleSwitch -->|Navigation| CD[Cattle Details<br/>CattleDetails.jsx]
        RoleSwitch -->|Navigation| HA[Herd Analytics<br/>HerdAnalytics.jsx]
        RoleSwitch -->|Navigation| TA[Health & Timeline Analysis<br/>HealthAnalytics.jsx]
        RoleSwitch -->|Navigation| GPS[Live GPS Tracking & Geofence<br/>GPSTracking.jsx]
        RoleSwitch -->|Navigation| AL[Alerts Center<br/>Alerts.jsx]
        RoleSwitch -->|Navigation| GS[Government Schemes<br/>GovernmentSchemes.jsx]
        RoleSwitch -->|Navigation| VS[Veterinary Services & Hospitals<br/>VeterinaryServices.jsx]
    end

    %% Doctor Experience
    subgraph DoctorViews [Care Workflows & Telehealth]
        RoleSwitch -->|Role = Doctor| DD[Doctor Dashboard<br/>DoctorDashboard.jsx]
        RoleSwitch -->|Navigation| CONS[Tele-Consultation & Chat<br/>Consultation.jsx]
        RoleSwitch -->|Navigation| MR[Medical Records & EMR<br/>MedicalRecords.jsx]
        RoleSwitch -->|Navigation| REP[Reports & Audits<br/>Reports.jsx]
    end

    %% AI Diagnostic Experience
    subgraph AI_Suite [AI Diagnostic Suite]
        RoleSwitch -->|Navigation| CCAI[CattleCare AI Vision Scanner<br/>CattleCareAI.jsx]
        RoleSwitch -->|Navigation| CB[Veterinary AI Chatbot<br/>Chatbot.jsx]
        CCAI --> GeminiAPI[Google Gemini Flash API]
        CB --> GeminiAPI
        CB -.->|High-Speed Fallback| GroqAPI[Groq Llama-3.3-70B API]
    end

    %% Cloud Infrastructure
    subgraph CloudBackend [Cloud Infrastructure]
        firebaseClient <--> RTDB[(Firebase Realtime Database<br/>/telemetry/{collarId})]
        firebaseClient <--> Firestore[(Cloud Firestore<br/>Cattle, EMR, Consultations)]
        firebaseClient <--> FBAuth[Firebase Authentication]
    end

    %% IoT Smart Collar Hardware
    subgraph SmartCollar [IoT Collar Hardware Node]
        MAX[MAX30102 Sensor<br/>Heart Rate & SpO2] -->|I2C GPIO 21/22| ESP32[ESP32 Microcontroller]
        DHT[DHT11 Sensor<br/>Temp & Humidity] -->|1-Wire GPIO 4| ESP32
        NEO[NEO-6M GPS Module<br/>NMEA Coordinates] -->|UART RX2/TX2| ESP32
        BATT[Voltage Divider<br/>Battery Voltage] -->|ADC GPIO 34| ESP32
        ESP32 -->|WiFi WPA2 + TLS/SSL| RTDB
    end

    %% Cross-Platform Mobile
    subgraph NativeMobile [Cross-Platform Mobile]
        AppRoot -.-> Cap[Capacitor 6 Runtime]
        Cap -.-> AndroidApp[Native Android APK / AAB]
        Cap -.-> iOSApp[Native iOS App Bundle]
    end
```

---

## ✨ Core Capabilities & Feature Matrix

### 1. Farmer Intelligence & Telemetry
- **Biometric Vitals Dashboard**: Instant visual gauge of Heart Rate (40–120 BPM), SpO2 (80–100%), Internal Body Temperature (37–41 °C), Ambient Humidity, and Collar Battery percentage.
- **Individual Cattle Profiles (`CattleDetails.jsx`)**: In-depth individual records containing breed, age, lactation cycle, milking yields, historical vital trendlines, pedigree lineage, and assigned collar ID.
- **Herd Analytics (`HerdAnalytics.jsx`)**: Aggregated herd health indexes, production trends, temperature heatmaps, and estrus cycle notifications.
- **Alert Dispatch Engine (`Alerts.jsx`)**: Real-time triage with severity categorization (Critical, Warning, Normal). Alerts trigger audio chimes and visual banners on high fevers, cardiac anomalies, or geofence escapes.

### 2. Veterinarian Telehealth & EMR Hub
- **Doctor Dashboard (`DoctorDashboard.jsx`)**: Central command center for veterinary officers to monitor assigned farms, incoming consultation tickets, and urgent health escalations.
- **Virtual Consultations (`Consultation.jsx`)**: Live text consultation with image attachments, video conferencing links, and interactive clinical notes.
- **Digital Prescription Generator**: Veterinarians can issue digital prescriptions detailing drug names, dosage frequencies, administration routes (oral/injectable), and withdrawal periods.
- **Electronic Medical Records (`MedicalRecords.jsx`)**: Digital immunization passbook tracking FMD, Anthrax, Black Quarter (BQ), Brucellosis, and deworming schedules.
- **Clinical Audit Reports (`Reports.jsx`)**: Downloadable health certifications and diagnostic summaries for insurance claims and cattle trade.

### 3. CattleCare AI & Multilingual Diagnostics
- **Multimodal Visual Lesion Scanner (`CattleCareAI.jsx`)**:
  - Upload or capture photographs of cattle skin, eyes, hooves, or mouth.
  - Detects clinical signs of **Lumpy Skin Disease (LSD)**, **Mastitis**, **Foot and Mouth Disease (FMD)**, **Ringworm**, and **Bovine Papillomatosis**.
  - Provides diagnostic confidence rating, immediate quarantine protocols, modern veterinary treatments, and traditional Ayurvedic home remedies (e.g., turmeric-neem paste).
- **Veterinary Conversational Copilot (`Chatbot.jsx`)**:
  - Context-aware veterinary assistant answering nutrition, breeding, hygiene, and emergency queries.
  - Powered by **Google Gemini** with automatic fallback to **Groq (Llama-3.3-70B-Versatile)** for zero-downtime reliability.

### 4. Geospatial Tracking & Geofencing
- **Interactive Satellite Mapping (`GPSTracking.jsx`)**: Built with Leaflet and OpenStreetMap displaying live cattle markers with directional headings and status rings.
- **Pasture Boundary Geofencing**: Configurable safe grazing zones. If an animal wanders outside the safe coordinate radius, an instantaneous geofence breach alert is triggered.
- **Historical Breadcrumb Path**: View the daily grazing route and physical movement distance of any animal in the herd.

### 5. Developer & Testing Simulation Tools
- **Integrated Simulation Dock (`SimulationPanel.jsx`)**: Floating development dock enabling manual triggering of high cardiac strain, fever spikes, battery discharge, geofence straying, and live map wandering.
- **Headless Node.js Collar Daemon (`scripts/simulate_collar.js`)**: Emulates hardware collars in the terminal, feeding periodic JSON sensor telemetry directly into Firebase RTDB without requiring physical hardware.

---

## 🔌 Hardware & IoT Firmware Specifications

### Pinout & Wiring Diagram

| Hardware Module | ESP32 DevKit Pin | Communication Protocol | Logic Level | Function |
| :--- | :--- | :--- | :--- | :--- |
| **MAX30102 (SDA)** | `GPIO 21` | I2C Data | 3.3V (Pull-up) | Photoplethysmography (HR / SpO2) |
| **MAX30102 (SCL)** | `GPIO 22` | I2C Clock (400 kHz) | 3.3V (Pull-up) | I2C Bus Synchronization |
| **MAX30102 (VIN / GND)**| `3V3` / `GND` | Power Rail | 3.3V DC | Sensor Power |
| **DHT11 / DHT22 (DATA)**| `GPIO 4` | 1-Wire Single Bus | 3.3V – 5V | Temperature & Ambient Humidity |
| **NEO-6M GPS (TX)** | `GPIO 16 (RX2)` | HardwareSerial2 | 3.3V (9600 Baud) | NMEA GPS Sentence Reception |
| **NEO-6M GPS (RX)** | `GPIO 17 (TX2)` | HardwareSerial2 | 3.3V (9600 Baud) | GPS Configuration Commands |
| **Battery Divider (ADC)** | `GPIO 34 (ADC1_CH6)` | Analog Voltage Divider | 0 – 3.3V Max | Lithium-Ion Cell Voltage (3.0V – 4.2V) |
| **Status LED Indicator** | `GPIO 2` | Digital Output | 3.3V | WiFi / Cloud Connection Status |

### Sensor Telemetry Payload Schema

Collar nodes push telemetry to Firebase Realtime Database at `/telemetry/{COLLAR_ID}` every 5 seconds:

```json
{
  "heartRate": 74,
  "spo2": 97.5,
  "temperature": 38.6,
  "humidity": 68.2,
  "battery": 88,
  "status": "Healthy",
  "lat": 11.077809,
  "lng": 77.142879,
  "timestamp": 1728561840000
}
```

### Firmware Communication Pipeline

1. **Boot & Sensor Init**: ESP32 initializes I2C (`Wire.begin()`), UART2 (`Serial2.begin(9600)`), and DHT sensor.
2. **NTP Clock Synchronization**: Contacts `pool.ntp.org` via SNTP to synchronize timestamp records.
3. **Data Acquisition**: MAX30102 reads IR/Red LED peak pulses; TinyGPS++ parses NMEA sentence latitude/longitude.
4. **TLS/SSL Transmission**: Communicates with Firebase Realtime Database via HTTPS/REST or `Firebase_ESP_Client` library.
5. **Sleep Management**: Enters light sleep between transmission cycles to maximize 18650 Li-ion battery longevity.

---

## 💻 Software Tech Stack

| Domain | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | [React 19](https://react.dev/) | Component architecture & modern hooks |
| **Build Tool** | [Vite 8](https://vitejs.dev/) | Ultra-fast HMR and ESM bundling |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first responsive layout engine |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent iconography suite |
| **Mapping & GIS** | [Leaflet](https://leafletjs.com/) & [React-Leaflet v5](https://react-leaflet.js.org/) | Interactive GPS maps, pasture polygons, markers |
| **Data Charts** | [Recharts 3](https://recharts.org/) | Responsive SVG vital graphs & herd trends |
| **AI Vision & Chat** | [`@google/genai`](https://ai.google.dev/) (Gemini Flash) | Multimodal livestock pathology & symptoms |
| **AI Speed Fallback** | [Groq API](https://groq.com/) (Llama-3.3-70B) | High-speed LLM assistant fallback |
| **Cloud Database** | [Firebase RTDB](https://firebase.google.com/) & [Firestore](https://firebase.google.com/docs/firestore) | Live telemetry streaming & persistence |
| **Mobile Runtime** | [Capacitor 6](https://capacitorjs.com/) | Native Android & iOS wrapper |
| **Linter** | [Oxlint](https://oxc.rs/) | High-speed static analysis |

---

## 📂 Project Directory Structure

```text
collar/
├── capacitor.config.ts          # Capacitor native runtime configuration
├── index.html                   # HTML entry with mobile viewport & safe-area meta
├── package.json                 # Dependency definitions & npm build scripts
├── vite.config.js               # Vite bundler configuration with Tailwind plugin
├── scripts/
│   ├── simulate_collar.js       # Node.js hardware emulator streaming to Firebase RTDB
│   ├── collect_all_keys.cjs     # Translation keys aggregator
│   ├── find_untranslated.cjs    # I18n localization validator
│   └── scan.cjs                 # Codebase string analyzer
├── src/
│   ├── App.jsx                  # Root component, authentication guards & tab router
│   ├── App.css                  # Custom animations & component overrides
│   ├── index.css                # Global Tailwind CSS directives & safe-area utilities
│   ├── main.jsx                 # React root renderer
│   │
│   ├── components/              # Shared UI components
│   │   ├── Chatbot.jsx          # Dual-engine (Gemini + Groq) AI veterinary assistant
│   │   ├── LanguageDropdown.jsx # 5-language selector dropdown
│   │   ├── Logo.jsx             # BioSense branding logo
│   │   ├── Sidebar.jsx          # Responsive collapsible navigation bar
│   │   └── SimulationPanel.jsx  # In-browser developer telemetry override dock
│   │
│   ├── context/                 # Centralized state management
│   │   ├── AppContext.jsx       # Global application context provider
│   │   └── hindiDictionary.json # Extended fallback dictionary
│   │
│   ├── hooks/                   # Custom business logic hooks
│   │   ├── useAlerts.js         # Real-time alert subscription & audio triggers
│   │   ├── useCattle.js         # Cattle CRUD operations & Firestore sync
│   │   ├── useConsultations.js  # Telehealth chat, video & prescription state
│   │   └── useTelemetry.js      # Live IoT collar subscriber with simulation fallback
│   │
│   ├── pages/                   # Application route views
│   │   ├── Home.jsx             # Public landing page & role selector
│   │   ├── FarmerDashboard.jsx  # Main farmer hub with herd summary & vitals
│   │   ├── CattleDetails.jsx    # Individual cow deep-dive & telemetry history
│   │   ├── DoctorDashboard.jsx  # Veterinary triage & patient cattle queue
│   │   ├── Consultation.jsx     # Live tele-consultation chat & e-prescription desk
│   │   ├── CattleCareAI.jsx     # Multimodal image diagnostic scanner
│   │   ├── GPSTracking.jsx      # Satellite GPS geofencing & live map
│   │   ├── HerdAnalytics.jsx    # Fleet-wide statistics & milk production logs
│   │   ├── HealthAnalytics.jsx  # In-depth vital trend analysis & timeline charts
│   │   ├── MedicalRecords.jsx   # Vaccination, deworming & treatment passbook
│   │   ├── GovernmentSchemes.jsx# Subsidies, insurance policies & application guides
│   │   ├── VeterinaryServices.jsx# Hospital locator, clinics & ambulance directory
│   │   ├── Alerts.jsx           # Filterable alert log & notification settings
│   │   ├── Reports.jsx          # Diagnostic export & medical certification sheets
│   │   ├── Profile.jsx          # Farmer / Veterinarian profile settings
│   │   └── Settings.jsx         # App preferences, dark mode & network configuration
│   │
│   ├── services/                # Backend API adapters
│   │   ├── alertService.js      # Alert dispatch, storage & clearing
│   │   ├── cattleService.js     # Cattle profile fetch & update adapter
│   │   ├── consultationService.js# Consultation room & prescription service
│   │   ├── firebase.js          # Firebase SDK initialization (Auth, RTDB, Firestore)
│   │   ├── mockData.js          # Resilient fallback demo data for offline execution
│   │   └── telemetryService.js  # Realtime RTDB listener & payload normalizer
│   │
│   └── translations/            # Localization dictionary files
│       ├── index.js             # Translation exports & supported language registry
│       ├── en.json              # English dictionary
│       ├── ta.json              # Tamil (தமிழ்)
│       ├── hi.json              # Hindi (हिन्दी)
│       ├── ml.json              # Malayalam (മലയാളം)
│       └── kn.json              # Kannada (ಕನ್ನಡ)
```

---

## 🚀 Quick Start & Installation Guide

### Prerequisites
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm** (comes with Node) or **pnpm** / **yarn**
- Modern web browser (Chrome, Edge, Firefox, Safari)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/biosense-collar.git
cd biosense-collar/collar/collar
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:

```env
# AI Services
VITE_GEMINI_API_KEY=your_google_gemini_api_key
VITE_GROQ_API_KEY=your_groq_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.asia-southeast1.firebasedatabase.app
```

> [!TIP]
> **No API keys yet?** No problem! BioSense includes full offline resilience with built-in mock telemetry and demo datasets in `src/services/mockData.js`. You can explore the entire UI immediately.

### 4. Launch Development Server
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:5173`

### 5. Run Collar Telemetry Simulator
To test live sensor streams without an ESP32 hardware node:
```bash
node scripts/simulate_collar.js
```
This script pushes randomized biometrics and walking GPS coordinates to your Firebase Realtime Database every few seconds.

---

## 📱 Mobile Build Guide (Capacitor 6)

BioSense is built with mobile-first responsiveness, featuring safe-area notch padding (`pt-safe`) and tactile touch interactions.

### Build and Synchronize Native Assets
```bash
# 1. Build the production web bundle and sync to native platforms
npm run cap:sync
```

### Run on Android
```bash
# Opens the project in Android Studio
npm run cap:android
```
1. Open the project in Android Studio.
2. Select your connected Android phone or an emulator.
3. Click **Run** (`Shift + F10`) to build the APK.

### Run on iOS (macOS required)
```bash
# Opens the project in Xcode
npm run cap:ios
```
1. Ensure CocoaPods is installed (`sudo gem install cocoapods`).
2. Open the workspace in Xcode.
3. Select your iOS simulator or development iPhone and click **Run**.

---

## 🔥 Firebase & Cloud Architecture

### Realtime Database (RTDB)
IoT collars stream real-time data to `/telemetry/{collarId}`. Configure the following rules in the Firebase Console:

```json
{
  "rules": {
    "telemetry": {
      ".read": true,
      ".write": true
    }
  }
}
```

### Cloud Firestore & Security Rules
Cattle profiles, vaccinations, consultation chat logs, and prescription slips are stored in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cattle/{cattleId} {
      allow read, write: if true;
    }
    match /consultations/{consultationId} {
      allow read, write: if true;
    }
    match /alerts/{alertId} {
      allow read, write: if true;
    }
    match /prescriptions/{prescriptionId} {
      allow read, write: if true;
    }
  }
}
```

### Authentication
Enable **Anonymous** authentication under **Firebase Console &rarr; Authentication &rarr; Sign-in method** for seamless guest and collar access, as well as **Email/Password** for veterinarian logins.

---

## 🌐 Multilingual Localization (5 Languages)

BioSense is engineered for rural farmers across India, offering instant switching across 5 languages:

| Language | Native Name | Code | Dictionary Location |
| :--- | :--- | :---: | :--- |
| **English** | English | `en` | Fallback / Base |
| **Tamil** | தமிழ் | `ta` | `src/translations/ta.json` |
| **Hindi** | हिन्दी | `hi` | `src/translations/hi.json` |
| **Malayalam**| മലയാളം | `ml` | `src/translations/ml.json` |
| **Kannada** | ಕನ್ನಡ | `kn` | `src/translations/kn.json` |

The `t(key, ...fallbacks)` function in `AppContext.jsx` automatically caches user preference in `localStorage` (`biosense_lang`), ensuring a persistent localized experience.

---

## 🔧 Troubleshooting & FAQ

| Problem | Potential Root Cause | Solution |
| :--- | :--- | :--- |
| **Leaflet map renders gray tiles or distorted pins** | Missing Leaflet CSS stylesheets | Ensure `leaflet/dist/leaflet.css` is imported in `main.jsx` and the map container has an explicit height (`h-96` or `h-full`). |
| **ESP32 reports `SSL internals timed out!`** | Clock drift preventing TLS validation | In Arduino IDE, call `configTime(0, 0, "pool.ntp.org")` inside `setup()` and ensure your WiFi router allows UDP port 123. |
| **Firebase Auth Error: Token info rejected** | Anonymous provider disabled | Navigate to **Firebase Console &rarr; Auth &rarr; Sign-in method** and turn on **Anonymous** authentication. |
| **Gemini AI reports `ResourceExhausted (429)`** | Gemini free quota exceeded | Add a Groq API key (`VITE_GROQ_API_KEY`) in `.env`. The chatbot will automatically fall back to ultra-fast Groq Llama-3.3-70B. |
| **Collar coordinates not updating on map** | No GPS satellite fix | NEO-6M requires a clear line of sight to the sky. Move near an open window until the onboard red LED begins blinking (1 PPS pulse). |
| **Mobile top header overlaps status bar notch** | Missing safe area styling | Verify the top header has the `pt-safe` class and `viewport-fit=cover` is declared in `index.html`. |

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for complete details.

---

<p align="center">
  <b>🐄 BioSense — Transforming Dairy Farming Through Smart Telemetry & AI</b><br/>
  <i>Engineered for health, productivity, and sustainable livestock management.</i>
</p>
