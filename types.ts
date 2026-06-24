// Types for Aswanna Smart Agriculture Platform

export enum AgroEcologicalZone {
  WET_ZONE = "Wet Zone (e.g., Colombo, Kandy, Galle)",
  INTERMEDIATE_ZONE = "Intermediate Zone (e.g., Kurunegala, Badulla)",
  DRY_ZONE = "Dry Zone (e.g., Anuradhapura, Polonnaruwa, Jaffna)"
}

export enum SoilType {
  RED_REDDISH_BROWN = "Red Reddish Brown Earths",
  NON_CALCIC_BROWN = "Non-Calcic Brown Soils",
  SANDS_REGOSOLS = "Sandy Regosols & Latosols",
  ALLUVIAL = "Alluvial Bed Soils",
  RED_YELLOW_PODZOLIC = "Red Yellow Podzolic Soils"
}

export interface FarmPlot {
  id: string;
  name: string;
  sizeAcres: number;
  zone: AgroEcologicalZone;
  soilType: SoilType;
  ph: number;
  nitrogen: string;     // Low, Medium, High
  phosphorus: string;   // Low, Medium, High
  potassium: string;    // Low, Medium, High
  waterSource: string;  // Rainfed, Irrigation Tank (Wewa), Deep Well, River Pump
  currentCrop?: string;
  plantingDate?: string;
}

export interface RecommendedCrop {
  name: string;
  scientificName: string;
  suitabilityScore: number;
  estYield: string;
  durationDays: number;
  waterRequirement: "High" | "Medium" | "Low";
  marketDemand: "High" | "Medium" | "Stable";
  avgSellingPrice: string;
  reasons: string[];
  plantingTips: string[];
  fertilizerSplit: string;
}

export interface DiagnosisReport {
  diagnosis: string;
  probability: number;
  severity: "Low" | "Moderate" | "Severe";
  symptomsConfirmed: string[];
  cause: string;
  treatmentOrganic: string[];
  treatmentChemical: string[];
  preventativeMeasures: string[];
  urgencyScale: string;
  cropName?: string;
  date?: string;
  imageUrl?: string;
}

export interface SoilReport {
  soilHealthIndex: number;
  phDiagnostic: string;
  macronutrientStatus: {
    nitrogen: string;
    phosphorus: string;
    potassium: string;
  };
  deficiencies: string[];
  soilCarbonRebuildingStrategy: string[];
  pHCorrectionAction: string;
  compostingSchedule: string[];
  recommendedCoverCrops: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  dummyField?: string;
  dummyField2?: string;
}

export interface WeatherCondition {
  temp: number;
  condition: string;
  humidity: number;
  rainfallProbability: number;
  advisory: string;
}

export interface AnimalRegistryEntry {
  id: string;
  name: string;
  species: "Dairy Cattle" | "Beef Cattle" | "Goat" | "Poultry" | "Pig" | "Buffalo" | "Sheep";
  breed: string;
  ageMonths: number;
  weightKg: number;
  lastVaccinatedDate?: string;
  isPregnant?: boolean;
  expectedCalvingDate?: string;
  milkProductionHistory?: { date: string; liters: number; fatPct?: number }[];
  healthStatus: "Excellent" | "Fair" | "Under Medical Treatment" | "Quarantined";
}
