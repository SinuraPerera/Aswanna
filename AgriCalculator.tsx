import React, { useState } from "react";
import { 
  Calculator, 
  Dna, 
  Info, 
  MapPin, 
  Sliders, 
  Activity, 
  FileSpreadsheet,
  Calendar
} from "lucide-react";
import { ThemeStyles, ThemeType } from "./theme";
import { Language, translations } from "./translations";

interface AgriCalculatorProps {
  theme: ThemeType;
  themeStyles: ThemeStyles;
  lang: Language;
}

export default function AgriCalculator({ theme, themeStyles, lang }: AgriCalculatorProps) {
  const t = translations[lang];
  const [cropType, setCropType] = useState("rice_paddy");
  const [acres, setAcres] = useState<number>(1.5);
  const [soilPh, setSoilPh] = useState<number>(5.5);

  // Sri Lankan agricultural calculations
  const calculateFertilizers = () => {
    const multi = acres;
    let ureaBase = 0;
    let tspBase = 0;
    let mopBase = 0;
    let compostBase = 0;

    switch (cropType) {
      case "rice_paddy":
        ureaBase = 75; // kg per acre total
        tspBase = 35;
        mopBase = 30;
        compostBase = 500;
        break;
      case "chilies":
        ureaBase = 90;
        tspBase = 55;
        mopBase = 60;
        compostBase = 800;
        break;
      case "cardamom":
        ureaBase = 45;
        tspBase = 25;
        mopBase = 40;
        compostBase = 1200;
        break;
      case "cinnamon":
        ureaBase = 50;
        tspBase = 20;
        mopBase = 35;
        compostBase = 600;
        break;
      default:
        ureaBase = 60;
        tspBase = 30;
        mopBase = 30;
        compostBase = 500;
    }

    // Dolomite weight calculations if pH is low (ideal: 6.2 - 6.8)
    let dolomiteNeeded = 0;
    if (soilPh < 6.0) {
      dolomiteNeeded = Math.round((6.5 - soilPh) * 350 * multi);
    }

    return {
      urea: Math.round(ureaBase * multi),
      tsp: Math.round(tspBase * multi),
      mop: Math.round(mopBase * multi),
      compost: Math.round(compostBase * multi),
      dolomite: dolomiteNeeded,
      basalUrea: Math.round(ureaBase * 0.15 * multi),
      split1Urea: Math.round(ureaBase * 0.5 * multi), // Day 21 (active tillering)
      split2Urea: Math.round(ureaBase * 0.35 * multi) // Day 45 (panicle initiation)
    };
  };

  const results = calculateFertilizers();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-2 ${themeStyles.borderColor}`}>
        <div>
          <h3 className={`text-xl font-display font-semibold flex items-center gap-2 ${themeStyles.textHeading}`}>
            <Calculator className="w-5 h-5" /> {t.fertilizerCalc}
          </h3>
          <p className="text-xs text-gray-500">
            {lang === "si" 
              ? "ශ්‍රී ලංකා කෘෂිකර්ම දෙපාර්තමේන්තුවේ අනුමත පෝෂක නිර්දේශවලට අනුව පොහොර මාත්‍රාවන් ගණනය කරන්න." 
              : lang === "ta" 
                ? "இலங்கை விவசாய திணைக்கள பரிந்துரைகளின்படி உர அளவுகளை கணக்கிடுங்கள்." 
                : "Compute targeted split NPK ratios corresponding precisely with Ceylon Department of Agriculture guidelines."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs panel (4 cols) */}
        <div className={`lg:col-span-4 rounded-xl border p-5 shadow-3xs space-y-4 ${themeStyles.card} ${themeStyles.cardBorder}`}>
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black block">
            {lang === "si" ? "පරාමිතීන් ඇතුළත් කරන්න" : lang === "ta" ? "அளவீடுகளை உள்ளிடவும்" : "Calculation inputs"}
          </span>

          <div className="space-y-4 text-xs text-gray-750">
            {/* Target Crop */}
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                {lang === "si" ? "වගා කරන බෝගයේ කාණ්ඩය" : lang === "ta" ? "பயிர் வகை" : "Cultivated Crop Category"}
              </label>
              <select
                className={`w-full border rounded-lg p-2 font-bold focus:outline-none ${themeStyles.inputBg} ${themeStyles.textHeading} ${themeStyles.borderColor}`}
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
              >
                <option value="rice_paddy" className="text-gray-800">
                  {lang === "si" ? "සම්බා වී වගාව" : lang === "ta" ? "நெல் பயிர்கள்" : "Samba Rice Paddy"}
                </option>
                <option value="chilies" className="text-gray-800">
                  {lang === "si" ? "අමු මිරිස් වගාව" : lang === "ta" ? "மிளகாய் வழு" : "Green Chilies / Capisicum"}
                </option>
                <option value="cardamom" className="text-gray-800">
                  {lang === "si" ? " Ceylon කරදමුංගු" : lang === "ta" ? "ஏலக்காய்" : "Ceylon Cardamom Lot"}
                </option>
                <option value="cinnamon" className="text-gray-800">
                  {lang === "si" ? "කුරුඳු වගාව" : lang === "ta" ? "கருவா (இலவங்கப்பட்டை)" : "Ceylon Cinnamon Fields"}
                </option>
              </select>
            </div>

            {/* Land Area in Acres */}
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                {lang === "si" ? "භූමි ප්‍රමාණය (අක්කර)" : lang === "ta" ? "நிலத்தின் அளவு (ஏக்கர்)" : "Land Area (Acres)"}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                className={`w-full border rounded-lg p-2 font-mono font-bold ${themeStyles.inputBg} ${themeStyles.textHeading} ${themeStyles.borderColor}`}
                value={acres}
                onChange={(e) => setAcres(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              />
            </div>

            {/* Soil pH value */}
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1 flex justify-between">
                <span>{lang === "si" ? "පසෙහි pH අගය" : lang === "ta" ? "மண்ணின் pH அளவு" : "Measured Soil pH"}</span>
                <span className={`font-mono font-bold ${soilPh < 6.0 ? "text-amber-500" : "text-emerald-500"}`}>{soilPh}</span>
              </label>
              <input
                type="range"
                min="4.0"
                max="8.0"
                step="0.1"
                className="w-full accent-emerald-700 cursor-pointer"
                value={soilPh}
                onChange={(e) => setSoilPh(parseFloat(e.target.value))}
              />
              <span className="text-[10px] text-gray-400 block leading-tight mt-1">
                {soilPh < 6.0 
                  ? (lang === "si" ? "ආම්ලික පස - ඩොලමයිට් ප්‍රතිකාර අවශ්‍යයි." : lang === "ta" ? "அமில மண் - டோலமைட் தேவைப்படலாம்" : "Acidic level. High dolomite neutralization needed.")
                  : (lang === "si" ? "පසෙහි pH අගය ප්‍රශස්ත තත්ත්වයේ ඇත." : lang === "ta" ? "மண் உகந்த மட்டத்தில் உள்ளது" : "Ideal neural tropical balance.")}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic calculation results (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total weights dashboard */}
            <div className={`border rounded-xl p-5 shadow-3xs space-y-3.5 ${themeStyles.card} ${themeStyles.cardBorder}`}>
              <h4 className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${themeStyles.textHeading}`}>
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                {lang === "si" ? "මුළු පොහොර අවශ්‍යතා" : lang === "ta" ? "தேவையான மொத்த உர அலவுகள்" : "Total Seasonal Weights Needed"}
              </h4>

              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex justify-between items-center py-1.5 border-b border-gray-100/50">
                  <span>{t.fertilizerLabels.urea}</span>
                  <span className={`font-mono font-bold ${themeStyles.textHeading}`}>{results.urea} kg</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-gray-100/50">
                  <span>{t.fertilizerLabels.tsp}</span>
                  <span className={`font-mono font-bold ${themeStyles.textHeading}`}>{results.tsp} kg</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-gray-100/50">
                  <span>{t.fertilizerLabels.mop}</span>
                  <span className={`font-mono font-bold ${themeStyles.textHeading}`}>{results.mop} kg</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-gray-100/50">
                  <span>{t.fertilizerLabels.organicCompost}</span>
                  <span className={`font-mono font-bold ${themeStyles.textHeading}`}>{results.compost} kg</span>
                </div>
                {results.dolomite > 0 && (
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100/50 text-amber-900 bg-amber-500/5 px-2 rounded">
                    <span>{t.fertilizerLabels.dolomite}</span>
                    <span className="font-mono font-bold">{results.dolomite} kg</span>
                  </div>
                )}
              </div>
            </div>

            {/* Split Schedule Application */}
            <div className={`border rounded-xl p-5 shadow-3xs space-y-3.5 ${themeStyles.card} ${themeStyles.cardBorder}`}>
              <h4 className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${themeStyles.textHeading}`}>
                <Calendar className="w-4 h-4 text-emerald-600" />
                {lang === "si" ? "පොහොර යෙදීමේ කාලසටහන (යූරියා)" : lang === "ta" ? "யூரியா உரமிடும் கால அட்டவணை" : "Urea Split Dosage Program"}
              </h4>

              <div className="space-y-3 text-xs text-gray-700">
                <div className="p-2.5 rounded-lg border border-emerald-500/10 bg-emerald-50/5">
                  <div className="flex justify-between font-bold text-[11px] text-emerald-800">
                    <span>{lang === "si" ? "මූලික යෙදවුම (වී වැපිරීමට පෙර)" : lang === "ta" ? "ஆரம்ப உரம் (விதைப்பிற்கு முன்)" : "Basal Dressing (Sowing Day)"}</span>
                    <span className="font-mono">{results.basalUrea} kg</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {lang === "si" ? "වැපිරීමට දින 1 කට පෙර සම්පූර්ණ TSP පොහොර සමඟ මිශ්‍ර කර පසට එකතු කරන්න." : lang === "ta" ? "விதைப்பதற்கு முன் முழு TSP அளவுடன் கலந்து மண்ணில் சேர்க்கவும்." : "Apply with pre-sown TSP to establish strong embryonic shoot networks."}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg border border-sky-500/10 bg-sky-50/5">
                  <div className="flex justify-between font-bold text-[11px] text-sky-800">
                    <span>{lang === "si" ? "පළමු අතුරු යෙදවුම (දින 21 වන දින)" : lang === "ta" ? "முதல் அතුරු உரம் (21 வது நாள்)" : "1st Split (Day 21 - Tillering Rate)"}</span>
                    <span className="font-mono">{results.split1Urea} kg</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {lang === "si" ? "බෝගය සීඝ්‍රයෙන් වැඩෙන අවධියේදී වල් පැල නෙලීමෙන් පසු වහාම යොදන්න." : lang === "ta" ? "களை நீக்கிய பின் வேகமாக வளர இந்த உரத்தை மண்ணில் சேருங்கள்." : "Increases vegetative tillers. Settle immediately after primary weeding."}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg border border-amber-500/10 bg-amber-50/5">
                  <div className="flex justify-between font-bold text-[11px] text-amber-800">
                    <span>{lang === "si" ? "දෙවන අතුරු යෙදවුම (දින 45 වන දින)" : lang === "ta" ? "இரண்டாவது அතුරු உரம் (45 வது நாள்)" : "2nd Split (Day 45 - Panicle Stage)"}</span>
                    <span className="font-mono">{results.split2Urea} kg</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {lang === "si" ? "කරල් එන අවධියේදී ධාන්‍ය සරු වීම සඳහා සම්පූර්ණ Potash (MOP) සමඟ යොදන්න." : lang === "ta" ? "கதிர் வரும் பருவத்தில் பொட்டாஷுடன் சேர்த்து மண்ணிடுங்கள்." : "Combine with complete MOP Potassium weights for ideal milk-filling starch."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-950 text-emerald-100 rounded-xl p-5 border border-emerald-800 text-xs flex gap-3 leading-relaxed">
            <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white uppercase tracking-wider text-[9px] block">Sustainable Sri Lanka Agro Guidelines Directive</span>
              <p className="text-emerald-200/90 text-[11px]">
                {lang === "si" 
                  ? "මෙම අගයන් කෘෂිකාර්මික වගාවන් සඳහා මූලික උපදෙස් කාන්ඩයන් වේ. පසෙහි අතිරික්ත ලවණතාවය හෝ ලබන වර්ෂාපතන තත්ත්වයන් මත පොහොර මාත්‍රා යෙදීම වෙනස් විය හැක." 
                  : lang === "ta" 
                    ? "மண்ணின் நிலைமை மற்றும் பருவமழையை கருத்தில் கொண்டு உரம் இடுவதை உறுதி செய்யுமாறு விவசாயிகளை கேட்டுக்கொள்கிறோம்." 
                    : "The NPK estimates match default ecological targets. Wet Zone vs Dry Zone rainfall triggers slight volume variation. Prioritize compost layering for healthy soil carbon sequestration."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
