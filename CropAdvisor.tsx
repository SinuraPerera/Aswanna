import React, { useState, useEffect } from "react";
import { FarmPlot, RecommendedCrop, AgroEcologicalZone, SoilType } from "./types";
import { Language, translations } from "./translations";
import { 
  Compass, 
  MapPin, 
  Layers, 
  Flame, 
  TrendingUp, 
  Droplet, 
  DollarSign, 
  Lightbulb, 
  Calculator, 
  Sprout, 
  Clock, 
  ShieldAlert,
  HelpCircle,
  Sparkles,
  RotateCcw,
  BookOpen
} from "lucide-react";
import { motion } from "motion/react";
import AgriKnowledge from "./AgriKnowledge";

interface CropAdvisorProps {
  activePlot: FarmPlot | null;
  plots: FarmPlot[];
  lang: Language;
}

export default function CropAdvisor({ activePlot, plots, lang }: CropAdvisorProps) {
  const t = translations[lang];
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ crops: RecommendedCrop[]; generalSoilAdvisory: string } | null>(null);
  const [subTab, setSubTab] = useState<"ai-recommend" | "knowledge">("ai-recommend");
  
  // Custom states fallback
  const [region, setRegion] = useState("Dry Zone (e.g., Anuradhapura)");
  const [soilType, setSoilType] = useState<SoilType>(SoilType.RED_REDDISH_BROWN);
  const [ph, setPh] = useState(6.2);
  const [nitrogen, setNitrogen] = useState("Medium");
  const [phosphorus, setPhosphorus] = useState("Low");
  const [potassium, setPotassium] = useState("Medium");
  const [waterSource, setWaterSource] = useState("Irrigation Tank (Wewa)");
  const [season, setSeason] = useState("Yala (Southwest monsoon)");

  // Sync with active plot context
  useEffect(() => {
    if (activePlot) {
      setRegion(activePlot.zone);
      setSoilType(activePlot.soilType);
      setPh(activePlot.ph);
      setNitrogen(activePlot.nitrogen);
      setPhosphorus(activePlot.phosphorus);
      setPotassium(activePlot.potassium);
      setWaterSource(activePlot.waterSource);
    }
  }, [activePlot]);

  const handleFetchRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region,
          soilType,
          ph,
          nitrogen,
          phosphorus,
          potassium,
          waterSource,
          season
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      // Fallback is handled directly on server-side, but just in case:
    } finally {
      setLoading(false);
    }
  };

  const getWaterColor = (req: string) => {
    switch (req) {
      case "High": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Medium": return "bg-sky-100 text-sky-800 border-sky-200";
      default: return "bg-teal-50 text-teal-800 border-teal-200";
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "High": return "bg-rose-100 text-rose-800 border-rose-200";
      case "Medium": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-2">
        <div>
          <h3 className="text-xl font-display font-semibold text-emerald-950 flex items-center gap-2">
            <Sparkles className="text-emerald-600 w-5 h-5" /> {lang === "si" ? "අස්වන්න AI බෝග තේරීම" : lang === "ta" ? "அஸ்வன்ன AI பயிர் தெரிவு" : "Aswanna AI Crop Selector"}
          </h3>
          <p className="text-xs text-gray-500">
            {lang === "si" ? "ලංකාවේ පසට ගැළපෙන හොඳම බෝගයන් නිර්දේශ කිරිමට කෘතිම බුද්ධිය (Gemini) සක්‍රිය කරන්න." : lang === "ta" ? "இலங்கை மண்ணுக்கு ஏற்ற சிறந்த பயிர் தேர்வினை செய்ய செயற்கை நுண்ணறிவை பயன்படுத்தவும்." : "Select localized micro-conditions to let Gemini compute high-yielding crops tailored for Sri Lankan soils."}
          </p>
        </div>

        {activePlot && (
          <div className="bg-emerald-50 text-emerald-850 px-3 py-1.5 rounded-full border border-emerald-200 text-xs flex items-center gap-1.5 font-medium">
            <Layers className="w-3.5 h-3.5 text-emerald-600" /> {lang === "si" ? "ක්‍රියාකාරී පස් සන්දර්භය:" : lang === "ta" ? "செயலில் உள்ள மண் சூழல்:" : "Under active soil context:"} <span className="font-bold">{activePlot.name}</span>
          </div>
        )}
      </div>

      {/* Sub-tab selection indicator */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl text-xs font-bold gap-1 self-start w-fit">
        <button
          onClick={() => setSubTab("ai-recommend")}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            subTab === "ai-recommend"
              ? "bg-white text-emerald-950 font-black shadow-2xs"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === "si" ? "AI බෝග තේරීම" : lang === "ta" ? "AI பயிர் முகவரி" : "AI Suitability Advisor"}</span>
        </button>
        <button
          onClick={() => setSubTab("knowledge")}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            subTab === "knowledge"
              ? "bg-white text-emerald-950 font-black shadow-2xs"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
          <span>{lang === "si" ? "කෘෂි හා සත්ව පාලන විශ්වකෝෂය" : lang === "ta" ? "விவசாய & கால்நடை களஞ்சியம்" : "Grow & Husbandry Library"}</span>
        </button>
      </div>

      {subTab === "knowledge" ? (
        <AgriKnowledge lang={lang} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Parameters input form (3 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-gray-150/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider font-bold">
              {lang === "si" ? "පස සහ කලාපීය විචල්‍යයන්" : lang === "ta" ? "மண் & மண்டல மாறிகள்" : "Soil & Zone Variables"}
            </span>
            {activePlot && (
              <button 
                onClick={() => {
                  setRegion(activePlot.zone);
                  setSoilType(activePlot.soilType);
                  setPh(activePlot.ph);
                  setNitrogen(activePlot.nitrogen);
                  setPhosphorus(activePlot.phosphorus);
                  setPotassium(activePlot.potassium);
                  setWaterSource(activePlot.waterSource);
                }}
                className="text-[10px] font-mono text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5"
                title="Reset parameter adjustments back to active registered plot specs"
              >
                <RotateCcw className="w-3" /> {lang === "si" ? "සමමුහුර්ත කරන්න" : lang === "ta" ? "ஒத்திசைக்குக" : "Sync Plot Context"}
              </button>
            )}
          </div>

          <form onSubmit={handleFetchRecommendations} className="space-y-2.5 text-xs text-gray-700">
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-0.5">
                {lang === "si" ? "කෘෂි දේශගුණික පලාත" : lang === "ta" ? "விவசாய காலநிலை மண்டலம்" : "Sri Lanka Agro Zone"}
              </label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-800"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                {Object.values(AgroEcologicalZone).map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-0.5">
                {lang === "si" ? "ප්‍රධාන පස් කාණ්ඩය" : lang === "ta" ? "முக்கிய மண் வகை" : "Primary Soil Class"}
              </label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-800"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as SoilType)}
              >
                {Object.values(SoilType).map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-0.5">
                  {lang === "si" ? "පසෙහි pH අගය" : lang === "ta" ? "மண்ணின் pH அளவு" : "Soil pH Scale"}
                </label>
                <input 
                  type="number"
                  step="0.1"
                  min="3"
                  max="10"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-800"
                  value={ph}
                  onChange={(e) => setPh(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-0.5">
                  {lang === "si" ? "වගා කන්නය" : lang === "ta" ? "பயிரிடல் பருவம்" : "Sowing Season"}
                </label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-800 font-bold text-emerald-800"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                >
                  <option value="Yala (Southwest monsoon)">{lang === "si" ? "යල කන්නය" : lang === "ta" ? "யால பருவம்" : "Yala (Southwest monsoon)"}</option>
                  <option value="Maha (Northeast monsoon)">{lang === "si" ? "මහ කන්නය" : lang === "ta" ? "மகா பருவம்" : "Maha (Northeast monsoon)"}</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">{t.npkScores}</span>
              <div className="grid grid-cols-3 gap-1.5">
                <div>
                  <span className="text-[9px] font-mono text-gray-400 block mb-0.5">Nitrogen (N)</span>
                  <select 
                    className="w-full bg-white border border-gray-250 rounded p-1"
                    value={nitrogen}
                    onChange={(e) => setNitrogen(e.target.value)}
                  >
                    <option value="Low">{lang === "si" ? "අඩු" : lang === "ta" ? "குறைவு" : "Low"}</option>
                    <option value="Medium">{lang === "si" ? "මධ්‍යම" : lang === "ta" ? "மத்திமம்" : "Medium"}</option>
                    <option value="High">{lang === "si" ? "ඉහළ" : lang === "ta" ? "அதிகம்" : "High"}</option>
                  </select>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-gray-400 block mb-0.5">Phos (P)</span>
                  <select 
                    className="w-full bg-white border border-gray-250 rounded p-1"
                    value={phosphorus}
                    onChange={(e) => setPhosphorus(e.target.value)}
                  >
                    <option value="Low">{lang === "si" ? "අඩු" : lang === "ta" ? "குறைவு" : "Low"}</option>
                    <option value="Medium">{lang === "si" ? "මධ්‍යම" : lang === "ta" ? "மத்திமம்" : "Medium"}</option>
                    <option value="High">{lang === "si" ? "ඉහළ" : lang === "ta" ? "அதிகம்" : "High"}</option>
                  </select>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-gray-400 block mb-0.5">Potas (K)</span>
                  <select 
                    className="w-full bg-white border border-gray-250 rounded p-1"
                    value={potassium}
                    onChange={(e) => setPotassium(e.target.value)}
                  >
                    <option value="Low">{lang === "si" ? "අඩු" : lang === "ta" ? "குறைவு" : "Low"}</option>
                    <option value="Medium">{lang === "si" ? "මධ්‍යම" : lang === "ta" ? "மத்திமம்" : "Medium"}</option>
                    <option value="High">{lang === "si" ? "ඉහළ" : lang === "ta" ? "அதிகம்" : "High"}</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-0.5">
                {lang === "si" ? "ජල මූලාශ්‍රය" : lang === "ta" ? "நீர் ஆதாரம்" : "Water Source Irrigation"}
              </label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-800"
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
              >
                <option value="Rainfed Only">{lang === "si" ? "වැසි ජලයෙන් පමණි" : lang === "ta" ? "மழைநீர் மட்டும்" : "Rainfed Only"}</option>
                <option value="Irrigation Tank (Wewa)">{lang === "si" ? "වැවෙන් (වාරිමාර්ග)" : lang === "ta" ? "நீர்ப்பாசன குளம்" : "Irrigation Tank (Wewa)"}</option>
                <option value="Deep Groundwater Well">{lang === "si" ? "ගැඹුරු ලිඳ" : lang === "ta" ? "ஆழ்துளை கிணறு" : "Deep Groundwater Well"}</option>
                <option value="River Pumped System">{lang === "si" ? "ගඟෙන් පොම්ප කරන ක්‍රමය" : lang === "ta" ? "ஆற்றிலிருந்து இறைத்தல்" : "River Pumped System"}</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-medium py-2 rounded-lg text-xs mt-4 flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                  {lang === "si" ? "තොරතුරු විශ්ලේෂණය කරමින්..." : lang === "ta" ? "பகுப்பாய்வு செய்கிறது..." : "Generating Predictions..."}
                </>
              ) : (
                <>
                  <Sprout className="w-4 h-4" /> {lang === "si" ? "බෝග ගැළපුම විශ්ලේෂණය කරන්න" : lang === "ta" ? "பயிர் பொருத்தத்தை பகுப்பாய்வு செய்க" : "Analyse Crop Suitability"}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results (8 cols) */}
        <div className="lg:col-span-8">
          {loading && (
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-12 text-center flex flex-col justify-center items-center h-[420px] space-y-4">
              <div className="relative">
                <Compass className="w-16 h-16 text-emerald-700 animate-spin" style={{ animationDuration: "12s" }} />
                <Sprout className="w-6 h-6 text-emerald-500 absolute top-5 left-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="font-display font-bold text-gray-800 text-base">
                  {lang === "si" ? "අස්වන්න බෝග අනාවැකි පද්ධතිය සක්‍රීයයි" : lang === "ta" ? "அஸ்வன்ன பயிர் கணிப்புத் தளம்" : "Aswanna Agronomic Predictor Online"}
                </p>
                <p className="text-xs text-emerald-700 max-w-sm font-mono tracking-wide animate-pulse">
                  &quot;{t.loadingAdvisor}&quot;
                </p>
              </div>

              <div className="max-w-md bg-white border border-emerald-100/50 rounded-xl p-4 text-left text-xs space-y-1.5 shadow-2xs">
                <span className="text-[10px] text-emerald-600 font-mono font-bold tracking-wider block uppercase">
                  {lang === "si" ? "සාම්ප්‍රදායික ගොවි නැණ නුවණ" : lang === "ta" ? "பாரம்பரிய விவசாய அறிவு" : "Sri Lankan Farming Wisdom"}
                </span>
                <p className="text-gray-600 leading-relaxed text-[11.5px]">
                  {lang === "si" 
                    ? "සාම්ප්‍රදායික ශ්‍රී ලාංකීය ගොවීන් 'කේර වැපිරීමේ' ක්‍රමය අනුගමනය කළහ. වී ලියදි අතර මුං ඇට, කව්පි වැනි බෝග වගා කිරීමෙන් වල් පැලෑටි පාලනය කර පසෙහි නයිට්‍රජන් ස්වභාවිකව රැකගැනීමට හැකි විය." 
                    : lang === "ta" 
                      ? "பாரம்பரிய இலங்கை விவசாயிகள் 'கேர விதைப்பு' முறையை பின்பற்றினர். நெல் வரம்புகளில் உளுந்து, தட்டைப்பயிர் போன்ற பயிர்களை ஊடுபயிராக வளர்ப்பதன் மூலம் களைகளைக் கட்டுப்படுத்தி நைதரசன் சத்தினை இயற்கையாகப் பாதுகாத்தனர்." 
                      : "Did you know? Traditional Sri Lankan farmers practiced the \"Kera Sowing\" regime. Interspersing diverse legumes (like cowpea or black gram) alongside rice bunds helped control weeds and secured trace nutrients completely naturally."}
                </p>
              </div>
            </div>
          )}

          {!loading && !results && (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-16 text-center space-y-3 h-[420px] flex flex-col justify-center items-center">
              <Sprout className="w-12 h-12 text-slate-350" />
              <div className="space-y-1 max-w-md">
                <p className="font-display font-semibold text-gray-700 text-sm">
                  {lang === "si" ? "දත්ත ඇතුළත් කරන තෙක් බලා සිටී" : lang === "ta" ? "தரவுகளுக்காக காத்திருக்கிறது" : "Awaiting Variable Configuration"}
                </p>
                <p className="text-xs text-gray-400">
                  {t.awaitingVars}
                </p>
              </div>
            </div>
          )}

          {!loading && results && (
            <div className="space-y-6">
              {/* General soil advisory card */}
              <div className="bg-emerald-50/70 p-4.5 rounded-xl border border-emerald-100 text-xs text-emerald-950 flex gap-3">
                <Lightbulb className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-800 block">
                    {lang === "si" ? "ප්‍රධාන කෘෂි උපදේශන වාර්තාව" : lang === "ta" ? "முக்கிய விவசாய ஆலோசனை அறிக்கை" : "General Agronomist Advisory Report"}
                  </span>
                  <p className="leading-relaxed font-sans text-[11.5px] text-gray-700">{results.generalSoilAdvisory}</p>
                </div>
              </div>

              {/* Crop list hierarchy */}
              <div className="space-y-4">
                {results.crops.map((crop, index) => {
                  return (
                    <motion.div
                      key={crop.name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs hover:border-emerald-200 relative overflow-hidden transition-all"
                    >
                      {/* Ribbon banner indicating preference selection score */}
                      <div className="absolute top-0 right-0 bg-emerald-600 text-white px-3 py-1 rounded-bl-xl text-xs font-mono font-bold">
                        {t.suitabilityScore}: {crop.suitabilityScore}%
                      </div>

                      <div className="space-y-4">
                        {/* Header titles */}
                        <div className="space-y-0.5 max-w-[80%]">
                          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">{crop.scientificName}</span>
                          <h4 className="font-display font-extrabold text-base text-gray-800">{crop.name}</h4>
                        </div>

                        {/* Badges parameters */}
                        <div className="flex flex-wrap gap-2 text-[10.5px]">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-emerald-600" /> {crop.durationDays} {lang === "si" ? "දින" : lang === "ta" ? "நாட்கள்" : "Days"}
                          </span>
                          <span className={`border px-2 py-0.5 rounded flex items-center gap-1 font-mono ${getWaterColor(crop.waterRequirement)}`}>
                            <Droplet className="w-3 h-3 text-sky-600" /> {lang === "si" ? "ජලය" : lang === "ta" ? "நீர்" : "Water"}: {
                              crop.waterRequirement === "High" ? (lang === "si" ? "ඉහළ" : lang === "ta" ? "அதிகம்" : "High") :
                              crop.waterRequirement === "Medium" ? (lang === "si" ? "මධ්‍යම" : lang === "ta" ? "மத்திமம்" : "Medium") :
                              (lang === "si" ? "අඩු" : lang === "ta" ? "குறைவு" : "Low")
                            }
                          </span>
                          <span className={`border px-2 py-0.5 rounded flex items-center gap-1 font-mono ${getDemandColor(crop.marketDemand)}`}>
                            <TrendingUp className="w-3 h-3" /> {lang === "si" ? "ඉල්ලුම" : lang === "ta" ? "தேவை" : "Demand"}: {
                              crop.marketDemand === "High" ? (lang === "si" ? "ඉහළ" : lang === "ta" ? "அதிகம்" : "High") :
                              crop.marketDemand === "Medium" ? (lang === "si" ? "මධ්‍යම" : lang === "ta" ? "மத்திமம்" : "Medium") :
                              (lang === "si" ? "ස්ථාවර" : lang === "ta" ? "வழமையான" : "Stable")
                            }
                          </span>
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1 font-mono font-bold">
                            <DollarSign className="w-3 h-3 text-amber-600" /> {crop.avgSellingPrice}
                          </span>
                        </div>

                        {/* Content Split: Reasons vs. Guidelines */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-3 text-[11px] text-gray-600">
                          <div className="space-y-2">
                            <span className="font-bold text-gray-800 block text-xs uppercase tracking-wider font-display">{t.whyFits}</span>
                            <ul className="space-y-1.5 list-disc pl-4 leading-relaxed">
                              {crop.reasons.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>

                            <div className="bg-amber-50/50 p-2.5 rounded border border-amber-100 text-[10px] text-amber-900 mt-2">
                              <span className="font-mono font-bold block mb-0.5">{lang === "si" ? "පොහොර යෙදීමේ වට්ටෝරුව" : lang === "ta" ? "உர பரிந்துரை விபரம்" : "NPK SPLIT PRESCRIPTION"}</span>
                              <p className="leading-relaxed font-sans">{crop.fertilizerSplit}</p>
                            </div>
                          </div>

                          <div className="space-y-2 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                            <span className="font-bold text-gray-800 block text-xs uppercase tracking-wider font-display flex items-center gap-1">
                              <Calculator className="w-3.5 h-3.5 text-emerald-600" /> {t.plantingTips}
                            </span>
                            <ul className="space-y-1.5 leading-relaxed text-[11px]">
                              {crop.plantingTips.map((tip, i) => (
                                <li key={i} className="flex gap-1.5">
                                  <span className="text-emerald-700 font-bold">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                            
                            <div className="border-t border-dashed border-slate-200 mt-2.5 pt-2 flex justify-between items-center text-[10px] text-slate-500">
                              <span>{t.estYield}:</span>
                              <span className="font-mono font-bold text-slate-800">{crop.estYield}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);
}
