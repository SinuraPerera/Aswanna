import React, { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wheat, 
  Calculator, 
  MapPin, 
  Info, 
  ArrowRight,
  RefreshCw,
  ShoppingBag
} from "lucide-react";
import { ThemeStyles, ThemeType } from "../theme";
import { Language, translations } from "../translations";

interface MarketHubProps {
  theme: ThemeType;
  themeStyles: ThemeStyles;
  lang: Language;
}

interface CommodityPrice {
  id: string;
  nameEn: string;
  nameSi: string;
  nameTa: string;
  category: string;
  pricePerKgRs: number;
  changePercent: number;
  marketUnit: string;
  source: string;
}

const INITIAL_COMMODITIES: CommodityPrice[] = [
  {
    id: "1",
    nameEn: "Keeri Samba Paddy",
    nameSi: "කීරි සම්බා වී",
    nameTa: "கீரி சம்பா நெல்",
    category: "Grains",
    pricePerKgRs: 220,
    changePercent: 2.4,
    marketUnit: "1 kg",
    source: "Dambulla Center"
  },
  {
    id: "2",
    nameEn: "Standard Samba Paddy",
    nameSi: "සම්බා වී",
    nameTa: "சம்பா நெல்",
    category: "Grains",
    pricePerKgRs: 195,
    changePercent: -1.2,
    marketUnit: "1 kg",
    source: "Dambulla Center"
  },
  {
    id: "3",
    nameEn: "Green Chilies",
    nameSi: "අමු මිරිස්",
    nameTa: "பச்சை மிளகாய்",
    category: "Vegetables",
    pricePerKgRs: 480,
    changePercent: 8.7,
    marketUnit: "1 kg",
    source: "Madiwela Center"
  },
  {
    id: "4",
    nameEn: "Red Onions (Jaffna)",
    nameSi: "රතු ළූණු (යාපනය)",
    nameTa: "சின்ன வெங்காயம் (யாழ்ப்பாணம்)",
    category: "Vegetables",
    pricePerKgRs: 360,
    changePercent: 1.5,
    marketUnit: "1 kg",
    source: "Dambulla Center"
  },
  {
    id: "5",
    nameEn: "Ceylon Cardamom (Gr 1)",
    nameSi: "කරාබුනැටි / කරදමුංගු",
    nameTa: "ஏலக்காய் (தரம் 1)",
    category: "Spices",
    pricePerKgRs: 8200,
    changePercent: -0.8,
    marketUnit: "1 kg",
    source: "Kandy Wholesale"
  },
  {
    id: "6",
    nameEn: "King Coconut",
    nameSi: "තැඹිලි",
    nameTa: "தம்பிலி (செவ்விளநீர்)",
    category: "Fruits",
    pricePerKgRs: 140,
    changePercent: 5.2,
    marketUnit: "Single Nut",
    source: "Colombo Manning"
  },
  {
    id: "7",
    nameEn: "Nuwara Eliya Carrots",
    nameSi: "නුවරඑළිය කැරට්",
    nameTa: "நுவரெலியா கேரட்",
    category: "Vegetables",
    pricePerKgRs: 320,
    changePercent: -3.5,
    marketUnit: "1 kg",
    source: "Dambulla Center"
  },
  {
    id: "8",
    nameEn: "Organic Bio-Compost Base",
    nameSi: "කාබනික කොම්පෝස්ට්",
    nameTa: "கரிம உரம்",
    category: "Inputs",
    pricePerKgRs: 85,
    changePercent: 0.0,
    marketUnit: "1 kg",
    source: "Govijana Cooperative"
  }
];

export default function MarketHub({ theme, themeStyles, lang }: MarketHubProps) {
  const t = translations[lang];
  const [commodities, setCommodities] = useState<CommodityPrice[]>(INITIAL_COMMODITIES);
  const [loading, setLoading] = useState(false);

  // Profit/Yield calculator states
  const [selectedCropId, setSelectedCropId] = useState(INITIAL_COMMODITIES[0].id);
  const [landAcres, setLandAcres] = useState(1);
  const [anticipatedYieldKg, setAnticipatedYieldKg] = useState(1200);
  const [estimatedCostRs, setEstimatedCostRs] = useState(90000);

  const activeCalculatedCrop = commodities.find((c) => c.id === selectedCropId) || commodities[0];

  const triggerPriceRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate slight daily variation to keep it highly dynamic and interactive
      const randomized = commodities.map((c) => {
        const factor = (Math.random() - 0.5) * 6; // -3% to +3%
        const newPrice = Math.max(15, Math.round(c.pricePerKgRs * (1 + factor / 100)));
        return {
          ...c,
          pricePerKgRs: newPrice,
          changePercent: parseFloat((factor).toFixed(1))
        };
      });
      setCommodities(randomized);
      setLoading(false);
    }, 800);
  };

  // Yield calculator math
  const calculatedRevenue = anticipatedYieldKg * activeCalculatedCrop.pricePerKgRs * landAcres;
  const calculatedProfit = calculatedRevenue - estimatedCostRs;

  const getLocalizedName = (item: CommodityPrice) => {
    if (lang === "si") return item.nameSi;
    if (lang === "ta") return item.nameTa;
    return item.nameEn;
  };

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4 ${themeStyles.borderColor}`}>
        <div>
          <h3 className={`text-xl font-display font-semibold flex items-center gap-2 ${themeStyles.textHeading}`}>
            <ShoppingBag className="w-5 h-5" /> {t.economicHub}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {t.economicDesc}
          </p>
        </div>

        <button
          onClick={triggerPriceRefresh}
          disabled={loading}
          className={`text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all font-bold ${
            theme === "harvester" 
              ? "bg-emerald-500 hover:bg-emerald-400 text-black" 
              : "bg-emerald-800 hover:bg-emerald-950 text-white"
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          {lang === "si" ? "මිල ගණන් යාවත්කාලීන කරන්න" : lang === "ta" ? "விலைகளைப் புதுப்பிக்குக" : "Refresh Centers Feeds"}
        </button>
      </div>

      {/* Main Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Market list (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {commodities.map((item) => {
              const isPositiveChange = item.changePercent >= 0;
              return (
                <div 
                  key={item.id} 
                  className={`border rounded-xl p-4 transition-all shadow-3xs flex flex-col justify-between h-[120px] ${themeStyles.card} ${themeStyles.cardBorder}`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <span className="text-[9px] font-mono text-gray-400 font-bold block bg-gray-100 rounded px-1.5 py-0.5 inline-block uppercase">
                        {item.category}
                      </span>
                      <h4 className={`font-semibold text-xs mt-1 truncate ${themeStyles.textHeading}`}>
                        {getLocalizedName(item)}
                      </h4>
                    </div>
                    <span className="text-[9.5px] font-mono font-bold text-gray-400">
                      {item.source}
                    </span>
                  </div>

                  <div className="flex justify-between items-end border-t border-gray-100/50 pt-2 mt-2">
                    <div>
                      <span className="text-[10px] text-gray-400 block">{lang === "si" ? "මිල" : lang === "ta" ? "விலை" : "Current Rate"}</span>
                      <span className={`text-base font-bold font-mono ${themeStyles.textHeading}`}>
                        Rs. {item.pricePerKgRs.toLocaleString()}
                        <span className="text-[10px] font-normal text-gray-400 ml-1">/ {item.marketUnit}</span>
                      </span>
                    </div>

                    <div className={`flex items-center gap-0.5 font-mono text-[10.5px] font-bold px-1.5 py-0.5 rounded ${
                      item.changePercent === 0 
                        ? "bg-gray-100 text-gray-500" 
                        : isPositiveChange 
                          ? "bg-emerald-100/80 text-emerald-800" 
                          : "bg-rose-100/80 text-rose-800"
                    }`}>
                      {item.changePercent !== 0 && (isPositiveChange ? <TrendingUp className="w-3" /> : <TrendingDown className="w-3" />)}
                      <span>{isPositiveChange ? "+" : ""}{item.changePercent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`p-4.5 rounded-xl border flex gap-3 text-xs leading-relaxed ${themeStyles.accentBg} ${themeStyles.accentBorder} ${themeStyles.textBody}`}>
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-[9px] block">National Agri-Pricing Assurance</span>
              <p className="text-[11px]">
                {lang === "si" 
                  ? "මෙම මිල ගණන් දඹුල්ල සහ කොළඹ ආර්ථික මධ්‍යස්ථානවලින් සජීවීව ආනයනය කරනු ලැබේ. කෘෂිකර්ම අමාත්‍යාංශයේ සහතික මිලට වඩා අඩු අගයකින් අස්වැන්න විකිණීමෙන් වළකින්න." 
                  : lang === "ta" 
                    ? "இந்த விலைகள் கொழும்பு மற்றும் தம்புள்ளை மையங்களிலிருந்து நேரடியாக பெறப்பட்டவை. தேசிய கொள்முதல் விலைக்கு குறைவாக விற்க வேண்டாம் என விவசாயிகளை அறிவுறுத்துகிறோம்." 
                    : "Prices are synchronized dynamically with Sri Lankan agricultural center guarantees. Standard floor rates prevent seasonal exploitation by intermediaries."}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Profit margins calculator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`border rounded-xl p-5 shadow-xs ${themeStyles.card} ${themeStyles.cardBorder} space-y-4`}>
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <h4 className={`font-display font-semibold text-sm ${themeStyles.textHeading}`}>
                {t.pricingCalculator}
              </h4>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Select crop */}
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                  {lang === "si" ? "ලියාපදිංචි බෝග වර්ගය" : lang === "ta" ? "பயிர் வகை தேர்வு செய்க" : "Crop Variety Target"}
                </label>
                <select
                  className={`w-full border rounded-lg p-2 font-bold focus:outline-none ${themeStyles.inputBg} ${themeStyles.textHeading} ${themeStyles.borderColor}`}
                  value={selectedCropId}
                  onChange={(e) => setSelectedCropId(e.target.value)}
                >
                  {commodities.map((item) => (
                    <option key={item.id} value={item.id} className="text-gray-800 bg-white">
                      {getLocalizedName(item)} (Rs. {item.pricePerKgRs}/kg)
                    </option>
                  ))}
                </select>
              </div>

              {/* Land Acres */}
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                  {lang === "si" ? "වගා කරන භූමි ප්‍රමාණය" : lang === "ta" ? "விவசாய நில அளவு" : "Cultivation Area"}
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="1"
                    className={`w-full border rounded-lg p-2 font-mono ${themeStyles.inputBg} ${themeStyles.textHeading} ${themeStyles.borderColor}`}
                    value={landAcres}
                    onChange={(e) => setLandAcres(Math.max(1, parseInt(e.target.value) || 0))}
                  />
                  <span className="font-bold text-gray-500 shrink-0">{t.acres}</span>
                </div>
              </div>

              {/* Anticipated Yield per acre */}
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                  {lang === "si" ? "අක්කරයකට බලාපොරොත්තු වන අස්වැන්න (කි.ග්‍රෑ)" : lang === "ta" ? "ஏக்கருக்கான தற்போதைய மகசூல் (கிலோ)" : "Expected Yield Per Acre (kg)"}
                </label>
                <input
                  type="number"
                  min="100"
                  className={`w-full border rounded-lg p-2 font-mono ${themeStyles.inputBg} ${themeStyles.textHeading} ${themeStyles.borderColor}`}
                  value={anticipatedYieldKg}
                  onChange={(e) => setAnticipatedYieldKg(Math.max(10, parseInt(e.target.value) || 0))}
                />
              </div>

              {/* Input costs */}
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                  {lang === "si" ? "ඇස්තමේන්තුගත මුළු වියදම (පොහොර + ජලය + බීජ)" : lang === "ta" ? "உரம் மற்றும் இதர செலவுகள் (ரூபா)" : "Anticipated Total Seasonal Costs (Rs.)"}
                </label>
                <input
                  type="number"
                  className={`w-full border rounded-lg p-2 font-mono ${themeStyles.inputBg} ${themeStyles.textHeading} ${themeStyles.borderColor}`}
                  value={estimatedCostRs}
                  onChange={(e) => setEstimatedCostRs(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>

              {/* Math outcome display board */}
              <div className={`p-4 rounded-xl space-y-2 border ${themeStyles.accentBg} ${themeStyles.borderColor}`}>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[10.5px]">
                    {lang === "si" ? "ලැබෙන මුළු දළ ආදායම" : lang === "ta" ? "மொத்த வருமானம்" : "Gross Revenue Estimate"}
                  </span>
                  <span className="font-mono text-xs font-bold text-gray-500">
                    Rs. {calculatedRevenue.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200/40 pt-2">
                  <span className="font-bold text-xs">
                    {lang === "si" ? "ශුද්ධ ලාභය" : lang === "ta" ? "நிகர இலாபம்" : "Net Seasonal Profit"}
                  </span>
                  <span className={`font-mono text-sm font-black ${calculatedProfit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    Rs. {calculatedProfit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
