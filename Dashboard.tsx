import React, { useState } from "react";
import { FarmPlot, AgroEcologicalZone, SoilType, WeatherCondition } from "./types";
import { 
  Sprout, 
  MapPin, 
  Layers, 
  Droplet, 
  Thermometer, 
  Trash2, 
  Plus, 
  CheckCircle, 
  Compass, 
  Info,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CalendarDays,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Language, translations } from "./translations";

interface DashboardProps {
  plots: FarmPlot[];
  activePlot: FarmPlot | null;
  onSelectPlot: (plot: FarmPlot) => void;
  onAddPlot: (plot: FarmPlot) => void;
  onDeletePlot: (id: string) => void;
  currentTime: string;
  lang: Language;
}

interface DistrictWeatherData {
  name: string;
  temp: string;
  rainProb: number;
  windSpeed: string;
  humidity: string;
  evapIndex: string;
  soilMoisture: string;
  advice: string;
}

const DISTRICT_WEATHER: Record<string, DistrictWeatherData> = {
  "Anuradhapura": {
    name: "Anuradhapura (Dry Zone)",
    temp: "33.1°C",
    rainProb: 15,
    windSpeed: "12 km/h",
    humidity: "62%",
    evapIndex: "5.8 mm/day",
    soilMoisture: "Low (22%)",
    advice: "Severe sunshine. Conserve reservoir tank feeds; schedule irrigation at early dawn."
  },
  "Nuwara Eliya": {
    name: "Nuwara Eliya (Upcountry)",
    temp: "17.4°C",
    rainProb: 80,
    windSpeed: "23 km/h",
    humidity: "89%",
    evapIndex: "2.1 mm/day",
    soilMoisture: "Wet (65%)",
    advice: "Heavy rainfall pattern. Clear all potato/carrot furrow conduits to bypass waterlogging."
  },
  "Kandy": {
    name: "Kandy (Intermediate Dunal)",
    temp: "27.8°C",
    rainProb: 40,
    windSpeed: "14 km/h",
    humidity: "74%",
    evapIndex: "3.7 mm/day",
    soilMoisture: "Optimal (42%)",
    advice: "Excellent humidity. Perfect timing for compost tilling and spice trimming."
  },
  "Jaffna": {
    name: "Jaffna (Northern Arid)",
    temp: "34.5°C",
    rainProb: 8,
    windSpeed: "16 km/h",
    humidity: "58%",
    evapIndex: "6.3 mm/day",
    soilMoisture: "Arid (16%)",
    advice: "Arid sea winds. Layer red onion beds with coconut husks to shield the topsoil."
  },
  "Galle": {
    name: "Galle (Southern Lowlands)",
    temp: "29.6°C",
    rainProb: 75,
    windSpeed: "21 km/h",
    humidity: "83%",
    evapIndex: "4.1 mm/day",
    soilMoisture: "Saturated (58%)",
    advice: "Evening storm warning. Avoid adding dry fertilizer; secure plastic cloche screens."
  },
  "Colombo": {
    name: "Colombo (Wet Coastal)",
    temp: "31.2°C",
    rainProb: 65,
    windSpeed: "19 km/h",
    humidity: "80%",
    evapIndex: "4.6 mm/day",
    soilMoisture: "Damp (50%)",
    advice: "Drizzle expected. Ideal for potting nurseries and checking plant clinical leaf symptoms."
  },
  "Badulla": {
    name: "Badulla (Uva Slopes)",
    temp: "26.4°C",
    rainProb: 35,
    windSpeed: "15 km/h",
    humidity: "70%",
    evapIndex: "3.4 mm/day",
    soilMoisture: "Optimal (38%)",
    advice: "Warm days, cold dew at night. Monitor pepper vines for mildew; apply organic sulphur paste."
  }
};

const INITIAL_REMINDERS = [
  { id: "rem-1", task: "Clear canal drainage to safeguard from wet evening sprays", isCompleted: false, date: "2026-06-23" },
  { id: "rem-2", task: "Test soil pH ahead of nursery bio-compost layout", isCompleted: false, date: "2026-06-24" },
  { id: "rem-3", task: "Collect wild Neem kernels for pest repellant emulsion", isCompleted: true, date: "2026-06-23" },
  { id: "rem-4", task: "Examine chili plants for early leaf curl aphid vectors", isCompleted: false, date: "2026-06-25" }
];

export default function Dashboard({ 
  plots, 
  activePlot, 
  onSelectPlot, 
  onAddPlot, 
  onDeletePlot,
  currentTime,
  lang
}: DashboardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("Anuradhapura");
  
  // Reminders States
  const [reminders, setReminders] = useState<any[]>(() => {
    const raw = localStorage.getItem("aswanna_work_reminders");
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return INITIAL_REMINDERS;
  });
  const [newReminderText, setNewReminderText] = useState("");

  const saveReminders = (newRem: any[]) => {
    setReminders(newRem);
    localStorage.setItem("aswanna_work_reminders", JSON.stringify(newRem));
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderText.trim()) return;
    const item = {
      id: "rem-" + Date.now(),
      task: newReminderText.trim(),
      isCompleted: false,
      date: new Date().toISOString().split("T")[0]
    };
    saveReminders([item, ...reminders]);
    setNewReminderText("");
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r);
    saveReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    saveReminders(updated);
  };
  
  // Form State
  const [plotName, setPlotName] = useState("");
  const [plotSize, setPlotSize] = useState("1.5");
  const [zone, setZone] = useState<AgroEcologicalZone>(AgroEcologicalZone.DRY_ZONE);
  const [soil, setSoil] = useState<SoilType>(SoilType.RED_REDDISH_BROWN);
  const [ph, setPh] = useState("6.2");
  const [n, setN] = useState("Medium");
  const [p, setP] = useState("Low");
  const [k, setK] = useState("Medium");
  const [water, setWater] = useState("Irrigation Tank (Wewa)");

  // Local Weather Advisory based on Zone & Season
  // Active Season is Maha (Northeast Monsoon) based on June timestamp
  const getSeasonAdvisory = (): { title: string; desc: string; alerts: string[] } => {
    if (lang === "si") {
      return {
        title: "යල කන්නය (මැයි වපුරා - සැප්තැම්බර් අස්වනු)",
        desc: "තෙත් සහ අන්තර් කලාපවලට බලපාන නිරිතදිග මෝසම් වර්ෂාව මඟින් ක්‍රියාත්මක වේ. වියළි කලාපයේ අධික වාෂ්පීකරණ වේගයක් පවතී.",
        alerts: [
          "වියළි කලාපය: වැව් ජල සංචිත ආරක්ෂා කරන්න, උදෑසන හෝ සවස් කාලයේදී පමණක් ජලය සපයන්න.",
          "තෙත් කලාපය: අධික වර්ෂාව නිසා දිලීර සහ පත්‍ර කුණුවීමේ රෝග පැතිරීමේ අවදානමක් ඇත. නිසි ජලාපවහන නාලිකා පවත්වා ගන්න.",
          "අන්තර් කලාපය: රතු ලූණු සහ මිරිස් වගාව සඳහා කදිම කාලගුණයකි."
        ]
      };
    } else if (lang === "ta") {
      return {
        title: "யால பருவம் (மே விதைப்பு - செப்டம்பர் அறுவடை)",
        desc: "தென்மேற்கு பருவமழையினால் இயக்கப்படுகிறது. உலர் மண்டலங்களில் தற்போது அதிக நீராவிப்போக்கு வீதங்கள் உள்ளன.",
        alerts: [
          "உலர் மண்டலம்: நீர்ப்பாசன குளங்களின் சேமிப்புகளை பாதுகாக்கவும்; அதிகாலை அல்லது மாலை நேரங்களில் மட்டும் நீர் பாய்ச்சவும்.",
          "ஈர மண்டலம்: தொடர் மழையால் பூஞ்சை காளான் நோய்கள் தாக்கும் அபாயம் அதிகம். வடிகால் வழிகளை சுத்தமாக வைத்திருக்கவும்.",
          "இடைநிலை மண்டலம்: சின்ன வெங்காயம் மற்றும் மிளகாய் பயிரிடுவதற்கு உகந்த காலம்."
        ]
      };
    }
    return {
      title: "Yala Kanna (Sowing May - Harvesting Sept)",
      desc: "Powered by Southwest Monsoon rains mostly active in the Wet/Intermediate zone. Dry zones are currently running dry with high evaporation rates.",
      alerts: [
        "Dry Zone: Safeguard irrigation tank storage; restrict irrigation to cooler twilight timings.",
        "Wet Zone: High susceptibility to fungal mildew and leaf blight due to frequent showers. Maintain clean field drainage paths.",
        "Intermediate Zone: Favorable for red onion and chili tilling."
      ]
    };
  };

  const getTranslatedWeather = (districtKey: string) => {
    const data = DISTRICT_WEATHER[districtKey] || DISTRICT_WEATHER["Anuradhapura"];
    if (lang === "si") {
      const translationMap: Record<string, { name: string; advice: string }> = {
        "Anuradhapura": {
          name: "අනුරාධපුරය (වියළි කලාපය)",
          advice: "තද හිරු රශ්මිය. වැව් ජල මූලාශ්‍ර ආරක්ෂා කරගන්න; උදෑසන පමණක් ජලය සපයන්න."
        },
        "Nuwara Eliya": {
          name: "නුවරඑළිය (කඳුකරය)",
          advice: "අධික වර්ෂාපතනය. අර්තාපල්/කැරට් පාත්ති කුණුවීම වැළැක්වීම සඳහා ජලාපවහනය සකසන්න."
        },
        "Kandy": {
          name: "මහනුවර (අන්තර් කලාපය)",
          advice: "විශිෂ්ඨ ආර්ද්‍රතාවය. කොම්පෝස්ට් පස් කලවම් කිරීමට සහ කුළුබඩු කප්පාදුවට සුදුසුම වේලාවයි."
        },
        "Jaffna": {
          name: "යාපනය (උතුරු වියළි කලාපය)",
          advice: "වියළි මුහුදු සුළං. පස ආරක්ෂා කිරීම සඳහා පොල් ලෙලි ඇතිරීම සිදු කරන්න."
        },
        "Galle": {
          name: "ගාල්ල (පහතරට තෙත් කලාපය)",
          advice: "සවස් කාලයේ කුණාටු අනතුරු ඇඟවීම්. රසායනික පොහොර යෙදීමෙන් වළකින්න."
        },
        "Colombo": {
          name: "කොළඹ (තෙත් වෙරළබඩ)",
          advice: "මද වැසි බලාපොරොත්තු වේ. පැළ තවන්නන් සඳහා සහ බෝග රෝග පරීක්ෂා කිරීම සඳහා සුදුසුයි."
        },
        "Badulla": {
          name: "බදුල්ල (ඌව බෑවුම්)",
          advice: "දහවල රස්නය සහ රාත්‍රී සීතල. මිරිස් සහ ගම්මිරිස් වගාවේ දිලීර අවදානම අධීක්ෂණය කරන්න."
        }
      };
      return { 
        ...data, 
        name: translationMap[districtKey]?.name || data.name,
        advice: translationMap[districtKey]?.advice || data.advice 
      };
    } else if (lang === "ta") {
      const translationMap: Record<string, { name: string; advice: string }> = {
        "Anuradhapura": {
          name: "அனுராதபுரம் (உலர் மண்டலம்)",
          advice: "கடுமையான வெயில். குளத்து நீரை கவனமாகப் பயன்படுத்துங்கள்; அதிகாலையில் நீர் பாய்ச்சவும்."
        },
        "Nuwara Eliya": {
          name: "நுவரெலியா (மலைநாடு)",
          advice: "அதி பலத்த மழை. உருளைக்கிழங்கு, கேரட் பாத்திகளில் நீர் தேங்குவதைத் தவிர்க்க வடிகால்களைச் சரிசெய்யவும்."
        },
        "Kandy": {
          name: "கண்டி (இடைநிலை மண்டலம்)",
          advice: "சிறந்த ஈரப்பதம். உரம் கலப்பதற்கும் வாசனைப் பயிர்களைப் பராமரிப்பதற்கும் சிறந்த நேரம்."
        },
        "Jaffna": {
          name: "யாழ்ப்பாணம் (வடக்கு உலர் காடு)",
          advice: "உலர் கடல் காற்று. மண்ணின் ஈரப்பதத்தைப் பாதுகாக்க தேங்காய் மட்டைகளை அடுக்கி வைக்கவும்."
        },
        "Galle": {
          name: "காலி (தெற்கு ஈரநிலம்)",
          advice: "மாலை நேர புயல் எச்சரிக்கை. இரசாயன உரங்கள் இடுவதைத் தவிர்க்கவும்; படுக்கைகளைப் பாதுகாக்கவும்."
        },
        "Colombo": {
          name: "கொழும்பு (ஈரமான கடற்கரை)",
          advice: "லேசான மழை பெய்யக்கூடும். நாற்றங்கால்களைப் பராமரிப்பதற்கும் இலை நோய் அறிகுறிகளைச் சோதிப்பதற்கும் ஏற்றது."
        },
        "Badulla": {
          name: "பதுளை (ஊவா சாய்வு)",
          advice: "பகல் வெப்பம், இரவு குளுமை. பூஞ்சை காளான் தாக்குதல்களை கண்காணித்து கரிம সালபர் தெளிக்கவும்."
        }
      };
      return { 
        ...data, 
        name: translationMap[districtKey]?.name || data.name,
        advice: translationMap[districtKey]?.advice || data.advice 
      };
    }
    return data;
  };

  const textTranslation = {
    en: {
      localTime: "LOCAL TIME",
      yalaPeak: "Yala Kanna Peak",
      weatherTitle: "Climate & Soil Checker",
      interactive: "Interactive",
      selectRegion: "Select Region / District",
      cerealRain: "Rain Risk Probability",
      windSpeed: "Active Wind Velocity",
      relativeHumidity: "Relative Humidity",
      evapIndex: "Evapotranspiration Index",
      soilMoisture: "Topsoil Organic Moisture",
      activePlotsTitle: "Your Active Land Plots",
      activePlotsSubtitle: "Select or register your farm divisions to serve as soil context across the advisory models.",
      closeForm: "Close Form",
      registerBtn: "Register Brand New Plot",
      plotNameLabel: "Plot / Field Name",
      plotPlaceholder: "e.g., Maha Paddy Field A, Chili Bed Frontyard",
      landSizeLabel: "Land Size (Acres)",
      waterSourceLabel: "Water Source / Supply",
      agroZoneLabel: "Agro-Ecological Province Zone",
      soilCategoryLabel: "Predominant Soil Category",
      confirmReg: "Confirm Registration",
      plotCardTitle: "PLOT CONTEXT CARD",
      decommissionPlot: "Decommission plot",
      selectedContext: "Selected Context",
      clickToSelect: "Click to select",
      noPlotsTitle: "No plots registered yet",
      noPlotsDesc: "Aswanna operates fully locally first. Register a crop field partition above to trigger targeted AI soil, weather, and yield forecasting algorithms.",
      remindersTitle: "Daily Work Reminders & Task Tracker",
      remindersDesc: "Manage day-to-day tilling, weeding, solar greenhouse checks, and vaccine alerts.",
      tasksExecuted: "Tasks Executed",
      placeholderAddTask: "Add custom agronomic task (e.g., Water paddy field A nursery beds, Apply local organic repellant)...",
      addTaskBtn: "Add Task",
      checkedClear: "All daily tilling and watering is checked clear!",
      removeTask: "Remove task",
      corePillarsTitle: "Core Pillars of Sri Lankan Regenerative Farming",
      pillar1Title: "1. Gliricidia Integration (Pela)",
      pillar1Desc: "Utilize Gliricidia sepium leaves as instant nitrogenous green manure. Intercropping provides deep organic tilling and shades roots during intense Yala dry spells.",
      pillar2Title: "2. Biochar Soil Carbon Locking",
      pillar2Desc: "Convert coconut husks and paddy straw into raw biochar. Mixed into sandy soil, it locks precious trace nutrients, raises cation exchange capacity, and holds dew moisture.",
      pillar3Title: "3. Multi-Tier Agroforestry",
      pillar3Desc: "Combine root vegetables, leafy kankun, chili lines, and coconut covers. Vertical layering stabilizes moisture, prevents topsoil erosion, and lowers ambient heat indices."
    },
    si: {
      localTime: "ප්‍රාදේශීය වේලාව",
      yalaPeak: "යල කන්නයේ උපරිමය",
      weatherTitle: "කාලගුණ සහ පස් පරීක්ෂකය",
      interactive: "අන්තර්ක්‍රියාකාරී",
      selectRegion: "දිස්ත්‍රික්කය තෝරන්න",
      cerealRain: "වර්ෂාපතන අවදානම",
      windSpeed: "සුළඟේ වේගය",
      relativeHumidity: "සාපේක්ෂ ආර්ද්‍රතාවය",
      evapIndex: "වාෂ්පීකරණ දර්ශකය",
      soilMoisture: "පස් තෙතමනය",
      activePlotsTitle: "ඔබේ සක්‍රීය භූමි බිම්",
      activePlotsSubtitle: "අනාවැකි සහ කෘෂි උපදෙස් සඳහා ඔබගේ කෙත් බිම් තෝරා ගන්න හෝ මෙහි ලියාපදිංචි කරන්න.",
      closeForm: "පෝරමය වසන්න",
      registerBtn: "නව වගා බිමක් එක් කරන්න",
      plotNameLabel: "වගා බිමේ / කුඹුරේ නම",
      plotPlaceholder: "උදා: මහා කුඹුර, ඉදිරිපස මිරිස් පාත්තිය",
      landSizeLabel: "භූමි ප්‍රමාණය (අක්කර)",
      waterSourceLabel: "ජල මූලාශ්‍රය / සැපයුම",
      agroZoneLabel: "කෘෂි-පරිසර කලාපය",
      soilCategoryLabel: "ප්‍රධාන පස් කාණ්ඩය",
      confirmReg: "ලියාපදිංචිය තහවුරු කරන්න",
      plotCardTitle: "වගා බිම් තොරතුරු පත",
      decommissionPlot: "භූමිය ඉවත් කරන්න",
      selectedContext: "තෝරාගත් භූමිය",
      clickToSelect: "තෝරා ගැනීමට ක්ලික් කරන්න",
      noPlotsTitle: "තවමත් ලියාපදිංචි කළ කෙත් බිම් නොමැත",
      noPlotsDesc: "අස්වන්න පද්ධතිය මුලින්ම ඔබගේ උපකරණයේ ක්‍රියාත්මක වේ. කෙත් බිම් ලියාපදිංචි කිරීමෙන් පසුව ඒ සඳහා විශේෂිත නිර්දේශ ක්‍රියාත්මක වේ.",
      remindersTitle: "දෛනික වැඩ සටහන සහ කාර්යයන්",
      remindersDesc: "වල් පැලෑටි පාලනය, වාරිමාර්ග සැපයීම සහ අනෙකුත් ගොවි කාර්යයන් මෙහි සටහන් කර කළමනාකරණය කරන්න.",
      tasksExecuted: "කාර්යයන් නිම කර ඇත",
      placeholderAddTask: "නව කෘෂිකාර්මික කාර්යයක් එක් කරන්න (උදා: පැළ වලට වතුර දැමීම, කාබනික කෘමිනාශක යෙදීම)...",
      addTaskBtn: "එක් කරන්න",
      checkedClear: "සියලුම දෛනික කාර්යයන් සාර්ථකව අවසන් කර ඇත!",
      removeTask: "කාර්යය ඉවත් කරන්න",
      corePillarsTitle: "ශ්‍රී ලාංකේය තිරසාර කෘෂිකර්මාන්තයේ ප්‍රධාන සන්ධිස්ථාන",
      pillar1Title: "1. වැටහිරියා (Gliricidia) භාවිතය",
      pillar1Desc: "වැටහිරියා කොළ හරිත පොහොරක් ලෙස කෙලින්ම පසට එක් කරන්න. මෙය පසට නයිට්‍රජන් ලබා දෙන අතර පාත්ති සිසිල්ව තබයි.",
      pillar2Title: "2. දහයියා සහ පොල්කටු අඟුරු (Biochar)",
      pillar2Desc: "දහයියා සහ පොල්කටු අඟුරු බවට පත් කර පසට එක් කිරීමෙන් පසෙහි ජල රඳවා ගැනීමේ හැකියාව සහ සරු බව වැඩිවේ.",
      pillar3Title: "3. බහු-ස්ථර වගා ක්‍රමය",
      pillar3Desc: "විවිධ උසින් යුත් බෝග (උදා: පොල් ගස් යට ඉඟුරු, මිරිස්) එකට වගා කිරීමෙන් පස සෝදා යාම වැළකෙන අතර තෙතමනය රැඳේ."
    },
    ta: {
      localTime: "உள்ளூர் நேரம்",
      yalaPeak: "யால பருவத்தின் உச்சம்",
      weatherTitle: "காலநிலை மற்றும் மண் சரிபார்ப்பு",
      interactive: "நேரடி",
      selectRegion: "மாவட்டத்தை தேர்வு செய்க",
      cerealRain: "மழை பெய்யும் ஆபத்து",
      windSpeed: "காற்றின் வேகம்",
      relativeHumidity: "சார்பு ஈரப்பதம்",
      evapIndex: "நீராவிப்போக்கு குறியீடு",
      soilMoisture: "மண் ஈரப்பதம்",
      activePlotsTitle: "உங்களின் செயலில் உள்ள நிலங்கள்",
      activePlotsSubtitle: "விவசாய ஆலோசனைகளைப் பெற உங்களின் நிலங்களைத் தேர்வு செய்யவும் அல்லது பதிவு செய்யவும்.",
      closeForm: "படிவத்தை மூடு",
      registerBtn: "புதிய நிலத்தை பதிவு செய்க",
      plotNameLabel: "நிலத்தின் / வயலின் பெயர்",
      plotPlaceholder: "எ.கா: மகா வயல் ஏ, மிளகாய் பாத்தி",
      landSizeLabel: "நில அளவு (ஏக்கர்)",
      waterSourceLabel: "நீர் ஆதாரம் / விநியோகம்",
      agroZoneLabel: "விவசாய-சுற்றுச்சூழல் மண்டலம்",
      soilCategoryLabel: "முக்கிய மண் வகை",
      confirmReg: "பதிவை உறுதிப்படுத்துக",
      plotCardTitle: "நில விவர அட்டை",
      decommissionPlot: "பதிவை நீக்கு",
      selectedContext: "தேர்வு செய்யப்பட்ட நிலம்",
      clickToSelect: "தேர்வு செய்ய கிளிக் செய்க",
      noPlotsTitle: "இன்னும் நிலங்கள் எதுவும் பதிவு செய்யப்படவில்லை",
      noPlotsDesc: "பயிர்க் காணிப் பிரிவை மேலே பதிவு செய்வதன் மூலம் துல்லியமான மண், வானிலை மற்றும் மகசூல் கணிப்புகளைப் பெறலாம்.",
      remindersTitle: "தினசரி நினைவூட்டல் & பணி கண்காணிப்பு",
      remindersDesc: "தினசரி உழுதல், களை எடுத்தல், தண்ணீர் பாய்ச்சுதல் மற்றும் தடுப்பூசி எச்சரிக்கைகளை நிர்வகிக்கவும்.",
      tasksExecuted: "பணிகள் முடிக்கப்பட்டன",
      placeholderAddTask: "புதிய விவசாயப் பணியைச் சேர்க்கவும் (எ.கா: தண்ணீர் பாய்ச்சுதல், கரிம உரம் இடுதல்)...",
      addTaskBtn: "சேர்",
      checkedClear: "இன்றைய பணிகள் அனைத்தும் வெற்றிகரமாக முடிக்கப்பட்டன!",
      removeTask: "பணியை நீக்கு",
      corePillarsTitle: "இலங்கை நிலையான விவசாயத்தின் முக்கிய தூண்கள்",
      pillar1Title: "1. கிளைரிசிடியா பசுந்தாள் உரம்",
      pillar1Desc: "கிளைரிசிடியா இலைகளை மண்ணுக்கு நைட்ரஜன் உரமாகப் பயன்படுத்துங்கள். இது மண்ணின் ஈரப்பதத்தைப் பாதுகாக்கிறது.",
      pillar2Title: "2. உமி மற்றும் தேங்காய் சிரட்டை கரி",
      pillar2Desc: "சிரட்டை மற்றும் உமியைக் கரியாக்கி மண்ணில் சேர்ப்பதன் மூலம் நீர்ப்பிடிப்புத் திறனும் சத்துக்களும் அதிகரிக்கின்றன.",
      pillar3Title: "3. ப அடுக்கு பயிர்ச்செய்கை",
      pillar3Desc: "உயரமான தென்னை மரங்களின் கீழ் மிளகாய் அல்லது இஞ்சி போன்ற பயிர்களை வளர்ப்பதன் மூலம் மண்ணின் வெப்பம் குறையும்."
    }
  };

  const curText = textTranslation[lang] || textTranslation.en;

  const getReminderText = (r: any) => {
    if (r.id === "rem-1") {
      return lang === "si" 
        ? "සවස් කාලයේ ඇතිවිය හැකි අධික වර්ෂාවෙන් ආරක්ෂා වීමට ඇළ මාර්ග පිරිසිදු කරන්න" 
        : lang === "ta" 
          ? "மாலை நேர மழையிலிருந்து பாதுகாக்க வடிகால் வாய்க்கால்களை சுத்தம் செய்யவும்" 
          : r.task;
    }
    if (r.id === "rem-2") {
      return lang === "si" 
        ? "තවාන් සඳහා කාබනික කොම්පෝස්ට් යෙදීමට පෙර පසෙහි pH අගය පරීක්ෂා කරන්න" 
        : lang === "ta" 
          ? "நாற்றங்கால் உரம் இடுவதற்கு முன் மண்ணின் pH அளவை சோதிக்கவும்" 
          : r.task;
    }
    if (r.id === "rem-3") {
      return lang === "si" 
        ? "කෘමි විකර්ෂක සාදා ගැනීම සඳහා වල් කොහොඹ ඇට එකතු කරන්න" 
        : lang === "ta" 
          ? "பூச்சி விரட்டி தயாரிக்க வேப்ப விதைகளை சேகரிக்கவும்" 
          : r.task;
    }
    if (r.id === "rem-4") {
      return lang === "si" 
        ? "මිරිස් වගාවේ කොළ කොඩවීමේ රෝග වාහකයන් කල්තියා හඳුනා ගැනීමට පරීක්ෂා කරන්න" 
        : lang === "ta" 
          ? "மிளகாய் செடிகளில் இலை சுருட்டல் நோய் பரப்பும் பூச்சிகளை கண்காணிக்கவும்" 
          : r.task;
    }
    return r.task;
  };

  const advice = getSeasonAdvisory();
  const weatherData = getTranslatedWeather(selectedDistrict);

  const handleCreatePlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plotName.trim()) return;

    const newPlot: FarmPlot = {
      id: Date.now().toString(),
      name: plotName,
      sizeAcres: parseFloat(plotSize) || 1,
      zone,
      soilType: soil,
      ph: parseFloat(ph) || 6.5,
      nitrogen: n,
      phosphorus: p,
      potassium: k,
      waterSource: water,
    };

    onAddPlot(newPlot);
    setPlotName("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Dynamic Seasonal & Localized Meteorological Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-emerald-800 to-teal-950 text-white p-6 rounded-2xl border border-emerald-700/50 shadow-md">
          <div className="absolute top-0 right-0 -tr-10 opacity-15">
            <Compass className="w-64 h-64 text-emerald-300" />
          </div>

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-500/20 font-extrabold">
                {lang === "si" ? "සෘතුමය වගා මාර්ගෝපදේශය" : lang === "ta" ? "பருவகால சாகுபடி வழிகாட்டி" : "Seasonal Cultivation Directive"}
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight pt-2 flex items-center gap-2 text-emerald-50">
                <CalendarDays className="text-emerald-400 w-6" /> {advice.title}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/95 leading-relaxed">
                {advice.desc}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-right min-w-[140px] shrink-0">
              <span className="text-[10px] font-mono text-emerald-200 block uppercase">{curText.localTime}</span>
              <span className="text-base font-mono font-bold block">{new Date(currentTime).toLocaleDateString()}</span>
              <span className="text-[11px] font-mono text-emerald-300 font-bold block">{curText.yalaPeak}</span>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <h4 className="text-xs font-mono tracking-widest text-emerald-200 uppercase flex items-center gap-1.5 mb-2 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> {translations[lang]?.regionalBroadcasts || "Regional Advisory Broadcasts"}:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {advice.alerts.map((alert, idx) => {
                const parts = alert.split(":");
                return (
                  <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/5 text-xs">
                    <span className="font-extrabold text-emerald-300 block mb-0.5">{parts[0]}</span>
                    <span className="text-emerald-100/80 leading-relaxed">{parts[1]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sri Lankan Meteorological Live Dashboard Card */}
        <div className="bg-white p-6 rounded-2xl border border-emerald-150 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{curText.weatherTitle}</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full">
                {curText.interactive}
              </span>
            </div>

            {/* Select District Dropdown */}
            <div className="mb-4">
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">{curText.selectRegion}</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-black text-slate-805 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-all cursor-pointer"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                {Object.keys(DISTRICT_WEATHER).map((dist) => (
                  <option key={dist} value={dist}>
                    {getTranslatedWeather(dist).name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <Thermometer className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <span className="text-2xl font-display font-black text-gray-800 tracking-tight">
                  {weatherData.temp}
                </span>
                <span className="text-xs text-gray-500 block">
                  {curText.cerealRain}: <span className="font-black text-emerald-700">{weatherData.rainProb}%</span>
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-650 border-t border-gray-100 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{curText.windSpeed}</span>
                <span className="font-mono font-bold text-slate-800">{weatherData.windSpeed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{curText.relativeHumidity}</span>
                <span className="font-mono font-bold text-slate-800">{weatherData.humidity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{curText.evapIndex}</span>
                <span className="font-mono font-bold text-slate-800">{weatherData.evapIndex}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">{curText.soilMoisture}</span>
                <span className="font-mono font-bold text-emerald-750 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100/50">
                  {weatherData.soilMoisture}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-amber-50/70 border border-amber-200/50 rounded-xl p-3 text-[11px] text-amber-900 flex gap-2 items-start">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans">{weatherData.advice}</p>
          </div>
        </div>
      </div>

      {/* Farm Plots Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-xl font-display font-black text-emerald-950 flex items-center gap-2">
              <Sprout className="text-emerald-700 w-5 h-5" /> {curText.activePlotsTitle}
            </h3>
            <p className="text-xs text-gray-500 leading-normal">
              {curText.activePlotsSubtitle}
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            {showAddForm ? <CheckCircle className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showAddForm ? curText.closeForm : curText.registerBtn}
          </button>
        </div>

        {/* Expandable Add Plot Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-50/50 border border-emerald-100 rounded-xl overflow-hidden shadow-xs"
            >
              <form onSubmit={handleCreatePlot} className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-mono text-emerald-800 uppercase mb-1 font-bold">{curText.plotNameLabel}</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-white border border-emerald-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder={curText.plotPlaceholder}
                      value={plotName}
                      onChange={(e) => setPlotName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-emerald-800 uppercase mb-1 font-bold">{curText.landSizeLabel}</label>
                    <input
                      required
                      type="number"
                      step="0.1"
                      min="0.1"
                      className="w-full bg-white border border-emerald-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      value={plotSize}
                      onChange={(e) => setPlotSize(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-emerald-800 uppercase mb-1 font-bold">{curText.waterSourceLabel}</label>
                    <select
                      className="w-full bg-white border border-emerald-200 rounded-lg p-2 text-gray-800 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      value={water}
                      onChange={(e) => setWater(e.target.value)}
                    >
                      <option>{lang === "si" ? "වර්ෂාපතනය පමණි" : lang === "ta" ? "மழை தங்கிய" : "Rainfed Only"}</option>
                      <option>{lang === "si" ? "වැව් වාරිමාර්ග" : lang === "ta" ? "குளத்து நீர்ப்பாசனம்" : "Irrigation Tank (Wewa)"}</option>
                      <option>{lang === "si" ? "ගැඹුරු නළ ළිං" : lang === "ta" ? "நிலத்தடி ஆழ்துளை கிணறு" : "Deep Groundwater Well"}</option>
                      <option>{lang === "si" ? "ගඟෙන් පොම්ප කරන පද්ධති" : lang === "ta" ? "ஆற்று நீரேற்று முறை" : "River Pumped System"}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-emerald-100/80 pt-3">
                  <div>
                    <label className="block text-[11px] font-mono text-emerald-800 uppercase mb-1 font-bold">{curText.agroZoneLabel}</label>
                    <select
                      className="w-full bg-white border border-emerald-200 rounded-lg p-2 text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      value={zone}
                      onChange={(e) => setZone(e.target.value as AgroEcologicalZone)}
                    >
                      {Object.values(AgroEcologicalZone).map((z) => (
                        <option key={z} value={z}>{z}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-emerald-800 uppercase mb-1 font-bold">{curText.soilCategoryLabel}</label>
                    <select
                      className="w-full bg-white border border-emerald-200 rounded-lg p-2 text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      value={soil}
                      onChange={(e) => setSoil(e.target.value as SoilType)}
                    >
                      {Object.values(SoilType).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-1">
                      <label className="block text-[10px] font-mono text-emerald-800 uppercase mb-1 font-bold">pH</label>
                      <input
                        type="number"
                        step="0.1"
                        min="2"
                        max="14"
                        className="w-full bg-white border border-emerald-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        value={ph}
                        onChange={(e) => setPh(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-emerald-800 uppercase mb-1 font-bold">N</label>
                      <select
                        className="w-full bg-white border border-emerald-200 rounded-lg p-1.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        value={n}
                        onChange={(e) => setN(e.target.value)}
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-emerald-800 uppercase mb-1 font-bold">P</label>
                      <select
                        className="w-full bg-white border border-emerald-200 rounded-lg p-1.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        value={p}
                        onChange={(e) => setP(e.target.value)}
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-emerald-805 uppercase mb-1 font-bold">K</label>
                      <select
                        className="w-full bg-white border border-emerald-200 rounded-lg p-1.5 text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        value={k}
                        onChange={(e) => setK(e.target.value)}
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg px-4 py-2 font-bold text-xs transition-all shadow-xs"
                  >
                    {curText.confirmReg}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plots List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plots.map((plot) => {
            const isSelected = activePlot?.id === plot.id;
            return (
              <div
                key={plot.id}
                onClick={() => onSelectPlot(plot)}
                className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between h-[160px] ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/20 shadow-xs"
                    : "border-gray-150 bg-white hover:border-emerald-200 hover:bg-gray-50/40"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">
                        {curText.plotCardTitle}
                      </span>
                      <h4 className="font-display font-bold text-gray-800 text-sm line-clamp-1">{plot.name}</h4>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePlot(plot.id);
                      }}
                      className="text-gray-300 hover:text-rose-500 p-1 rounded-md transition-all"
                      title={curText.decommissionPlot}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-3 text-xs text-gray-650">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-650 flex-shrink-0" />
                      <span className="truncate">{plot.zone.split(" (")[0]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-emerald-650 flex-shrink-0" />
                      <span>{plot.sizeAcres} {translations[lang]?.acres || "Acres"}</span>
                    </div>
                    <div className="flex items-center gap-1 col-span-2">
                      <Droplet className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                      <span className="truncate">{plot.waterSource}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 pt-2 text-[11px]">
                  <div className="flex gap-1.5">
                    <span className="font-mono text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded border border-amber-250/40">
                      PH: {plot.ph}
                    </span>
                    <span className="font-mono text-[9px] bg-slate-100 text-slate-700 px-1 py-0.2 rounded">
                      NPK: {plot.nitrogen[0]}p{plot.phosphorus[0]}k{plot.potassium[0]}
                    </span>
                  </div>
                  {isSelected ? (
                    <span className="text-emerald-700 font-extrabold flex items-center gap-0.5">
                      {curText.selectedContext} <ChevronRight className="w-3" />
                    </span>
                  ) : (
                    <span className="text-gray-400 group-hover:text-gray-600 font-semibold">{curText.clickToSelect}</span>
                  )}
                </div>
              </div>
            );
          })}

          {plots.length === 0 && (
            <div className="col-span-full bg-slate-50/50 border border-dashed border-slate-200 rounded-xl p-8 text-center space-y-3">
              <Sprout className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-750">{curText.noPlotsTitle}</p>
                <p className="text-[11px] text-gray-450 max-w-sm mx-auto leading-normal">
                  {curText.noPlotsDesc}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ⚠️ Daily Work Reminders Workspace Section */}
      <div className="bg-white rounded-2xl border border-gray-150 p-6 space-y-4 shadow-3xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-sm font-mono tracking-widest text-emerald-800 uppercase flex items-center gap-1.5 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> {curText.remindersTitle}
            </h3>
            <p className="text-[11px] text-gray-500 leading-normal">
              {curText.remindersDesc}
            </p>
          </div>
          <span className="font-mono text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-0.5 rounded-full font-black">
            {reminders.filter(r => r.isCompleted).length} / {reminders.length} {curText.tasksExecuted}
          </span>
        </div>

        {/* Form to append new task */}
        <form onSubmit={handleAddReminder} className="flex gap-2">
          <input
            type="text"
            required
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white text-xs"
            placeholder={curText.placeholderAddTask}
            value={newReminderText}
            onChange={(e) => setNewReminderText(e.target.value)}
          />
          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-4 py-2 text-xs font-black transition-all flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> {curText.addTaskBtn}
          </button>
        </form>

        {/* Task listings view */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {reminders.map((r) => (
            <div
              key={r.id}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs gap-3 transition-all ${
                r.isCompleted 
                  ? "bg-slate-50/70 border-slate-100 text-slate-400" 
                  : "bg-white border-gray-150 text-gray-700 hover:border-emerald-250"
              }`}
            >
              <div className="flex items-center gap-3 max-w-[85%]">
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer shrink-0"
                  checked={r.isCompleted}
                  onChange={() => handleToggleReminder(r.id)}
                />
                <span className={`leading-normal ${r.isCompleted ? "line-through italic text-gray-400" : "font-semibold text-gray-700"}`}>
                  {getReminderText(r)}
                </span>
               </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                  {r.date}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteReminder(r.id)}
                  className="text-gray-300 hover:text-rose-500 transition-all p-1"
                  title={curText.removeTask}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {reminders.length === 0 && (
            <p className="text-center py-6 text-gray-400 text-xs italic">{curText.checkedClear}</p>
          )}
        </div>
      </div>

      {/* Sustainable Sri Lankan Agriculture Best-Practices Section */}
      <div className="bg-emerald-50/30 rounded-2xl p-5 border border-emerald-100/50">
        <h4 className="text-xs font-mono tracking-widest text-emerald-800 uppercase flex items-center gap-1.5 mb-3 font-bold">
          <TrendingUp className="w-4 h-4 text-emerald-600" /> {curText.corePillarsTitle}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-emerald-100/50 space-y-1">
            <span className="font-extrabold text-emerald-950 block">{curText.pillar1Title}</span>
            <p className="text-gray-650 leading-relaxed text-[11px]">
              {curText.pillar1Desc}
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-emerald-100/50 space-y-1">
            <span className="font-extrabold text-emerald-950 block">{curText.pillar2Title}</span>
            <p className="text-gray-650 leading-relaxed text-[11px]">
              {curText.pillar2Desc}
            </p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-emerald-100/50 space-y-1">
            <span className="font-extrabold text-emerald-950 block">{curText.pillar3Title}</span>
            <p className="text-gray-650 leading-relaxed text-[11px]">
              {curText.pillar3Desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
