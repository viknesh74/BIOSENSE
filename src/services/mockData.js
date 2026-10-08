/**
 * mockData.js — Shared seed/demo data
 * Kept separate to avoid circular imports between cattleService and telemetryService.
 */

export const STATIC_GPS_LOCATIONS = [
  { lat: 11.077809, lng: 77.142879 },
  { lat: 11.077073, lng: 77.142729 },
  { lat: 11.077788, lng: 77.142827 }
];

export const CENTER_LAT = 11.077809;
export const CENTER_LNG = 77.142879;

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
      gps: { lat: 11.077809, lng: 77.142879 },
      lastUpdated: 'Demo'
    },
    history: {
      heartRate: [68, 70, 72, 75, 71, 73, 72],
      temperature: [38.5, 38.6, 38.4, 38.7, 38.6, 38.5, 38.6],
      timeLabels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00']
    },
    vaccinations: [
      {
        id: 'vac-101-1',
        name: 'Foot and Mouth Disease (FMD) Bi-annual Booster',
        diseaseTarget: 'Foot-and-Mouth Disease (FMD)',
        dateAdministered: '2026-06-15',
        nextDueDate: '2026-12-15',
        status: 'Completed',
        dosage: '2 ml (Subcutaneous)',
        batchNo: 'FMD-TN-2026-092',
        administeredBy: 'Dr. Rajesh Kannan, MVSc',
        location: 'Madurai East Government Veterinary Hospital',
        notes: 'Normal post-vaccine vital response. No allergic reaction or swelling observed.'
      },
      {
        id: 'vac-101-2',
        name: 'Black Quarter (BQ) Vaccine',
        diseaseTarget: 'Clostridium chauvoei (Blackleg)',
        dateAdministered: '2026-04-10',
        nextDueDate: '2027-04-10',
        status: 'Completed',
        dosage: '5 ml (Subcutaneous)',
        batchNo: 'BQ-IVRI-2026-44',
        administeredBy: 'Dr. Rajesh Kannan, MVSc',
        location: 'Mobile Veterinary Clinic Unit #3',
        notes: 'Annual booster dose administered prior to monsoon season.'
      },
      {
        id: 'vac-101-3',
        name: 'Haemorrhagic Septicaemia (HS) Vaccine',
        diseaseTarget: 'Pasteurella multocida',
        dateAdministered: '2026-05-02',
        nextDueDate: '2027-05-02',
        status: 'Completed',
        dosage: '5 ml (Subcutaneous)',
        batchNo: 'HS-IND-2026-78',
        administeredBy: 'Dr. Ramesh Kumar, BVSc',
        location: 'Madurai East Government Veterinary Hospital',
        notes: 'Administered under State Livestock Health Scheme.'
      },
      {
        id: 'vac-101-4',
        name: 'Deworming & Anti-Parasitic Protocol',
        diseaseTarget: 'Internal Parasites / Liver Flukes',
        dateAdministered: '2026-08-01',
        nextDueDate: '2026-11-01',
        status: 'Completed',
        dosage: 'Albendazole 3g Bolus orally',
        batchNo: 'ALB-2026-310',
        administeredBy: 'Self / Vet Supervised',
        location: 'Green Valley Organic Farm',
        notes: 'Routine quarterly broad-spectrum deworming.'
      },
      {
        id: 'vac-101-5',
        name: 'Brucellosis Strain 19 Booster',
        diseaseTarget: 'Brucella abortus',
        dateAdministered: '2025-10-20',
        nextDueDate: '2026-10-20',
        status: 'Upcoming',
        dosage: '2 ml (Subcutaneous)',
        batchNo: 'BRUC-TN-2026-12',
        administeredBy: 'Government Veterinary Dispensary',
        location: 'Madurai East Government Veterinary Hospital',
        notes: 'Scheduled for upcoming immunization drive this month.'
      }
    ],
    medicalTreatments: [
      {
        id: 'med-101-1',
        date: '2026-08-20',
        diagnosis: 'Mild Subclinical Mastitis (Right Hind Quarter)',
        severity: 'Moderate',
        treatingDoctor: 'Dr. Rajesh Kannan, MVSc',
        clinic: 'Madurai East Government Veterinary Hospital',
        symptomsObserved: 'Swollen right udder quarter, slight temperature elevation (39.4°C), initial flakes in morning milk sample, milk yield down by 1.8L.',
        prescriptions: [
          { drug: 'Intramammary Cloxacillin Infusion', dosage: '1 tube per teat every 12 hours', duration: '3 Days' },
          { drug: 'Meloxicam Injection (Anti-inflammatory)', dosage: '15 ml Intramuscular', duration: 'Single Dose' },
          { drug: 'Herbal Udder Gel (Turmeric + Aloe Extract)', dosage: 'Apply topically twice daily after complete milk-out', duration: '5 Days' }
        ],
        recoveryStatus: 'Fully Recovered',
        followUpDate: '2026-08-27',
        notes: 'California Mastitis Test (CMT) returned negative on Day 4. Body temperature normalized to 38.6°C. Milk yield recovered back to 14 L/day.'
      },
      {
        id: 'med-101-2',
        date: '2026-03-12',
        diagnosis: 'Digestive Indigestion & Mild Rumen Acidosis',
        severity: 'Mild',
        treatingDoctor: 'Dr. Ramesh Kumar, BVSc',
        clinic: 'Green Valley Farm On-site Visit',
        symptomsObserved: 'Reduced feed intake, sluggish rumination (3.2 hrs/day), slight bloat noted on left flank.',
        prescriptions: [
          { drug: 'Rumen Buffer (Sodium Bicarbonate + Magnesium Oxide)', dosage: '100g oral drench with warm water', duration: '2 Days' },
          { drug: 'Live Yeast Probiotic Bolus (Saccharomyces)', dosage: '2 boluses orally daily', duration: '4 Days' }
        ],
        recoveryStatus: 'Fully Recovered',
        followUpDate: '2026-03-16',
        notes: 'Rumen motility restored to normal 2 contractions/min within 36 hours. Normal cud chewing resumed.'
      }
    ],
    healthMonitoringHistory: [
      {
        id: 'hm-101-1',
        date: '2026-09-30',
        avgHeartRate: 72,
        avgTemp: 38.6,
        healthScore: 95,
        activityLevel: 'Active Grazing (7.4 hrs/day)',
        ruminationMinutes: 510,
        alertIncidentCount: 0,
        vetCheckupSummary: 'Quarterly general health assessment. Body Condition Score (BCS) 3.5/5. Coat shiny, mucous membranes pink, milk test normal.',
        monitoredBy: 'BioSense IoT Smart Collar & Vet Inspection'
      },
      {
        id: 'hm-101-2',
        date: '2026-08-22',
        avgHeartRate: 84,
        avgTemp: 39.4,
        healthScore: 68,
        activityLevel: 'Restricted Activity (4.2 hrs/day)',
        ruminationMinutes: 340,
        alertIncidentCount: 2,
        vetCheckupSummary: 'Telemetry triggered High Temperature Warning (39.4°C). Mastitis detected early and treated promptly with intra-mammary infusion.',
        monitoredBy: 'BioSense Collar Sensor Alert & Dr. Rajesh Kannan'
      },
      {
        id: 'hm-101-3',
        date: '2026-07-15',
        avgHeartRate: 70,
        avgTemp: 38.5,
        healthScore: 92,
        activityLevel: 'Normal Grazing (6.9 hrs/day)',
        ruminationMinutes: 480,
        alertIncidentCount: 0,
        vetCheckupSummary: 'Routine vital review. Excellent weight gain and peak lactation period maintained.',
        monitoredBy: 'BioSense IoT Smart Collar'
      }
    ],
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
      gps: { lat: 11.077073, lng: 77.142729 },
      lastUpdated: 'Demo'
    },
    history: {
      heartRate: [74, 76, 75, 80, 82, 85, 78],
      temperature: [38.9, 39.0, 39.2, 39.4, 39.3, 39.2, 39.1],
      timeLabels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00']
    },
    vaccinations: [
      {
        id: 'vac-102-1',
        name: 'Foot and Mouth Disease (FMD) Vaccine',
        diseaseTarget: 'Foot-and-Mouth Disease (FMD)',
        dateAdministered: '2026-06-15',
        nextDueDate: '2026-12-15',
        status: 'Completed',
        dosage: '2 ml (Subcutaneous)',
        batchNo: 'FMD-TN-2026-092',
        administeredBy: 'Dr. Rajesh Kannan, MVSc',
        location: 'Madurai East Government Veterinary Hospital',
        notes: 'Booster scheduled in December 2026.'
      },
      {
        id: 'vac-102-2',
        name: 'Anthrax Spore Vaccine',
        diseaseTarget: 'Bacillus anthracis',
        dateAdministered: '2026-02-18',
        nextDueDate: '2027-02-18',
        status: 'Completed',
        dosage: '1 ml (Subcutaneous)',
        batchNo: 'ANTH-2026-89',
        administeredBy: 'Dr. Rajesh Kannan, MVSc',
        location: 'Madurai East Government Veterinary Hospital',
        notes: 'Pre-monsoon endemic zone immunization completed.'
      },
      {
        id: 'vac-102-3',
        name: 'Lumpy Skin Disease (LSD) Heterologous Vaccine',
        diseaseTarget: 'Capripoxvirus (LSD)',
        dateAdministered: '2026-05-10',
        nextDueDate: '2027-05-10',
        status: 'Completed',
        dosage: '3 ml (Subcutaneous)',
        batchNo: 'LSD-GOATPOX-2026-19',
        administeredBy: 'Dr. Ramesh Kumar, BVSc',
        location: 'Mobile Veterinary Clinic Unit #3',
        notes: 'Administered as preventative ring vaccination.'
      },
      {
        id: 'vac-102-4',
        name: 'Theileriosis Vaccine (Rakshavac-T)',
        diseaseTarget: 'Theileria annulata (Tick Fever)',
        dateAdministered: '2025-11-10',
        nextDueDate: '2026-11-10',
        status: 'Upcoming',
        dosage: '3 ml (Subcutaneous)',
        batchNo: 'THEIL-2026-05',
        administeredBy: 'Government Veterinary Dispensary',
        location: 'Madurai East Government Veterinary Hospital',
        notes: 'Booster due in November 2026 for crossbred protection.'
      }
    ],
    medicalTreatments: [
      {
        id: 'med-102-1',
        date: '2026-09-14',
        diagnosis: 'Heat Stress & Minor Vital Elevation',
        severity: 'Mild',
        treatingDoctor: 'Dr. Rajesh Kannan, MVSc',
        clinic: 'Tele-consultation / BioSense Alert',
        symptomsObserved: 'Elevated respiratory rate, telemetry heart rate 85 BPM, body temperature 39.4°C during afternoon heat peak.',
        prescriptions: [
          { drug: 'Oral Electrolyte & Vitamin C Solution', dosage: '50g powder dissolved in 10L clean drinking water', duration: '3 Days' },
          { drug: 'Sprinkler Mist & Fan Cooling Protocol', dosage: '30 mins every 2 hours in shade shed', duration: 'Ongoing' }
        ],
        recoveryStatus: 'Under Treatment',
        followUpDate: '2026-10-12',
        notes: 'Currently responding well. Heart rate stabilizing to 78 BPM. Battery warning on collar needs charging.'
      },
      {
        id: 'med-102-2',
        date: '2026-01-25',
        diagnosis: 'Hoof Trimming & Interdigital Foot Rot Treatment',
        severity: 'Moderate',
        treatingDoctor: 'Dr. Ramesh Kumar, BVSc',
        clinic: 'Green Valley Farm On-site Visit',
        symptomsObserved: 'Mild lameness in left hind leg, sensitivity in interdigital cleft.',
        prescriptions: [
          { drug: 'Oxytetracycline Wound Spray (Topical)', dosage: 'Spray twice daily on clean, dry hoof', duration: '5 Days' },
          { drug: 'Copper Sulphate 5% Footbath', dosage: 'Walk-through footbath every alternate day', duration: '1 Week' }
        ],
        recoveryStatus: 'Fully Recovered',
        followUpDate: '2026-02-05',
        notes: 'Normal gait restored in 7 days. Hoof healed cleanly with zero ulceration.'
      }
    ],
    healthMonitoringHistory: [
      {
        id: 'hm-102-1',
        date: '2026-09-25',
        avgHeartRate: 78,
        avgTemp: 39.1,
        healthScore: 78,
        activityLevel: 'Moderate Grazing (5.8 hrs/day)',
        ruminationMinutes: 420,
        alertIncidentCount: 1,
        vetCheckupSummary: 'Collar sensor warned for Low Battery (15%) and slight heat stress temperature (39.1°C). Electrolytes administered.',
        monitoredBy: 'BioSense IoT Smart Collar'
      },
      {
        id: 'hm-102-2',
        date: '2026-08-10',
        avgHeartRate: 74,
        avgTemp: 38.7,
        healthScore: 90,
        activityLevel: 'Active Grazing (6.8 hrs/day)',
        ruminationMinutes: 475,
        alertIncidentCount: 0,
        vetCheckupSummary: 'Monthly physical assessment. Jersey crossbreed vitals stable. Good appetite.',
        monitoredBy: 'BioSense IoT Smart Collar & Vet Examination'
      }
    ],
    status: 'Warning'
  }
];

