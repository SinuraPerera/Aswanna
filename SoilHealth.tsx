import React, { useState } from "react";
import { FarmPlot, SoilReport } from "../types";
import { Language, translations } from "../translations";
import { 
  Dna, 
  MapPin, 
  Settings, 
  Atom, 
  Activity, 
  Sliders, 
  Compass, 
  Info, 
  Award, 
  Sparkles,
  RefreshCw,
  HeartCrack,
  GraduationCap
} from "lucide-react";
import { motion } from "motion/react";

interface SoilHealthProps {
  activePlot: FarmPlot | null;
  lang: Language;
}

export default function SoilHealth({ activePlot, lang }: SoilHealthProps) {
  const t = translations[lang];
  const [currentCrops, setCurrentCrops] = useState(activePlot?.currentCrop || "Vegetables & Chili");
  const [organicMatter, setOrganicMatter] = useState("Low - visible sand leaching");
  const [drainage, setDrainage] = useState("Sandy Reddish Earth, porous drainage");
  const [reportNotes, setReportNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SoilReport | null>(null);

  const handleSoilConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReport(null);

    try {
      const response = await fetch("/api/soil-advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentCrops,
          organicMatter,
          drainage,
          reportNotes
        })
      });

      if (!response.ok) {
        throw new Error("Soil advisory failed");
      }

      const data = await response.json();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMeterBg = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("low")) return "bg-rose-500";
    if (s.includes("optimal") || s.includes("ideal")) return "bg-emerald-500";
    return "bg-amber-500";
  };

  const getMeterPercent = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("low")) return "w-1/3";
    if (s.includes("optimal") || s.includes("ideal")) return "w-full";
    return "w-2/3";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-2">
        <div>
          <h3 className="text-xl font-display font-semibold text-emerald-950 flex items-center gap-2">
            <Atom className="text-emerald-700 w-5 h-5 animate-spin" style={{ animationDuration: "15s" }} /> {lang === "si" ? "පස් සෞඛ්‍ය උපදේශන සායනය" : lang === "ta" ? "மண் பரிசோதனை மற்றும் ஆலோசனை" : "Aswanna Smart Soil Clinic"}
          </h3>
          <p className="text-xs text-gray-500">
            {lang === "si" ? "පසෙහි කාබනික කාබන් වියුහය වැඩිදියුණු කිරීමට, ඩොලමයිට් ප්‍රතිශතය පරීක්ෂා කිරීමට සහ ස්වභාවික පොහොර මිශ්‍රණ සකස් කිරීමට දත්ත ඇතුළත් කරන්න." : lang === "ta" ? "மண்ணின் கரிம கார்பன் மட்டங்களை மேம்படுத்தவும், டோலோமைட்டின் பயன்பாட்டு அளவுகளை சரிபார்க்கவும், தாவர போக்கினங்களை ஆராயவும்." : "Formulate targeted soil carbon amendment regimes, check Dolomite application weights, and build customized biological compost blends."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input variables panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-150 p-5 shadow-xs space-y-4">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold">
            {lang === "si" ? "පස් ගුණාංග ඇතුළත් කිරීම්" : lang === "ta" ? "மண் கூறுகள் உள்ளீடு" : "Soil Properties Input"}
          </span>

          <form onSubmit={handleSoilConsultation} className="space-y-3.5 text-xs text-gray-700">
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-0.5">
                {lang === "si" ? "වගා කරන ඉලක්කගත බෝග" : lang === "ta" ? "பயிரிட உத்தேசித்துள்ள பயிர்கள்" : "Target Crops Cultivated"}
              </label>
              <input
                required
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-850"
                placeholder="e.g., Sambha Rice Paddy, Chilies & Brinjals"
                value={currentCrops}
                onChange={(e) => setCurrentCrops(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-0.5">
                {lang === "si" ? "පසෙහි කාබනික ද්‍රව්‍ය මට්ටම" : lang === "ta" ? "மண்ணின் கரிமப் பொருள் அளவு" : "Soil Organic Matter Level"}
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-850"
                value={organicMatter}
                onChange={(e) => setOrganicMatter(e.target.value)}
              >
                <option value="Low - visible sand leaching, weak structural binding">
                  {lang === "si" ? "අඩු - වැලි සහිතයි, සෝදා හැලීම් පවතී" : lang === "ta" ? "குறைவு - மணல் அரிப்பு கொண்டது" : "Low - visible sand leaching, weak structural binding"}
                </option>
                <option value="Medium - standard garden soil, holds structure briefly">
                  {lang === "si" ? "මධ්‍යම - සාමාන්‍ය ගෙවතු පස" : lang === "ta" ? "மத்திமம் - சாதாரண தோட்டம் மண்" : "Medium - standard garden soil, holds structure briefly"}
                </option>
                <option value="High - rich dark soil, abundant peat or manure remains">
                  {lang === "si" ? "ඉහළ - අඳුරු සාරවත් පස, කොම්පෝස්ට් පිරි" : lang === "ta" ? "அதிகம் - அடர் வளமானPeat அல்லது மண்புழு உரம்" : "High - rich dark soil, abundant peat or manure remains"}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-0.5">
                {lang === "si" ? "පස් ව්‍යුහය සහ ජලාපවහනය" : lang === "ta" ? "மண் அமைப்பு மற்றும் வடிகால்" : "Soil Texture & Drainage"}
              </label>
              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-850"
                value={drainage}
                onChange={(e) => setDrainage(e.target.value)}
              >
                <option value="Sandy Reddish Earth, porous drainage, rapid water leaching">
                  {lang === "si" ? "වැලි සහිත රතු බොරළු පස, සීඝ්‍ර ජල ගැල්ම" : lang === "ta" ? "செம்மண் மணல், விரைவான வடிகால்" : "Sandy Reddish Earth, porous drainage, rapid water leaching"}
                </option>
                <option value="Silt Loam, balanced retention & breathing">
                  {lang === "si" ? "හීන් වැලි මැටි පස (හුදෙස්), සමබර රඳවා ගැනීම" : lang === "ta" ? "வண்டல் மண், சமநிலை நீர் தக்கவைப்பு" : "Silt Loam, balanced retention & breathing"}
                </option>
                <option value="Heavy clay (e.g. paddy bedding), high waterlogging tendency">
                  {lang === "si" ? "බරැති මැටි පස (කුඹුරු පස), ජලය රැඳීම වැඩියි" : lang === "ta" ? "களிமண், அதிக நீர் தேங்கும் தன்மை" : "Heavy clay (e.g. paddy bedding), high waterlogging tendency"}
                </option>
                <option value="Black alluvial, superior absorption">
                  {lang === "si" ? "කළු රෝන් මැටි පස, ඉහළ අවශෝෂණය" : lang === "ta" ? "கருப்பு வண்டல் மண், சிறந்த உறிஞ்சுதல்" : "Black alluvial, superior absorption"}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-0.5">
                {lang === "si" ? "වෛකල්පිත රසායනාගාර වාර්තා දත්ත" : lang === "ta" ? "விருப்ப ஆய்வக அறிக்கை விபரங்கள்" : "Optional Lab Report Details"}
              </label>
              <textarea
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-850"
                placeholder={lang === "si" ? "රසායනාගාර පරීක්ෂණ මඟින් ලද නයිට්‍රජන්, පොස්පරස්, පොටෑසියම් හෝ ලවණතා අගයන් ඇත්නම් මෙහි සටහන් කරන්න..." : lang === "ta" ? "உங்கள் மண்ணின் நைட்ரஜன், பாஸ்பரஸ், பொட்டாசியம் போன்ற பரிசோதனை முடிவுகள் இருப்பின் இங்கே பதியலாம்..." : "If you possess nitrogen, phosphorus, electrical conductivity, or clay moisture values from local laboratories, paste or note them here..."}
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white font-medium py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {lang === "si" ? "රසායන විශ්ලේෂණය සිදුවෙමින් පවතී..." : lang === "ta" ? "மண் பரிசோதனை செய்யப்படுகிறது..." : "Performing Chemical Diagnostics..."}
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5" /> {lang === "si" ? "පසෙහි රසායන ස්වභාවය විමසන්න" : lang === "ta" ? "மண் வேதியியல் கண்டறிக" : "Diagnose Soil Chemistry"}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Diagnostic Amendment Report Panel (7 cols) */}
        <div className="lg:col-span-12 xl:col-span-7">
          {loading && (
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-12 text-center flex flex-col justify-center items-center h-[460px] space-y-4">
              <Dna className="w-16 h-16 text-emerald-700 animate-spin" style={{ animationDuration: "6s" }} />
              <div className="space-y-1">
                <p className="font-display font-bold text-gray-800 text-base">
                  {lang === "si" ? "ක්ෂුද්‍ර පෝෂක අනුපාත ගණනය කරමින්" : lang === "ta" ? "நுண்ணூட்டச் சத்து விகிதங்கள் கணக்கிடப்படுகிறது" : "Formulating Micro-Nutrient Ratios"}
                </p>
                <p className="text-xs text-emerald-850 font-mono tracking-wide">
                  &quot;{lang === "si" ? "පසෙහි කාබනික කාබන් සමතුලිතතාව සාම්ප්‍රදායික මිශ්‍රණ සමඟ සසඳමින්..." : lang === "ta" ? "பாரம்பரிய உரம் சூத்திரங்களுடன் ஒப்பிடப்படுகிறது..." : "Comparing organic carbon balances vs traditional compost formulas..."}&quot;
                </p>
              </div>
            </div>
          )}

          {!loading && !report && (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-16 text-center space-y-3 h-[460px] flex flex-col justify-center items-center">
              <Sparkles className="w-12 h-12 text-slate-350" />
              <div className="space-y-1 max-w-sm">
                <p className="font-display font-semibold text-gray-700 text-sm">
                  {lang === "si" ? "පස් සාරවත්භාවය විශ්ලේෂණය තෙක් බලා සිටී" : lang === "ta" ? "மண் வளம் இயந்திரம் காத்திருக்கிறது" : "Soil Fertility Engine Awaiting"}
                </p>
                <p className="text-xs text-gray-400">
                  {lang === "si" ? "වම්පසින් ඔබගේ වගා දත්ත සහ භෞතික තත්ත්වයන් ඇතුළත් කරන්න. අස්වන්න පස් උපදේශකයන් විසින් තිරසාර අස්වැන්නක් සඳහා කාබන් ග්‍රහණ උපදෙස් ලබා දෙනු ඇත." : lang === "ta" ? "இடப்பக்கத்தில் பயிர் விபரங்கள் மற்றும் கரிம நிலைமைகளை உள்ளிடவும். அஸ்வன்ன மண் நிபுணர்கள் கார்பன் பிடிப்பு அட்டவணையை கணக்கிடுவார்கள்." : "Input target crops and organic physical conditions on the left. Aswanna soil experts will compute carbon capture schedules for sustainable yields."}
                </p>
              </div>
            </div>
          )}

          {!loading && report && (
            <div className="space-y-5">
              {/* Summary Soil Health Index and pH Diagnose */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Index Card */}
                <div className="bg-white border border-gray-150 rounded-xl p-4 shadow-xs flex items-center gap-4">
                  <div className="relative w-16 h-16 flex items-center justify-center bg-emerald-50 rounded-full border border-emerald-100">
                    <span className="text-xl font-display font-bold text-emerald-800">{report.soilHealthIndex}</span>
                    <span className="text-[9px] font-mono text-emerald-500 absolute bottom-1 leading-none">INDEX</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">
                      {lang === "si" ? "පස් සාරවත්භාවය පිළිබඳ වාර්තාව" : lang === "ta" ? "மண் வளம் அறிக்கை" : "SOIL HEALTH REPORT CARD"}
                    </span>
                    <h5 className="font-display font-bold text-gray-800 text-sm">
                      {lang === "si" ? "පසෙහි ජීව ශක්ති දර්ශකය" : lang === "ta" ? "மண்ணின் உயிர்ச்சக்தி காரணி" : "Vitality Coefficient Score"}
                    </h5>
                    <p className="text-[10.5px] text-gray-500 leading-normal">
                      {lang === "si" ? "විශිෂ්ට ව්‍යුහ පදනමක්. කාබනික ද්‍රව්‍ය රැකගැනීමට යොමුවන්න." : lang === "ta" ? "சிறந்த கட்டமைப்பு தளம். கரிம கார்பனை அதிகரிப்பதில் கவனம் செலுத்துங்கள்." : "Excellent structural base. Focus on organic carbon locking."}
                    </p>
                  </div>
                </div>

                {/* pH diagnose status card */}
                <div className="bg-white border border-gray-150 rounded-xl p-4 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <Sliders className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">
                      {lang === "si" ? "pH මට්ටම වර්ගීකරණය" : lang === "ta" ? "pH காரத்தன்மை வகைப்பாடு" : "pH LEVEL CLASSIFICATION"}
                    </span>
                    <h5 className="font-display font-bold text-gray-800 text-sm">{report.phDiagnostic}</h5>
                    <p className="text-[10.5px] text-gray-500 leading-normal">
                      {lang === "si" ? "නිවර්තන කලාපීය පසට පොදු තත්ත්වයකි. ඩොලමයිට් එකතු කිරීම සුදුසුය." : lang === "ta" ? "வெப்பமண்டல நிலங்களின் பொதுவான பண்பு ஆகும். டோலோமைட் சிபாரிசு செய்யப்படுகிறது." : "Highly typical of tropical fields. Requires dolomite tilling."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Graphic Nutrient Meters */}
              <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-xs space-y-4">
                <span className="font-bold text-gray-800 block uppercase tracking-wider text-[11px] font-display">
                  {lang === "si" ? "ප්‍රධාන පෝෂක මට්ටම් ප්‍රස්ථාරය" : lang === "ta" ? "பேரூட்டச் சத்து அளவுகள்" : "Macro-nutrient Visual Spectrums"}
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Nitrogen Meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-gray-700">Nitrogen (N)</span>
                      <span className="font-mono text-rose-600 font-bold">{report.macronutrientStatus.nitrogen}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${getMeterBg(report.macronutrientStatus.nitrogen)} ${getMeterPercent(report.macronutrientStatus.nitrogen)}`} />
                    </div>
                  </div>

                  {/* Phosphorus Meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-gray-700">Phosphorus (P)</span>
                      <span className="font-mono text-emerald-600 font-bold">{report.macronutrientStatus.phosphorus}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${getMeterBg(report.macronutrientStatus.phosphorus)} ${getMeterPercent(report.macronutrientStatus.phosphorus)}`} />
                    </div>
                  </div>

                  {/* Potassium Meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-gray-700">Potassium (K)</span>
                      <span className="font-mono text-amber-600 font-bold">{report.macronutrientStatus.potassium}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${getMeterBg(report.macronutrientStatus.potassium)} ${getMeterPercent(report.macronutrientStatus.potassium)}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Identified Nutrients Deficiencies */}
              <div className="bg-rose-50/40 border border-rose-200/50 rounded-xl p-4.5 space-y-2 text-xs">
                <span className="font-bold text-rose-950 block uppercase tracking-wider text-[11px] font-display flex items-center gap-1">
                  <HeartCrack className="w-4 h-4 text-rose-500" /> Nutrient Deficiencies & Signs Identified:
                </span>
                <ul className="space-y-1.5 list-disc pl-4.5 text-gray-700 text-[11px] leading-relaxed">
                  {report.deficiencies.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>

              {/* pH Corrective Actions & Dolomite Weights */}
              <div className="bg-amber-50/30 border border-amber-200/40 p-4.5 rounded-xl text-xs flex gap-3 text-gray-800">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold tracking-wider uppercase text-[9.5px] text-amber-800 block">pH Correction Directive Rules</span>
                  <p className="leading-relaxed text-[11.5px] font-sans text-gray-750">{report.pHCorrectionAction}</p>
                </div>
              </div>

              {/* organic carbon strategy and compost recipe scheduler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organic Carbon Locking */}
                <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-xl p-4.5 space-y-2 text-xs">
                  <span className="font-bold text-emerald-950 block uppercase tracking-wider text-[11px] font-display flex items-center gap-1.5">
                    <Settings className="w-4 h-4 text-emerald-700" /> Carbon Sequestration Instructions
                  </span>
                  <ul className="space-y-1.5 list-disc pl-4 text-[11px] text-gray-700 leading-relaxed">
                    {report.soilCarbonRebuildingStrategy.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>

                {/* Composting program recipe scheduler */}
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-4.5 space-y-2 text-xs">
                  <span className="font-bold text-gray-800 block uppercase tracking-wider text-[11px] font-display flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#113a17]" /> Bio-Organic Compost Scheduler recipe
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-gray-700 leading-normal">
                    {report.compostingSchedule.map((c, i) => (
                      <li key={i} className="flex gap-1">
                        <span className="font-bold text-[#113a17]">{i+1}.</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cover Crops selector recommendation */}
              <div className="bg-white border border-gray-150 rounded-xl p-4 text-xs space-y-2.5">
                <span className="font-bold text-gray-800 block uppercase tracking-wider text-[11px] font-display">Inter-Cropping & Nitrogen Cover recommendations</span>
                <div className="flex flex-wrap gap-2">
                  {report.recommendedCoverCrops.map((c) => {
                    return (
                      <span key={c} className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 text-emerald-800 font-mono text-[10px] uppercase font-bold px-3 py-1 rounded">
                        🌱 {c}
                      </span>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
