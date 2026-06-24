import React, { useState, useEffect } from "react";
import { FarmPlot } from "../types";
import { Language, translations } from "../translations";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Sprout, 
  ChevronRight, 
  Plus, 
  CheckSquare, 
  FileText, 
  TrendingUp, 
  Trash2, 
  Heart,
  Droplet,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GrowthCalendarProps {
  activePlot: FarmPlot | null;
  lang: Language;
}

interface CalendarLog {
  id: string;
  plotId: string;
  cropName: string;
  plantingDate: string;
  logs: { id: string; date: string; content: string; done: boolean }[];
}

export default function GrowthCalendar({ activePlot, lang }: GrowthCalendarProps) {
  const t = translations[lang];
  const [cropName, setCropName] = useState("Keeri Samba (BG-360)");
  const [plantingDate, setPlantingDate] = useState("2026-05-15");
  const [activeCalendars, setActiveCalendars] = useState<CalendarLog[]>([]);
  const [newLogText, setNewLogText] = useState("");
  const [selectedCalId, setSelectedCalId] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("aswanna_calendars");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setActiveCalendars(parsed);
        if (parsed.length > 0) {
          setSelectedCalId(parsed[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveCalendars = (cals: CalendarLog[]) => {
    setActiveCalendars(cals);
    localStorage.setItem("aswanna_calendars", JSON.stringify(cals));
  };

  const handleCreateCalendar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim() || !plantingDate) return;

    const newCal: CalendarLog = {
      id: Date.now().toString(),
      plotId: activePlot?.id || "custom-plot",
      cropName: cropName,
      plantingDate: plantingDate,
      logs: []
    };

    const updated = [newCal, ...activeCalendars];
    saveCalendars(updated);
    setSelectedCalId(newCal.id);
  };

  const handleDeleteCalendar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = activeCalendars.filter((c) => c.id !== id);
    saveCalendars(updated);
    if (selectedCalId === id) {
      setSelectedCalId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogText.trim() || !selectedCalId) return;

    const updated = activeCalendars.map((c) => {
      if (c.id === selectedCalId) {
        return {
          ...c,
          logs: [
            ...c.logs,
            {
              id: Date.now().toString(),
              date: new Date().toISOString().split("T")[0],
              content: newLogText,
              done: false
            }
          ]
        };
      }
      return c;
    });

    saveCalendars(updated);
    setNewLogText("");
  };

  const handleToggleLog = (calId: string, logId: string) => {
    const updated = activeCalendars.map((c) => {
      if (c.id === calId) {
        return {
          ...c,
          logs: c.logs.map((l) => (l.id === logId ? { ...l, done: !l.done } : l))
        };
      }
      return c;
    });
    saveCalendars(updated);
  };

  // Compute rice growth stages relative to planting date
  const generateStages = (startDateStr: string) => {
    const baseDate = new Date(startDateStr);
    
    const addDays = (days: number) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + days);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    if (lang === "si") {
      return [
        {
          title: "තවාන් සැකසීම සහ ප්‍රරෝහණය",
          interval: "දින 1 - 15",
          dateRange: `${addDays(0)} — ${addDays(15)}`,
          desc: "ශක්තිමත් බීජ පැළ ලබා ගැනීම. කාබනික කොම්පෝස්ට් ස්තර යෙදීමට මුල් තැන දෙන්න. පත්‍ර වල වායු හුවමාරුව සඳහා ජල මට්ටම අවම මට්ටමක (සෙ.මී. 1-2) තබා ගන්න.",
          fertilizerAdvisory: "මූලික පොහොර යෙදීම: ඩොලමයිට් හුණු + කාබනික පිදුරු මිශ්‍රණය.",
          waterRequirement: "අවම (තෙත් පස)",
          color: "border-l-emerald-500 bg-emerald-50/10"
        },
        {
          title: "ක්‍රියාකාරී අතු බෙදීම",
          interval: "දින 15 - 45",
          dateRange: `${addDays(15)} — ${addDays(45)}`,
          desc: "කුඹුරු වේගයෙන් වර්ධනය වේ. ක්‍රියාකාරී අතු බෙදීම පවත්වා ගන්න. වල් පැලෑටි අතින් උදුරා ඉවත් කරන්න.",
          fertilizerAdvisory: "යුරියා යෙදීම: 21 වන දින යුරියා කිලෝග්‍රෑම් 20 ක් යොදන්න.",
          waterRequirement: "වැඩි (සෙ.මී. 5 ජලය රඳවා තැබීම)",
          color: "border-l-teal-500 bg-teal-50/10"
        },
        {
          title: "කරල් ඒම ආරම්භය",
          interval: "දින 45 - 75",
          dateRange: `${addDays(45)} — ${addDays(75)}`,
          desc: "පැලයේ කඳ තුළ මල් පොකුරු සෑදීම සහ කඳ මහත්වීම සිදුවේ. මෙම කාලයේ පවතින දැඩි වියළි කාලගුණය බෝගය වඳ වීමට හේතු විය හැක.",
          fertilizerAdvisory: "මතුපිට පොහොර: බෝගයේ ශක්තිමත් වර්ධනයක් සඳහා MOP (පොටෑෂ් පොහොර) යොදන්න.",
          waterRequirement: "ඉතා වැඩි (නිරන්තරයෙන් තෙතමනය තබන්න)",
          color: "border-l-sky-500 bg-sky-50/10"
        },
        {
          title: "කරල් පැසීම සහ කිරි වැදීම",
          interval: "දින 75 - 100",
          dateRange: `${addDays(75)} — ${addDays(100)}`,
          desc: "ධාන්‍ය දැඩි වීමට පෙර කිරි දියරයෙන් පිරේ. ගොයම් මැස්සාගේ හානියෙන් ආරක්ෂා වීමට දිනපතා කුඹුර පරීක්ෂා කරන්න.",
          fertilizerAdvisory: "කෘතිම නයිට්‍රජන් පොහොර නොයොදන්න. පසෙහි ඉතිරිව ඇති පොටෑසියම් මත යැපෙන්න.",
          waterRequirement: "මධ්‍යම (ජලය ක්‍රමයෙන් හිස් කරන්න)",
          color: "border-l-amber-500 bg-amber-50/10"
        },
        {
          title: "අස්වනු නෙළීම සහ වියළීම",
          interval: "දින 100 - 120",
          dateRange: `${addDays(100)} — ${addDays(120)}`,
          desc: "කරල් රන්වන් දුඹුරු පැහැයට හැරේ. තෙතමනය 20-22% දක්වා පහත වැටේ. ජලය සම්පූර්ණයෙන්ම හිස් කරන්න.",
          fertilizerAdvisory: "පොහොර යෙදීම අවශ්‍ය නොවේ. ස්වභාවිකව වියළීමට ඉඩ හරින්න.",
          waterRequirement: "ශුන්‍ය (කුඹුර සම්පූර්ණයෙන්ම වියළි විය යුතුය)",
          color: "border-l-amber-600 bg-amber-50/20"
        }
      ];
    }

    if (lang === "ta") {
      return [
        {
          title: "நாற்றங்கால் & முளைத்தல்",
          interval: "நாட்கள் 1 - 15",
          dateRange: `${addDays(0)} — ${addDays(15)}`,
          desc: "வலுவான ஆரம்ப தளிர்களை உருவாக்குங்கள். கரிம உரம் இடுவதற்கு முன்னுரிமை கொடுங்கள். இலைகள் சுவாசிக்க ஏதுவாக நீர் மட்டத்தை குறைவாக (1-2 செ.மீ) வைத்திருங்கள்.",
          fertilizerAdvisory: "அடி உரம்: டோலமைட் சுண்ணாம்பு + கரிம வைக்கோல் கலவை.",
          waterRequirement: "குறைவு (ஈரமான மண்)",
          color: "border-l-emerald-500 bg-emerald-50/10"
        },
        {
          title: "செயலில் உள்ள தளிர் காலம்",
          interval: "நாட்கள் 15 - 45",
          dateRange: `${addDays(15)} — ${addDays(45)}`,
          desc: "வயல்வெளிகள் வேகமாக விரிவடைகின்றன. களைகளை கைமுறையாக பிடுங்கி எறியுங்கள்.",
          fertilizerAdvisory: "யூரியா உரம்: 21 வது நாளில் 20 கிலோ யூரியாவை இடுங்கள்.",
          waterRequirement: "அதிகம் (5 செ.மீ நீர் தேக்கம்)",
          color: "border-l-teal-500 bg-teal-50/10"
        },
        {
          title: "கருப்பருவ ஆரம்ப காலம்",
          interval: "நாட்கள் 45 - 75",
          dateRange: `${addDays(45)} — ${addDays(75)}`,
          desc: "தண்டுகளுக்குள் பூக்கள் உருவாகின்றன. தண்டு வீங்கத் தொடங்குகிறது. இந்த நேரத்தில் வறட்சி ஏற்பட்டால் மகசூல் பாதிக்கப்படும்.",
          fertilizerAdvisory: "மேல் உரம்: பயிர் வீரியத்தை அதிகரிக்க MOP உரம் இடுங்கள்.",
          waterRequirement: "மிக அதிகம் (ஈரமாக வைத்திருங்கள்)",
          color: "border-l-sky-500 bg-sky-50/10"
        },
        {
          title: "பால் பிடிக்கும் பருவம்",
          interval: "நாட்கள் 75 - 100",
          dateRange: `${addDays(75)} — ${addDays(100)}`,
          desc: "நெல் மணிகள் கடினமாவதற்கு முன்பு பால் போன்ற சாறுகளால் நிரம்பும். நெல் பூச்சிகளுக்கு எதிராக தினசரி வயல்களை கண்காணியுங்கள்.",
          fertilizerAdvisory: "செயற்கை நைட்ரஜன் உரம் வேண்டாம். மண்ணிலுள்ள பொட்டாசியம் சத்து போதுமானது.",
          waterRequirement: "நடுத்தரம் (நீரை மெதுவாக வடிக்கவும்)",
          color: "border-l-amber-500 bg-amber-50/10"
        },
        {
          title: "அறுவடை முதிர்ச்சி பருவம்",
          interval: "நாட்கள் 100 - 120",
          dateRange: `${addDays(100)} — ${addDays(120)}`,
          desc: "நெல் மணிகள் பொன் நிறமாக மாறும். ஈரப்பதத்தின் அளவு 20-22% ஆக குறையும். வயலில் உள்ள நீரை முழுமையாக வடிக்கவும்.",
          fertilizerAdvisory: "உரம் எதுவும் தேவையில்லை. இயற்கையாக காய விடவும்.",
          waterRequirement: "பூஜ்ஜியம் (வயல் முற்றிலும் உலர வேண்டும்)",
          color: "border-l-amber-600 bg-amber-50/20"
        }
      ];
    }

    return [
      {
        title: "Nursery & Germination",
        interval: "Days 1 - 15",
        dateRange: `${addDays(0)} — ${addDays(15)}`,
        desc: "Build strong early shoots. Prioritize organic compost layering. Keep water beds minimal (1-2 cm) to allow leaf breathing.",
        fertilizerAdvisory: "Basal dressing: dolomite lime + organic straw mix.",
        waterRequirement: "Low (Moist soil)",
        color: "border-l-emerald-500 bg-emerald-50/10"
      },
      {
        title: "Active Tillering Split",
        interval: "Days 15 - 45",
        dateRange: `${addDays(15)} — ${addDays(45)}`,
        desc: "Rice fields expand rapidly. Maintain active tillering rates. Pull any emerging wild weeds manually.",
        fertilizerAdvisory: "Urea split: Apply 20kg Urea at Day 21.",
        waterRequirement: "High (5 cm standing water)",
        color: "border-l-teal-500 bg-teal-50/10"
      },
      {
        title: "Panicle Initiation Core",
        interval: "Days 45 - 75",
        dateRange: `${addDays(45)} — ${addDays(75)}`,
        desc: "Flower clusters formulate inside stems. Stems swelling starts. Extreme dry spikes here cause grain sterilization.",
        fertilizerAdvisory: "Top-dressing: Split MOP (muriate of potash) to optimize crop vigor.",
        waterRequirement: "Very High (Keep moist)",
        color: "border-l-sky-500 bg-sky-50/10"
      },
      {
        title: "Grain Filling & Milk Phase",
        interval: "Days 75 - 100",
        dateRange: `${addDays(75)} — ${addDays(100)}`,
        desc: "Rice grains fill with milk-like sap before hardening. Inspect fields daily to defend against invading Paddy Bugs.",
        fertilizerAdvisory: "Zero synthetic Nitrogen. Rely on soil reserve potassium.",
        waterRequirement: "Medium (Begin slow draining)",
        color: "border-l-amber-500 bg-amber-50/10"
      },
      {
        title: "Harvest Maturity Dry-out",
        interval: "Days 100 - 120",
        dateRange: `${addDays(100)} — ${addDays(120)}`,
        desc: "Grain clusters turn glorious golden brown. Standard moisture levels drop to 20-22%. Drain field completely.",
        fertilizerAdvisory: "No fertilization required. Allow natural drying.",
        waterRequirement: "Zero (Fields must be dry)",
        color: "border-l-amber-600 bg-amber-50/20"
      }
    ];
  };

  const selectedCal = activeCalendars.find((c) => c.id === selectedCalId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-2">
        <div>
          <h3 className="text-xl font-display font-semibold text-emerald-950 flex items-center gap-2">
            <Calendar className="text-emerald-700 w-5 h-5" /> {lang === "si" ? "බෝග වර්ධන දින දර්ශනය" : lang === "ta" ? "பயிர் வளர்ச்சி காலண்டர்" : "Aswanna Crop Growth Calendar"}
          </h3>
          <p className="text-xs text-gray-500">
            {lang === "si" ? "ඔබගේ බෝග වගාකළ දිනය ඇතුළත් කර කෘෂිකර්ම දෙපාර්තමේන්තුවේ නිර්දේශිත වර්ධන සංධිස්ථාන සහ පොහොර කාල සටහන ලබාගන්න." : lang === "ta" ? "உங்கள் நடவு காலக்கெடுவை திட்டமிட்டு, முறையான பயிர் வளர்ச்சி மைல்கற்களை உருவாக்குங்கள்." : "Plot your planting timelines and generate developmental milestones matching recommended Department of Agriculture crop intervals."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Schedulers manager sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-xs space-y-4">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold">
              {lang === "si" ? "නව දින දර්ශනයක් අරඹන්න" : lang === "ta" ? "புதிய காலண்டர் உருவாக்கு" : "Instantiate Timeline"}
            </span>

            <form onSubmit={handleCreateCalendar} className="space-y-3.5 text-xs text-gray-700">
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-0.5">
                  {lang === "si" ? "වගා කළ බෝගයේ නම" : lang === "ta" ? "பயிரிடப்பட்ட பயிரின் பெயர்" : "Crop Sown Name"}
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-850"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-0.5">
                  {lang === "si" ? "වගා කළ දිනය" : lang === "ta" ? "பயிரிடப்பட்ட தேதி" : "Planting Date Sown"}
                </label>
                <input
                  required
                  type="date"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-850 font-bold text-gray-800"
                  value={plantingDate}
                  onChange={(e) => setPlantingDate(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> {lang === "si" ? "දින දර්ශනය උත්පාදනය කරන්න" : lang === "ta" ? "வளர்ச்சி காலண்டர் துவங்கு" : "Launch Growth Calendar"}
              </button>
            </form>
          </div>

          {/* Active Calendars Selector List */}
          <div className="bg-white rounded-xl border border-gray-150 p-4 shadow-xs space-y-2.5">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold">
              {lang === "si" ? "ලියාපදිංචි දින දර්ශන" : lang === "ta" ? "பதிவு செய்யப்பட்ட காலண்டர்" : "Tracked Planting Calendars"}
            </span>
            <div className="space-y-2">
              {activeCalendars.map((cal) => {
                const isSelected = cal.id === selectedCalId;
                return (
                  <div
                    key={cal.id}
                    onClick={() => setSelectedCalId(cal.id)}
                    className={`cursor-pointer rounded-lg p-3 border transition-all flex justify-between items-center ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/30"
                        : "border-gray-100 hover:border-emerald-200 bg-gray-50/20"
                    }`}
                  >
                    <div className="space-y-0.5 text-xs max-w-[80%]">
                      <h5 className="font-bold text-gray-800 truncate">{cal.cropName}</h5>
                      <span className="text-[10px] text-gray-500 block">Sown: {new Date(cal.plantingDate).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteCalendar(cal.id, e)}
                      className="text-gray-300 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              {activeCalendars.length === 0 && (
                <div className="text-center py-6 text-gray-400 text-[11px] leading-relaxed">
                  {lang === "si" ? "ලියාපදිංචි කළ ක්‍රියාකාරී දින දර්ශන කිසිවක් නැත. ඉහතින් දත්ත ඇතුළත් කර අන්තර්ක්‍රියාකාරී පොහොර දින දර්ශනය ලබා ගන්න." : lang === "ta" ? "பதிவு செய்யப்பட்ட காலண்டர் எதுவும் இல்லை. மேலே உள்ளீடுகளை இட்டு உங்கள் காலண்டரை உருவாக்குங்கள்." : "No registered active plant timers. Input sowing details above to trigger interactive calendars with dynamic NPK notifications."}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Timelines stages output (8 cols) */}
        <div className="lg:col-span-8">
          {!selectedCal ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-16 text-center space-y-3 h-[420px] flex flex-col justify-center items-center">
              <Calendar className="w-12 h-12 text-slate-350" />
              <div className="space-y-1">
                <p className="font-display font-semibold text-gray-700 text-sm">
                  {lang === "si" ? "දින දර්ශන වැඩතලය හිස් ය" : lang === "ta" ? "காலண்டர் பணியிடம் காலியாக உள்ளது" : "Calendar Workspace Empty"}
                </p>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  {lang === "si" ? "වම් පසින් ඔබගේ බෝග විස්තර ලබා දෙන්න. අපි ඔබගේ වගාවේ වයස අනුව නිර්දේශිත පොහොර සහ කෘමි නාශක දින සැකසුම් සකස් කරන්නෙමු." : lang === "ta" ? "இடது பக்க பலகத்தில் பயிர் விபரங்களை வழங்கவும். நாங்கள் தாவர வயதிற்கு ஏற்ப உர கால அட்டவணையை தொகுப்போம்." : "Provide crop details and tilling dates on the left-panel dashboard. We will compile split fertilization and botanical treatment calendars tailored to plant age."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Timeline Header Summary Banner */}
              <div className="bg-emerald-900 text-white rounded-xl p-5 border border-emerald-800 flex justify-between items-center shadow-xs">
                <div className="space-y-1">
                  <span className="bg-emerald-500/30 text-emerald-200 text-[9.5px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-emerald-500/20">
                    {lang === "si" ? "සජීවී දින දර්ශන ප්‍රගතිය" : lang === "ta" ? "நேரடி கால முன்னேற்றம்" : "Live Scheduler Progress Indicators"}
                  </span>
                  <h4 className="text-lg font-display font-bold">{selectedCal.cropName}</h4>
                  <p className="text-xs text-emerald-100/90 flex items-center gap-1">
                    <Sprout className="w-3.5 h-3.5 text-emerald-400" /> {lang === "si" ? "වගා කළ දිනය" : lang === "ta" ? "பயிரிடப்பட்ட நாள்" : "Planted on"} {new Date(selectedCal.plantingDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-white/10 px-4 py-2.5 rounded-lg border border-white/10 text-center">
                  <span className="text-[9px] font-mono text-emerald-200 block leading-none mb-1">
                    {lang === "si" ? "මුළු කාලය" : lang === "ta" ? "மொத்த சுழற்சி" : "TOTAL CYCLE"}
                  </span>
                  <span className="text-base font-mono font-bold block">
                    {lang === "si" ? "දින 120" : lang === "ta" ? "120 நாட்கள்" : "120 Days"}
                  </span>
                </div>
              </div>

              {/* Step By Step Milestones Timeline */}
              <div className="space-y-4">
                <span className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold">
                  {lang === "si" ? "වර්ධන අවධි පිරික්සුම් ලක්ෂ්‍ය" : lang === "ta" ? "வளர்ச்சி காசோலை புள்ளிகள்" : "Stage developmental checkpoints"}
                </span>
                <div className="space-y-3">
                  {generateStages(selectedCal.plantingDate).map((stage, idx) => {
                    return (
                      <div
                        key={stage.title}
                        className={`border-l-4 rounded-r-xl p-4.5 border border-gray-150 transition-all flex flex-col md:flex-row md:justify-between gap-4 ${stage.color}`}
                      >
                        <div className="space-y-1.5 md:max-w-[70%]">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded shrink-0">
                              {lang === "si" ? "පියවර" : lang === "ta" ? "அவத்தை" : "Stage"} {idx+1}
                            </span>
                            <h5 className="font-display font-black text-gray-800 text-sm leading-none">{stage.title}</h5>
                          </div>
                          <span className="text-[10.5px] text-gray-500 font-mono block">{lang === "si" ? "කාලය" : lang === "ta" ? "காலஅளவு" : "Duration"}: {stage.dateRange} ({stage.interval})</span>
                          <p className="text-[11px] text-gray-600 leading-normal">{stage.desc}</p>
                          
                          <div className="bg-amber-500/5 p-2 rounded border border-amber-500/10 text-[10px] text-amber-900 mt-2">
                            <span className="font-bold uppercase tracking-wider font-mono text-[9px] block">
                              {lang === "si" ? "නියමිත පොහොර පිරිවිතරයන් සහ උපදෙස්:" : lang === "ta" ? "பரிந்துரைக்கப்பட்ட உர விவரங்கள்:" : "FERTILIZER SPECIFICATIONS DICTATED:"}
                            </span>
                            {stage.fertilizerAdvisory}
                          </div>
                        </div>

                        <div className="md:text-right flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-1 border-t md:border-t-0 md:border-l border-dashed border-gray-150 pt-2.5 md:pt-0 md:pl-4 min-w-[120px] shrink-0">
                          <div className="space-y-0.5">
                            <span className="text-[8.5px] font-mono text-gray-400 uppercase block tracking-wider">
                              {lang === "si" ? "ජල පාලනය" : lang === "ta" ? "நீர் மேலாண்மை" : "Water Level"}
                            </span>
                            <span className="text-[11px] text-sky-850 font-bold flex items-center gap-1 text-sky-700">
                              <Droplet className="w-3 h-3 text-sky-600" /> {stage.waterRequirement}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Farm Notes & Event Logs Logbook */}
              <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                  <span className="font-bold text-gray-800 block uppercase tracking-wider text-[11px] font-display flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-700" /> {lang === "si" ? "අස්වන්න දිනපොත සහ සිදුවීම් සටහන" : lang === "ta" ? "அஸ்வன்ன குறிப்பேடு & நிகழ்வுகள்" : "Aswanna Logbook & Events Journal"}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">
                    {lang === "si" ? "ප්‍රාදේශීය මතකයේ සුරැකේ" : lang === "ta" ? "உள்ளூர் சேமிப்பு கொண்டது" : "Records persistent locally"}
                  </span>
                </div>

                <form onSubmit={handleAddLog} className="flex gap-2 text-xs">
                  <input
                    type="text"
                    required
                    placeholder={lang === "si" ? "උදා: බීජ වැපිරීම සිදුකළා, වල් පැලෑටි ඉවත් කළා, කාබනික පොහොර දියර යෙදුවා..." : lang === "ta" ? "உதாரணம்: விதை விதைக்கப்பட்டது, களை எடுக்கப்பட்டது, திரவ உரம் தெளிக்கப்பட்டது..." : "e.g., Sowed seeds, Weed extraction completed, organic tea spray applied..."}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-850"
                    value={newLogText}
                    onChange={(e) => setNewLogText(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg px-4 py-1.5 font-bold tracking-wide text-xs shrink-0"
                  >
                    {lang === "si" ? "සටහන් කරන්න" : lang === "ta" ? "பதிக" : "Log Event"}
                  </button>
                </form>

                {/* Log entries lists */}
                <div className="space-y-2 mt-3 text-xs">
                  {selectedCal.logs.map((log) => {
                    return (
                      <div
                        key={log.id}
                        className="flex justify-between items-center p-3 rounded-lg border border-gray-100 bg-slate-50/50"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={log.done}
                            onChange={() => handleToggleLog(selectedCal.id, log.id)}
                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 shrink-0"
                          />
                          <span className={`text-[11.5px] ${log.done ? "line-through text-gray-400 font-light" : "text-gray-700 font-medium"}`}>
                            {log.content}
                          </span>
                        </div>
                        <span className="text-[9.5px] font-mono text-gray-400">{log.date}</span>
                      </div>
                    );
                  })}

                  {selectedCal.logs.length === 0 && (
                    <div className="text-center py-4 text-gray-400 text-[10.5px]">
                      Your logbook is clear. Document weed extraction timings or leaf spray records above for seasonal referencing.
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
