import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Plus, 
  Trash2, 
  Activity, 
  Calendar, 
  FileSpreadsheet, 
  Sparkles, 
  AlertCircle, 
  Milk, 
  Bone, 
  ShieldAlert, 
  TrendingUp,
  Award,
  ChevronRight,
  Info
} from "lucide-react";
import { AnimalRegistryEntry } from "./types";
import { Language } from "../translations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";

interface HusbandryHubProps {
  lang: Language;
}

const DEFAULT_LIVESTOCK: AnimalRegistryEntry[] = [
  {
    id: "ani-1",
    name: "Kalyani",
    species: "Dairy Cattle",
    breed: "Sahiwal Twin Cross",
    ageMonths: 34,
    weightKg: 420,
    lastVaccinatedDate: "2026-03-12",
    isPregnant: true,
    expectedCalvingDate: "2026-09-18",
    healthStatus: "Excellent",
    milkProductionHistory: [
      { date: "06-18", liters: 12.4 },
      { date: "06-19", liters: 13.1 },
      { date: "06-20", liters: 12.8 },
      { date: "06-21", liters: 14.2 },
      { date: "06-22", liters: 13.9 }
    ]
  },
  {
    id: "ani-2",
    name: "Siri-Mali",
    species: "Dairy Cattle",
    breed: "Jersey Purebred",
    ageMonths: 28,
    weightKg: 380,
    lastVaccinatedDate: "2026-02-28",
    isPregnant: false,
    healthStatus: "Fair",
    milkProductionHistory: [
      { date: "06-18", liters: 9.5 },
      { date: "06-19", liters: 10.2 },
      { date: "06-20", liters: 9.8 },
      { date: "06-21", liters: 10.5 },
      { date: "06-22", liters: 10.1 }
    ]
  },
  {
    id: "ani-3",
    name: "Chandra",
    species: "Goat",
    breed: "Jamnapari Milker",
    ageMonths: 18,
    weightKg: 45,
    lastVaccinatedDate: "2026-05-10",
    isPregnant: true,
    expectedCalvingDate: "2026-08-05",
    healthStatus: "Excellent",
    milkProductionHistory: [
      { date: "06-20", liters: 2.1 },
      { date: "06-21", liters: 2.3 },
      { date: "06-22", liters: 2.2 }
    ]
  },
  {
    id: "ani-4",
    name: "Lot B Layer",
    species: "Poultry",
    breed: "Rhode Island Red flock (50)",
    ageMonths: 8,
    weightKg: 110,
    lastVaccinatedDate: "2026-04-15",
    isPregnant: false,
    healthStatus: "Excellent"
  }
];

export default function HusbandryHub({ lang }: HusbandryHubProps) {
  const [animals, setAnimals] = useState<AnimalRegistryEntry[]>(() => {
    const saved = localStorage.getItem("aswanna_livestock");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_LIVESTOCK;
  });

  const [activeAnimalId, setActiveAnimalId] = useState<string>("ani-1");
  const [activeSubTab, setActiveSubTab] = useState<"registry" | "breeding" | "milk" | "feed" | "health">("registry");

  const [showRegForm, setShowRegForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSpecies, setNewSpecies] = useState<"Dairy Cattle" | "Goat" | "Poultry">("Dairy Cattle");
  const [newBreed, setNewBreed] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [newIsPregnant, setNewIsPregnant] = useState(false);
  const [newGestationDays, setNewGestationDays] = useState("");

  const [mateDate, setMateDate] = useState("");
  const [matingBreed, setMatingBreed] = useState("");
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0]);
  const [logLiters, setLogLiters] = useState("");

  const activeAnimal = animals.find(a => a.id === activeAnimalId);

  const aggregateMilkToday = animals.reduce((sum, item) => {
    if (item.milkProductionHistory && item.milkProductionHistory.length > 0) {
      const latest = item.milkProductionHistory[item.milkProductionHistory.length - 1];
      return sum + Number(latest.liters);
    }
    return sum;
  }, 0);

  const aggregateExpectingMoms = animals.filter(a => a.isPregnant).length;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newBreed.trim() || !newAge || !newWeight) return;

    const newAnimal: AnimalRegistryEntry = {
      id: `ani-${Date.now()}`,
      name: newName,
      species: newSpecies,
      breed: newBreed,
      ageMonths: Number(newAge),
      weightKg: Number(newWeight),
      isPregnant: newIsPregnant,
      expectedCalvingDate: newIsPregnant ? (() => {
        const days = newSpecies === "Goat" ? 150 : 283;
        const d = new Date();
        d.setDate(d.getDate() + (days - Number(newGestationDays || 0)));
        return d.toISOString().split("T")[0];
      })() : undefined,
      lastVaccinatedDate: new Date().toISOString().split("T")[0],
      healthStatus: "Excellent",
      milkProductionHistory: []
    };

    const updated = [newAnimal, ...animals];
    setAnimals(updated);
    localStorage.setItem("aswanna_livestock", JSON.stringify(updated));
    setActiveAnimalId(newAnimal.id);

    setNewName("");
    setNewBreed("");
    setNewAge("");
    setNewWeight("");
    setNewIsPregnant(false);
    setNewGestationDays("");
    setShowRegForm(false);
  };

  const handleDeleteAnimal = (id: string) => {
    const updated = animals.filter(a => a.id !== id);
    setAnimals(updated);
    localStorage.setItem("aswanna_livestock", JSON.stringify(updated));
    if (activeAnimalId === id && updated.length > 0) {
      setActiveAnimalId(updated[0].id);
    }
  };

  const handleAddMilkRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAnimal || !logLiters || !logDate) return;

    const parts = logDate.split("-");
    const labelDate = parts.length >= 3 ? `${parts[1]}-${parts[2]}` : logDate;

    const newRecord = {
      date: labelDate,
      liters: Number(logLiters)
    };

    const updated = animals.map(a => {
      if (a.id === activeAnimal.id) {
        return {
          ...a,
          milkProductionHistory: [...(a.milkProductionHistory || []), newRecord]
        };
      }
      return a;
    });

    setAnimals(updated);
    localStorage.setItem("aswanna_livestock", JSON.stringify(updated));
    setLogLiters("");
  };

  const handleLogMating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAnimal || !mateDate || !matingBreed) return;

    const days = activeAnimal.species === "Goat" ? 150 : 283;
    const expectedDate = new Date(mateDate);
    expectedDate.setDate(expectedDate.getDate() + days);

    const updated = animals.map(a => {
      if (a.id === activeAnimal.id) {
        return {
          ...a,
          isPregnant: true,
          expectedCalvingDate: expectedDate.toISOString().split("T")[0]
        };
      }
      return a;
    });

    setAnimals(updated);
    localStorage.setItem("aswanna_livestock", JSON.stringify(updated));
    setMateDate("");
    setMatingBreed("");
  };

  const calculateFeeds = (animal?: AnimalRegistryEntry) => {
    if (!animal) return { dryMatter: "0 Kg", green: "0 Kg", concentrate: "0 Kg" };
    let dmVal = 0;
    let greenVal = 0;
    let concVal = 0;

    if (animal.species === "Dairy Cattle" || animal.species === "Beef Cattle" || animal.species === "Buffalo") {
      dmVal = animal.weightKg * 0.03;
      greenVal = (dmVal * 0.75) / 0.20;
      concVal = dmVal * 0.25;
    } else if (animal.species === "Goat" || animal.species === "Sheep") {
      dmVal = animal.weightKg * 0.04;
      greenVal = (dmVal * 0.80) / 0.20;
      concVal = dmVal * 0.20;
    } else {
      dmVal = 0.11;
      greenVal = 0.02;
      concVal = 0.09;
    }

    return {
      dryMatter: `${dmVal.toFixed(1)} Kg`,
      green: `${greenVal.toFixed(1)} Kg`,
      concentrate: `${concVal.toFixed(1)} Kg`
    };
  };

  // Multi-lingual translation triggers
  const dictionary = {
    en: {
      title: "Livestock & Dairy Husbandry Hub",
      subtitle: "Full-spectrum digital management for dairy cattle, poultry flocks, goats, and breeding cycles.",
      btnRegister: "Register New Animal",
      btnDelete: "Remove Record",
      healthLabel: "Clinical Health Status",
      pregnancyLabel: "Gestation & Breeding Status",
      vaccineLabel: "Vaccinations and Inoculations",
      nutritionLabel: "Agro-Nutrition Optimizer",
      milkTitle: "Daily Yield Records & Liters Tracker",
      breedingTitle: "Artificial Insemination & Calving Timeline",
      breed: "Breed",
      age: "Age (Months)",
      weight: "Weight (Kg)",
      totalAnimals: "Registered Heads",
      overallYield: "Aggregate Daily Yield",
      pregnantCount: "Expecting Mothers",
      // Newly translated additions
      regPageTitle: "Add Animal Registration Page",
      cancel: "Cancel",
      tagLabel: "Tag / Animal Name",
      speciesLabel: "Species Category",
      breedLabel: "Breed / Lineage",
      ageLabel: "Age (Months)",
      weightLabel: "Weight (Kg)",
      isPregnantLabel: "Is Pregnant / Expecting?",
      gestationLabel: "Gestation Days Remaining (approx)",
      confirmRegBtn: "Confirm Digital Registration",
      headsUnit: "Heads",
      litersUnit: "Liters/day",
      pregnantUnit: "Pregnant",
      deptAdvisory: "Department Advisory",
      vetCenter: "Goap / Veterinary Center",
      directoryTitle: "Head Registry Directory",
      emptyRegistry: "No livestock added yet. Tap Register above to begin!",
      tabProfile: "Profile",
      tabMilk: "Milk Yields",
      tabBreeding: "Gestation / AI",
      tabNutrition: "Nutrition Feed",
      tabDiagnosis: "Diagnosis Scan",
      registeredPassport: "Registered Passport",
      idLabel: "ID",
      notPregnantDesc: "Not pregnant • Mating cycles can be scheduled",
      vaccineAlertTitle: "State Vaccination & Prophylaxis passport schedules",
      vaccineSub: "Sri Lankan Department of Animal Production & Health (DAPH) targets high risk vectors:",
      vaccineFMD: "Foot and Mouth Disease (FMD): Bi-annual injection (October / March).",
      vaccineDone: "Recommended Done",
      vaccineHS: "Haemorrhagic Septicaemia (HS): Scheduled for all ruminants above 6 months of age.",
      vaccineRanikhet: "Infectious Bronchitis & Ranikhet: (Poultry vaccine series drops at days 7, 21, and 45).",
      trackLactation: "Track and predict lactation cycles to isolate high-performing cattle grades.",
      noMilkHistory: "No milk history logged yet.",
      dateLabel: "Date",
      producedLiters: "Produced Milk (Liters)",
      logYieldBtn: "Log Yield",
      breedingDesc: "Calculate remaining gestation days and expected birth timelines for cross-bred calves.",
      standardsTitle: "Sri Lankan Gestation Standards:",
      standardsDesc: "Dairy cows exhibit a gestation period of roughly 283 days. Dairy goats (such as Jamnapari milker crosses) expect kids within 150 days of successful mating or artificial insemination.",
      recordMatingTitle: "Record Mating or Artificial Insemination (AI)",
      matingDateLabel: "Mating / Insemination Date",
      sireLabel: "Sire ID / Breed Code",
      calculateGestationBtn: "Log Insemination & Calculate Gestation",
      aiFeedTitle: "AI Feed Balance & Daily Nutrition Optimizer",
      aiFeedDesc: "Maintain milk butterfat and rumen pH using locally sourced grasses, tree legumes, and poonac mixes.",
      targetDM: "Target Dry Matter (DM)",
      highGreen: "High-Value Green Forage",
      essentialProtein: "Essential Protein Poonac / Meal",
      sustainableAdvisoryTitle: "Sri Lankan Sustainable Mixed Farm Advisory:",
      sustainableAdvisoryDesc: "By growing leguminous trees like Gliricidia sepium (වැටහිරියා) or Sesbania along fence rows, you can cut concentrate feed budgets by up to 35%. Gliricidia leaves exhibit up to 22% protein dry weight, offering an outstanding, cheap substitute for imported feed mashes.",
      diagnosticClinicTitle: "Livestock Skin & Foot Infection Diagnostic Clinic",
      experimentalAI: "Experimental AI",
      diagnosticDesc: "Identify mastitis clusters, lumpy skin nodules, or hoof rot instantly. Spotting infections early is crucial to preserve high milk production yields.",
      selectSpecimen: "Select Clinical Symptom Specimen below:",
      nodulesTitle: "Nodules / Lumpy Skin lesion on back",
      hoofTitle: "Limping & Wet mud between claws",
      dragUpload: "Drag or upload symptom image here to query AI Pathology registers...",
      browsePhoto: "Click to Browse Photo",
      emptySelection: "Please register or select an active animal profile from the registry directory."
    },
    si: {
      title: "සත්ව පාලනය සහ කිරි නිෂ්පාදන මධ්‍යස්ථානය",
      subtitle: "කිරි ගවයින්, එළුවන්, කුකුළු පාලනය සහ බෝවන සතුන්ගේ මුළු සෞඛ්‍යය හා ප්‍රජනන චක්‍රයම කළමනාකරණය කිරීමේ පද්ධතිය.",
      btnRegister: "නව සත්වයෙකු ලියාපදිංචි කරන්න",
      btnDelete: "වාර්තාව ඉවත් කරන්න",
      healthLabel: "සායනික සෞඛ්‍ය තත්ත්වය",
      pregnancyLabel: "ගර්භණී සහ බෝවීම් තත්ත්වය",
      vaccineLabel: "එන්නත් මාත්‍රා සහ ප්‍රතිශක්තීකරණය",
      nutritionLabel: "පෝෂණ ගණකය (තණකොළ සහ කොම්පෝස්ට්)",
      milkTitle: "දෛනික කිරි නිෂ්පාදන දත්ත සටහන",
      breedingTitle: "කෘතිම සිංචනය සහ උපත් කාලසටහන",
      breed: "ප්‍රභේදය",
      age: "වයස (මාස)",
      weight: "බර (කි.ග්‍රෑ.)",
      totalAnimals: "මුළු සතුන් සංඛ්‍යාව",
      overallYield: "දෛනික මුළු කිරි අස්වැන්න",
      pregnantCount: "පැටවුන් අපේක්ෂිත සතුන්",
      // Newly translated additions
      regPageTitle: "නව සත්වයෙකු ලියාපදිංචි කිරීමේ පත්‍රිකාව",
      cancel: "අවලංගු කරන්න",
      tagLabel: "නම / ටැග් අංකය",
      speciesLabel: "සත්ව කාණ්ඩය",
      breedLabel: "ප්‍රභේදය / පරම්පරාව",
      ageLabel: "වයස (මාස)",
      weightLabel: "බර (කි.ග්‍රෑ.)",
      isPregnantLabel: "ගර්භණීද / පැටවෙකු අපේක්ෂිතද?",
      gestationLabel: "ඉතිරි ගර්භණී කාලය (දළ වශයෙන් දින)",
      confirmRegBtn: "ලියාපදිංචිය තහවුරු කරන්න",
      headsUnit: "සතුන්",
      litersUnit: "ලීටර්/දිනකට",
      pregnantUnit: "ගර්භණී",
      deptAdvisory: "රාජ්‍ය උපදේශනය",
      vetCenter: "පශු වෛද්‍ය මධ්‍යස්ථානය",
      directoryTitle: "ලියාපදිංචි සත්ව නාමාවලිය",
      emptyRegistry: "තවමත් කිසිදු සත්වයෙකු ඇතුළත් කර නැත. ලියාපදිංචි කිරීමට ඉහත බොත්තම ඔබන්න!",
      tabProfile: "පැතිකඩ",
      tabMilk: "කිරි අස්වැන්න",
      tabBreeding: "ගර්භණී කාලය",
      tabNutrition: "ආහාර පෝෂණය",
      tabDiagnosis: "රෝග විනිශ්චය",
      registeredPassport: "ලියාපදිංචි සහතිකය",
      idLabel: "අංකය",
      notPregnantDesc: "ගර්භණී නොවේ • සංසර්ග චක්‍රය සටහන් කළ හැක",
      vaccineAlertTitle: "රාජ්‍ය එන්නත් සහ ප්‍රතිශක්තීකරණ කාලසටහන",
      vaccineSub: "පශු නිෂ්පාදන හා සෞඛ්‍ය දෙපාර්තමේන්තුව (DAPH) මඟින් නියමිත එන්නත්:",
      vaccineFMD: "කුර සහ මුඛ රෝගය (FMD): අර්ධ වාර්ෂික එන්නත (ඔක්තෝබර් / මාර්තු).",
      vaccineDone: "අනුමතයි / නිම කර ඇත",
      vaccineHS: "හෙමරේජික් සෙප්ටිසීමියාව (HS): මාස 6 ට වැඩි සියලුම සතුන් සඳහා.",
      vaccineRanikhet: "බෝවන බ්‍රොන්කයිටිස් සහ රැනිකට්: (කුකුළු එන්නත් දින 7, 21 සහ 45 දී).",
      trackLactation: "වැඩිම කිරි අස්වැන්නක් ලබා දෙන සතුන් හඳුනා ගැනීමට කිරි නිෂ්පාදනය නිරීක්ෂණය කරන්න.",
      noMilkHistory: "තවමත් කිරි නිෂ්පාදන දත්ත සටහන් කර නොමැත.",
      dateLabel: "දිනය",
      producedLiters: "ලබාගත් කිරි ප්‍රමාණය (ලීටර්)",
      logYieldBtn: "දත්ත සටහන් කරන්න",
      breedingDesc: "ගැබ් කාලය සහ බලාපොරොත්තු වන උපත් දින සටහන ගණනය කරන්න.",
      standardsTitle: "ගර්භණී කාලසීමා ප්‍රමිති:",
      standardsDesc: "කිරි ගවයින්ගේ ගර්භණී කාලය දළ වශයෙන් දින 283 කි. එළුවන්ගේ ගැබ් කාලය දළ වශයෙන් දින 150 කි.",
      recordMatingTitle: "කෘතිම සිංචනය හෝ සංසර්ගය වාර්තා කරන්න",
      matingDateLabel: "සිංචනය කළ දිනය",
      sireLabel: "ප්‍රභේද කේතය / පියාගේ විස්තර",
      calculateGestationBtn: "දත්ත එක් කර ගැබ් කාලය ගණනය කරන්න",
      aiFeedTitle: "AI ආහාර සහ දෛනික පෝෂණ ගණකය",
      aiFeedDesc: "දේශීය තණකොළ, කොළ වර්ග සහ පුන්නක්කු භාවිතයෙන් කිරි අස්වැන්න සහ සත්ව සෞඛ්‍යය උපරිම කරන්න.",
      targetDM: "වියළි ද්‍රව්‍ය අවශ්‍යතාවය (DM)",
      highGreen: "හරිත තණකොළ අවශ්‍යතාවය",
      essentialProtein: "ප්‍රෝටීන් / පොල් පුන්නක්කු අවශ්‍යතාවය",
      sustainableAdvisoryTitle: "තිරසාර කෘෂිකාර්මික උපදෙස්:",
      sustainableAdvisoryDesc: "වැටහිරියා (Gliricidia sepium) වැනි ශාක වැටවල් දිගේ වගා කිරීමෙන් සත්ව ආහාර වියදම 35% කින් අඩු කර ගත හැක. වැටහිරියා කොළවල 22% ක් ප්‍රෝටීන් අඩංගု වන බැවින් එය කදිම දේශීය ආදේශකයකි.",
      diagnosticClinicTitle: "සත්ව සම සහ කුර රෝග විනිශ්චය සායනය",
      experimentalAI: "පර්යේෂණාත්මක AI",
      diagnosticDesc: "සමෙහි ගැටිති, කිරි බුරුළු ආසාදන හෝ කුර කුණුවීම කල්තියා හඳුනාගෙන කිරි අස්වැන්න සුරක්ෂිත කරන්න.",
      selectSpecimen: "පහත සායනික රෝග ලක්ෂණ ආදර්ශයක් තෝරන්න:",
      nodulesTitle: "සමෙහි ගැටිති / ගව වසූරිය ලක්ෂණ",
      hoofTitle: "කොරගැසීම සහ කුර අතර මඩ තැවරීම",
      dragUpload: "රෝගී අවස්ථාවල ඡායාරූපයක් එක් කරන්න හෝ මෙහි තබන්න...",
      browsePhoto: "ඡායාරූපයක් තෝරන්න",
      emptySelection: "කරුණාකර සත්ව නාමාවලියෙන් සත්වයෙකු තෝරන්න හෝ අලුතින් ලියාපදිංචි කරන්න."
    },
    ta: {
      title: "கால்நடை & பால் பண்ணை மேலாண்மை",
      subtitle: "பால் மாடுகள், ஆடுகள், கோழி வளர்ப்பு மற்றும் இனப்பெருக்க சுழற்சிகளின் முழுமையான மேலாண்மை.",
      btnRegister: "புதிய விலங்கு பதிவு",
      btnDelete: "பதிவை அகற்று",
      healthLabel: "சுகாதார நிலை",
      pregnancyLabel: "கருவுறுதல் & இனப்பெருக்கம்",
      vaccineLabel: "தடுப்பூசி கால அட்டவணை",
      nutritionLabel: "ஊட்டச்சத்து கணக்கீடு (தீவனம்)",
      milkTitle: "தினசரி பால் உற்பத்திப் பதிவு",
      breedingTitle: "செயற்கை கருவூட்டல் & பிரசவ அட்டவணை",
      breed: "இனம்",
      age: "வயது (மாதங்கள்)",
      weight: "எடை (கிலோ)",
      totalAnimals: "மொத்த விலங்குகள்",
      overallYield: "தினசரி மொத்த பால்",
      pregnantCount: "சினை விலங்குகள்",
      // Newly translated additions
      regPageTitle: "விலங்கு பதிவுப் பக்கம்",
      cancel: "ரத்து செய்",
      tagLabel: "விலங்கின் பெயர் / அடையாள எண்",
      speciesLabel: "விலங்கு வகை",
      breedLabel: "இனம் / பரம்பரை",
      ageLabel: "வயது (மாதங்கள்)",
      weightLabel: "எடை (கிலோ)",
      isPregnantLabel: "சினைப்பிடித்துள்ளதா?",
      gestationLabel: "எஞ்சிய சினை நாட்கள் (தோராயமாக)",
      confirmRegBtn: "பதிவை உறுதிப்படுத்துக",
      headsUnit: "விலங்குகள்",
      litersUnit: "லீட்டர்/நாள்",
      pregnantUnit: "கருவுற்றது",
      deptAdvisory: "அரச ஆலோசனை",
      vetCenter: "கால்நடை மருத்துவ மையம்",
      directoryTitle: "கால்நடை பதிவேடு",
      emptyRegistry: "கால்நடைகள் எதுவும் இன்னும் பதிவு செய்யப்படவில்லை. புதிய விலங்கைச் சேர்க்க மேலே உள்ள பொத்தானை அழுத்தவும்!",
      tabProfile: "விவரம்",
      tabMilk: "பால் உற்பத்தி",
      tabBreeding: "கருக்காலம்",
      tabNutrition: "உணவு மற்றும் தீவனம்",
      tabDiagnosis: "நோய் பரிசோதனை",
      registeredPassport: "பதிவு சான்றிதழ்",
      idLabel: "எண்",
      notPregnantDesc: "சினை பிடிக்கவில்லை • இனப்பெருக்க சுழற்சியை திட்டமிடலாம்",
      vaccineAlertTitle: "அரச தடுப்பூசி மற்றும் நோய் தடுப்பு அட்டவணை",
      vaccineSub: "விலங்கு உற்பத்தி மற்றும் சுகாதாரத் துறை (DAPH) பரிந்துரைக்கும் தடுப்பூசிகள்:",
      vaccineFMD: "கோமாரி நோய் (FMD): அரை ஆண்டுக்கு ஒருமுறை தடுப்பூசி (அக்டோபர் / மார்ச்).",
      vaccineDone: "முடிக்கப்பட்டது",
      vaccineHS: "தொண்டை அடைப்பான் நோய் (HS): 6 மாதத்திற்கு மேற்பட்ட அனைத்து விலங்குகளுக்கும்.",
      vaccineRanikhet: "இராணிகெட் நோய்: (கோழிகளுக்கு 7, 21 மற்றும் 45 ஆவது நாட்களில் தடுப்பூசி).",
      trackLactation: "அதிக பால் தரும் மாடுகளை அடையாளம் காண பால் உற்பத்தியை கண்காணிக்கவும்.",
      noMilkHistory: "பால் உற்பத்தித் தரவுகள் இன்னும் பதிவு செய்யப்படவில்லை.",
      dateLabel: "தேதி",
      producedLiters: "உற்பத்தி செய்யப்பட்ட பால் (லீட்டர்)",
      logYieldBtn: "பதிவு செய்",
      breedingDesc: "எஞ்சிய சினை நாட்களையும் பிரசவ தேதியையும் கணக்கிட்டு திட்டமிடுங்கள்.",
      standardsTitle: "சினை கால அளவு தரநிலைகள்:",
      standardsDesc: "பால் மாடுகளின் சினை காலம் தோராயமாக 283 நாட்கள் ஆகும். ஆடுகளின் சினை காலம் தோராயமாக 150 நாட்கள் ஆகும்.",
      recordMatingTitle: "செயற்கை அல்லது இயற்கை கருவூட்டலைப் பதிவு செய்க",
      matingDateLabel: "கருவூட்டல் தேதி",
      sireLabel: "விந்து வகை / தந்தை விபரம்",
      calculateGestationBtn: "சினை காலத்தை கணக்கிடுக",
      aiFeedTitle: "AI தீவன மேலாண்மை & ஊட்டச்சத்து கணக்கீடு",
      aiFeedDesc: "உள்நாட்டு புற்கள் மற்றும் புண்ணாக்கு வகைகளைப் பயன்படுத்தி பால் உற்பத்தியை அதிகரிக்கவும்.",
      targetDM: "உலர் தீவனம் தேவை (DM)",
      highGreen: "பசுந்தீவனம் தேவை",
      essentialProtein: "புண்ணாக்கு / உரம் தேவை",
      sustainableAdvisoryTitle: "நிலையான விவசாய ஆலோசனைகள்:",
      sustainableAdvisoryDesc: "கிளைரிசிடியா (Gliricidia sepium) போன்ற தாவரங்களை வேலி ஓரமாக வளர்ப்பதன் மூலம் தீவனச் செலவை 35% குறைக்கலாம். இதில் 22% புரதம் உள்ளதால் சிறந்த உள்நாட்டு மாற்றாகும்.",
      diagnosticClinicTitle: "தோல் மற்றும் கால் நோய் கண்டறியும் மையம்",
      experimentalAI: "சோதனை முறை AI",
      diagnosticDesc: "மடி அழற்சி, தோல் கட்டிகள் அல்லது கால் அழுகல் நோயை உடனுக்குடன் கண்டறிந்து பால் உற்பத்தியை பாதுகாக்கவும்.",
      selectSpecimen: "அறிகுறிகளின் மாதிரியை தேர்வு செய்க:",
      nodulesTitle: "தோல் கட்டிகள் / கோமாரி நோய் அறிகுறிகள்",
      hoofTitle: "நொண்டி நடப்பது மற்றும் குதி கால் சேறு",
      dragUpload: "அறிகுறி படத்தை இங்கே பதிவேற்றவும்...",
      browsePhoto: "படத்தைத் தேர்ந்தெடுக்கவும்",
      emptySelection: "கால்நடை பதிவேட்டிலிருந்து ஒரு விலங்கைத் தேர்வு செய்யவும் அல்லது புதிதாகப் பதிவு செய்யவும்."
    }
  };

  const currentDict = dictionary[lang] || dictionary.en;

  return (
    <div className="space-y-6">
      
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 text-white p-6 rounded-3xl border border-emerald-800 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold block w-fit mb-2">
              Module 2: Managed Husbandry
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight flex items-center gap-2">
              <Milk className="w-6 h-6 text-emerald-400" />
              {currentDict.title}
            </h2>
            <p className="text-xs text-emerald-100/90 max-w-xl leading-relaxed mt-1">
              {currentDict.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowRegForm(!showRegForm)}
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2.5 rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              {currentDict.btnRegister}
            </button>
          </div>
        </div>

        {/* Dashboard Mini-Tally Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-800/60">
          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/40">
            <span className="text-[10px] font-mono text-emerald-400 block uppercase">{currentDict.totalAnimals}</span>
            <span className="text-2xl font-bold font-display">{animals.length} <span className="text-xs text-emerald-400">{currentDict.headsUnit}</span></span>
          </div>

          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/40">
            <span className="text-[10px] font-mono text-emerald-400 block uppercase">{currentDict.overallYield}</span>
            <span className="text-2xl font-bold font-display text-emerald-300">
              {aggregateMilkToday.toFixed(1)} <span className="text-xs">{currentDict.litersUnit}</span>
            </span>
          </div>

          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/40">
            <span className="text-[10px] font-mono text-emerald-400 block uppercase">{currentDict.pregnantCount}</span>
            <span className="text-2xl font-bold font-display text-amber-300">
              {aggregateExpectingMoms} <span className="text-xs">{currentDict.pregnantUnit}</span>
            </span>
          </div>

          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/40">
            <span className="text-[10px] font-mono text-emerald-400 block uppercase">{currentDict.deptAdvisory}</span>
            <span className="text-xs font-black text-white hover:underline flex items-center gap-1 mt-1 cursor-pointer">
              {currentDict.vetCenter} <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Register Animal Modal Popup Form */}
      {showRegForm && (
        <form onSubmit={handleRegister} className="bg-white p-5 rounded-2xl border border-gray-150 shadow-md space-y-4 max-w-xl mx-auto">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" /> {currentDict.regPageTitle}
            </h4>
            <button 
              type="button" 
              onClick={() => setShowRegForm(false)}
              className="text-gray-400 hover:text-gray-650 text-xs font-bold"
            >
              {currentDict.cancel}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">{currentDict.tagLabel}</label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-gray-800"
                placeholder="e.g. Kalyani-2"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">{currentDict.speciesLabel}</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-gray-805 font-bold"
                value={newSpecies}
                onChange={(e) => setNewSpecies(e.target.value as any)}
              >
                <option value="Dairy Cattle">Dairy Cattle</option>
                <option value="Beef Cattle">Beef Cattle</option>
                <option value="Goat">Goat</option>
                <option value="Poultry">Poultry</option>
                <option value="Buffalo">Water Buffalo</option>
                <option value="Pig">Pig/Swine</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">{currentDict.breedLabel}</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-gray-800"
                placeholder="e.g. Sahiwal Cross"
                value={newBreed}
                onChange={(e) => setNewBreed(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">{currentDict.ageLabel}</label>
              <input
                type="number"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-gray-800"
                placeholder="e.g. 24"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">{currentDict.weightLabel}</label>
              <input
                type="number"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-gray-800"
                placeholder="e.g. 400"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="formIsPregnant"
                className="w-4 h-4 text-emerald-600 rounded"
                checked={newIsPregnant}
                onChange={(e) => setNewIsPregnant(e.target.checked)}
              />
              <label htmlFor="formIsPregnant" className="text-xs font-mono font-bold text-gray-750 cursor-pointer">
                {currentDict.isPregnantLabel}
              </label>
            </div>
          </div>

          {newIsPregnant && (
            <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              <label className="block text-[10px] uppercase font-mono text-amber-900 mb-1">{currentDict.gestationLabel}</label>
              <input
                type="number"
                className="w-full bg-white border border-amber-200 rounded-lg p-2 text-xs text-amber-955"
                placeholder="e.g. 283 days for cows, 150 days for goats"
                value={newGestationDays}
                onChange={(e) => setNewGestationDays(e.target.value)}
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold p-2.5 rounded-xl text-xs transition-all"
          >
            {currentDict.confirmRegBtn}
          </button>
        </form>
      )}

      {/* Core Split Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Selector Head List (4 columns) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-150/80 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-2.5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400">{currentDict.directoryTitle}</h3>
          </div>

          <div className="space-y-2">
            {animals.map((ani) => {
              const isSelected = ani.id === activeAnimalId;

              return (
                <div
                  key={ani.id}
                  onClick={() => setActiveAnimalId(ani.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex justify-between items-center transition-all ${
                    isSelected 
                      ? "bg-slate-50 border-emerald-600 ring-1 ring-emerald-600/30" 
                      : "bg-white border-gray-150 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      ani.species === "Dairy Cattle" ? "bg-amber-50 text-amber-800" :
                      ani.species === "Goat" ? "bg-slate-50 text-slate-700" : "bg-emerald-50 text-emerald-800"
                    }`}>
                      {ani.species === "Dairy Cattle" ? <Milk className="w-5 h-5 text-amber-700" /> : <Heart className="w-5 h-5" />}
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
                        {ani.name}
                        {ani.isPregnant && (
                          <span className="bg-rose-100 text-rose-800 text-[8px] font-extrabold px-1.5 py-0.2 rounded-full animate-pulse">
                            PREG
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                        {ani.species} • {ani.breed}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      ani.healthStatus === "Excellent" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {ani.healthStatus}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAnimal(ani.id);
                      }}
                      className="text-gray-300 hover:text-rose-650 transition-all p-1"
                      title={currentDict.btnDelete}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {animals.length === 0 && (
              <p className="text-center py-8 text-gray-400 italic text-xs">{currentDict.emptyRegistry}</p>
            )}
          </div>
        </div>

        {/* Detailed Workspaces & Diagnostic controls (8 columns) */}
        {activeAnimal ? (
          <div className="lg:col-span-8 space-y-6">
            
            {/* Horizontal Sub tabs for active head management */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1 self-start w-fit">
              <button
                onClick={() => setActiveSubTab("registry")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeSubTab === "registry" ? "bg-white text-emerald-950 shadow-2xs font-extrabold" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentDict.tabProfile}</span>
              </button>

              {(activeAnimal.species === "Dairy Cattle" || activeAnimal.species === "Goat") && (
                <button
                  onClick={() => setActiveSubTab("milk")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    activeSubTab === "milk" ? "bg-white text-emerald-950 shadow-2xs font-extrabold" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Milk className="w-3.5 h-3.5 text-amber-700" />
                  <span>{currentDict.tabMilk}</span>
                </button>
              )}

              <button
                onClick={() => setActiveSubTab("breeding")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeSubTab === "breeding" ? "bg-white text-emerald-950 shadow-2xs font-extrabold" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-650" />
                <span>{currentDict.tabBreeding}</span>
              </button>

              <button
                onClick={() => setActiveSubTab("feed")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeSubTab === "feed" ? "bg-white text-emerald-950 shadow-2xs font-extrabold" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <Bone className="w-3.5 h-3.5 text-amber-600" />
                <span>{currentDict.tabNutrition}</span>
              </button>

              <button
                onClick={() => setActiveSubTab("health")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  activeSubTab === "health" ? "bg-white text-emerald-950 shadow-2xs font-extrabold" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>{currentDict.tabDiagnosis}</span>
              </button>
            </div>

            {/* Sub-tab 1: Registry Profile Stats Card */}
            {activeSubTab === "registry" && (
              <div className="bg-white p-5 rounded-2xl border border-gray-150/80 space-y-4 shadow-3xs">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <h4 className="text-sm font-bold text-slate-805 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" /> {currentDict.registeredPassport}: {activeAnimal.name}
                  </h4>
                  <span className="text-xs font-mono bg-slate-100 font-bold px-2 py-0.5 rounded text-gray-500">
                    {currentDict.idLabel}: {activeAnimal.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-50/70 rounded-xl">
                    <span className="text-[10px] uppercase font-mono text-gray-400 block">{currentDict.breed}</span>
                    <span className="text-xs font-bold text-gray-700 block mt-0.5">{activeAnimal.breed}</span>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-xl">
                    <span className="text-[10px] uppercase font-mono text-gray-400 block">{currentDict.age}</span>
                    <span className="text-xs font-bold text-gray-700 block mt-0.5">{activeAnimal.ageMonths} {lang === "si" ? "මාස" : lang === "ta" ? "மாதங்கள்" : "Months"}</span>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-xl">
                    <span className="text-[10px] uppercase font-mono text-gray-400 block">{currentDict.weight}</span>
                    <span className="text-xs font-bold text-gray-700 block mt-0.5">{activeAnimal.weightKg} Kg</span>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-xl">
                    <span className="text-[10px] uppercase font-mono text-gray-400 block">{currentDict.healthLabel}</span>
                    <span className="text-xs font-black text-emerald-700 block mt-0.5">{activeAnimal.healthStatus}</span>
                  </div>

                  <div className="p-3 bg-slate-50/70 rounded-xl col-span-2">
                    <span className="text-[10px] uppercase font-mono text-gray-400 block">{currentDict.pregnancyLabel}</span>
                    <span className="text-xs font-bold block mt-0.5">
                      {activeAnimal.isPregnant ? (
                        <span className="text-rose-600 font-extrabold flex items-center gap-1">
                          {lang === "si" ? `පැටවෙකු අපේක්ෂිතයි (ඇස්තමේන්තුගත උපත් දිනය: ${activeAnimal.expectedCalvingDate})` : lang === "ta" ? `சினை உறுதியானது (பிரசவத் தேதி: ${activeAnimal.expectedCalvingDate})` : `Expecting (Calving predicted around: ${activeAnimal.expectedCalvingDate})`}
                        </span>
                      ) : (
                        <span className="text-gray-500">{currentDict.notPregnantDesc}</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Local Department Vaccinations Guideline Tracker */}
                <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 space-y-2">
                  <h5 className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-emerald-600" />
                    {currentDict.vaccineAlertTitle}
                  </h5>
                  <p className="text-[11px] text-gray-650 leading-relaxed">
                    {currentDict.vaccineSub}
                  </p>
                  <ul className="text-xs space-y-1 text-slate-700 list-disc list-inside">
                    <li>
                      <strong>{currentDict.vaccineFMD.split(":")[0]}</strong>: {currentDict.vaccineFMD.split(":")[1] || ""}
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 ml-1.5 px-1 py-0.2 rounded font-bold">{currentDict.vaccineDone}</span>
                    </li>
                    <li>
                      <strong>{currentDict.vaccineHS.split(":")[0]}</strong>: {currentDict.vaccineHS.split(":")[1] || ""}
                    </li>
                    <li>
                      <strong>{currentDict.vaccineRanikhet.split(":")[0]}</strong>: {currentDict.vaccineRanikhet.split(":")[1] || ""}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Lactation curve and milk yields tracker */}
            {activeSubTab === "milk" && (activeAnimal.species === "Dairy Cattle" || activeAnimal.species === "Goat") && (
              <div className="bg-white p-5 rounded-2xl border border-gray-150/80 space-y-5 shadow-3xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <Milk className="w-4 h-4 text-amber-700" /> {currentDict.milkTitle}
                    </h4>
                    <p className="text-[11px] text-gray-500">{currentDict.trackLactation}</p>
                  </div>
                </div>

                {/* Render recharts line graph */}
                {activeAnimal.milkProductionHistory && activeAnimal.milkProductionHistory.length > 0 ? (
                  <div className="h-[210px] min-w-full bg-slate-50 p-2 rounded-xl border">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={activeAnimal.milkProductionHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="liters" stroke="#c2410c" strokeWidth={2.5} activeDot={{ r: 6 }} name="Liters" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-center py-6 text-xs text-gray-400 italic">{currentDict.noMilkHistory} ({activeAnimal.name})</p>
                )}

                {/* Form to submit daily liters */}
                <form onSubmit={handleAddMilkRecord} className="flex flex-wrap gap-3 items-end bg-slate-50/50 p-3 rounded-xl border border-slate-150">
                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">{currentDict.dateLabel}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 06-23"
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                      value={logDate}
                      onChange={(e) => setLogDate(e.target.value)}
                    />
                  </div>

                  <div className="flex-1 min-w-[140px]">
                    <label className="block text-[10px] uppercase font-mono text-gray-500 mb-1">{currentDict.producedLiters}</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 14.5"
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 font-bold"
                      value={logLiters}
                      onChange={(e) => setLogLiters(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs p-2.5 rounded-lg shrink-0 transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> {currentDict.logYieldBtn}
                  </button>
                </form>
              </div>
            )}

            {/* Sub-tab 3: Gestation / Breeding Scheduler */}
            {activeSubTab === "breeding" && (
              <div className="bg-white p-5 rounded-2xl border border-gray-150/80 space-y-4 shadow-3xs">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-650" /> {currentDict.breedingTitle}
                  </h4>
                  <p className="text-[11px] text-gray-500">{currentDict.breedingDesc}</p>
                </div>

                <div className="bg-amber-50/30 p-4 rounded-xl border border-amber-200/50 flex gap-3 items-start">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-955 space-y-1">
                    <strong className="block">{currentDict.standardsTitle}</strong>
                    <p className="leading-relaxed">
                      {currentDict.standardsDesc}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleLogMating} className="space-y-3 bg-slate-50/50 p-4 rounded-xl border">
                  <h5 className="text-[11px] font-mono uppercase tracking-widest text-slate-500 font-bold">{currentDict.recordMatingTitle}</h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">{currentDict.matingDateLabel}</label>
                      <input
                        type="date"
                        required
                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 cursor-pointer"
                        value={mateDate}
                        onChange={(e) => setMateDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono text-gray-400 mb-1">{currentDict.sireLabel}</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800"
                        placeholder="e.g. Friesian Semen Batch 90"
                        value={matingBreed}
                        onChange={(e) => setMatingBreed(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all"
                  >
                    {currentDict.calculateGestationBtn}
                  </button>
                </form>
              </div>
            )}

            {/* Sub-tab 4: Nutrition Feed Optimizer Calculator */}
            {activeSubTab === "feed" && (
              <div className="bg-white p-5 rounded-2xl border border-gray-150/80 space-y-4 shadow-3xs">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <Bone className="w-4 h-4 text-emerald-700" /> {currentDict.aiFeedTitle}
                  </h4>
                  <p className="text-[11px] text-gray-500">{currentDict.aiFeedDesc}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <span className="font-mono text-[9px] uppercase text-gray-450 block">{currentDict.targetDM}</span>
                    <p className="font-bold text-gray-850 mt-1">{calculateFeeds(activeAnimal).dryMatter}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <span className="font-mono text-[9px] uppercase text-gray-450 block">{currentDict.highGreen}</span>
                    <p className="font-bold text-emerald-800 mt-1">{calculateFeeds(activeAnimal).green}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <span className="font-mono text-[9px] uppercase text-gray-450 block">{currentDict.essentialProtein}</span>
                    <p className="font-bold text-amber-800 mt-1">{calculateFeeds(activeAnimal).concentrate}</p>
                  </div>
                </div>

                <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 space-y-2">
                  <h5 className="text-xs font-mono font-black uppercase text-emerald-900">{currentDict.sustainableAdvisoryTitle}</h5>
                  <p className="text-[11px] text-gray-700 leading-relaxed">
                    {currentDict.sustainableAdvisoryDesc}
                  </p>
                </div>
              </div>
            )}

            {/* Sub-tab 5: Livestock Disease Scanner (Skin/Lobe/Foot) */}
            {activeSubTab === "health" && (
              <div className="bg-white p-5 rounded-2xl border border-gray-150/80 space-y-4 shadow-3xs">
                <div className="border-b border-gray-100 pb-2 flex justify-between items-center">
                  <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-500" /> {currentDict.diagnosticClinicTitle}
                  </h4>
                  <span className="bg-rose-100 text-rose-800 text-[9px] font-black px-2 py-0.5 rounded-full">
                    {currentDict.experimentalAI}
                  </span>
                </div>

                <p className="text-xs text-gray-650 leading-relaxed">
                  {currentDict.diagnosticDesc}
                </p>

                {/* Simulated Diagnostic Specimen Buttons */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border">
                  <h5 className="text-[10px] font-mono uppercase tracking-widest text-gray-400">{currentDict.selectSpecimen}</h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        alert(lang === "si" ? "Lumpy Skin (ගව වසූරිය) රෝග ලක්ෂණ හඳුනා ගැනුනි: තද ගැටිති, කහ පැහැ දියර ගැලීම්. රතු සේලයින් දියරයෙන් තුවාල සෝදන්න. සහල් සහ කුරුඳු කුඩු මුසු කොට ගල්වන්න." : lang === "ta" ? "தோல் மடி நோய் (LSD) அறிகுறி கண்டறியப்பட்டது: சிறிய தடிப்புகள், காய்ச்சல். வேப்பிலை கொண்டு சுத்தம் செய்யவும், உடனடியாக கால்நடை மருத்துவரை அணுகவும்." : "Lumpy Skin Disease (LSD) suspected with high confidence (88%). Maintain strict vector (mosquito/fly) barriers, paint dermal pustules with organic turmeric formulation, and isolate immediately from herd.");
                      }}
                      className="bg-white hover:bg-slate-100 border p-2.5 rounded-lg text-xs font-semibold text-slate-800 text-left flex items-center justify-between"
                    >
                      <span>{currentDict.nodulesTitle}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        alert(lang === "si" ? "Hoof Rot (කුර කුණුවීම) හඳුනා ගැනුනි. ක්ලෝරීන් ස්නානය සලසන්න. වියළි sawdust ඇතිරිලි යොදන්න." : lang === "ta" ? "குளம்பு அழுகல் நோய் கண்டறியப்பட்டது: கால்நடை நடப்பதில் சிரமம், குதி கால் சேறு. காப்பர் சல்பேட் கரைசல் கொண்டு சுத்தம் செய்க." : "Hoof Rot (Fusobacterium necrophorum) predicted (79%). Bathe infected foot in 5% copper sulphate solution and ensure animal shelter bedding has clean dry straw with no drainage puddle accumulation.");
                      }}
                      className="bg-white hover:bg-slate-100 border p-2.5 rounded-lg text-xs font-semibold text-slate-800 text-left flex items-center justify-between"
                    >
                      <span>{currentDict.hoofTitle}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Upload Section mock */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-emerald-300 transition-all cursor-pointer">
                  <span className="block text-xs font-mono text-gray-400">{currentDict.dragUpload}</span>
                  <input type="file" className="hidden" id="livestock-photo-upload" />
                  <label htmlFor="livestock-photo-upload" className="inline-block bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold font-mono py-1.5 px-3 rounded-lg border border-emerald-100 mt-2 cursor-pointer">
                    {currentDict.browsePhoto}
                  </label>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="lg:col-span-8 bg-white p-12 rounded-2xl border border-gray-150 text-center text-gray-400 italic text-xs">
            {currentDict.emptySelection}
          </div>
        )}
      </div>

    </div>
  );
}
