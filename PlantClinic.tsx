import React, { useState } from "react";
import { FarmPlot, DiagnosisReport } from "../types";
import { Language, translations } from "../translations";
import { 
  ShieldAlert, 
  Leaf, 
  Flame, 
  Activity, 
  Camera, 
  Upload, 
  HelpCircle, 
  Sparkles,
  RefreshCw,
  Clock,
  HeartOff,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { motion } from "motion/react";

interface PlantClinicProps {
  activePlot: FarmPlot | null;
  lang: Language;
}

// Typical crop diseases presets for easy testing
const PRESET_DISEASES = [
  {
    name: "Standard Paddy (Rice) Leaf",
    crop: "Paddy Rice",
    symptoms: "Yellowing tips, brown diamond-shaped spindle spots with grey centers on leaves.",
    imageUrl: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=600",
    description: "Classic symptoms of fungal Rice Blast (Pyrichularia) found around Pollonnaruwa fields."
  },
  {
    name: "Coconut Trunk Oozing",
    crop: "Coconut Palm",
    symptoms: "Small holes in palm trunk, oozing dark brown gummy sap, chewed wooden fiber debris.",
    imageUrl: "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&q=80&w=600",
    description: "Suspicion of infestation by devastating Red Palm Weevil larvae drilling into leaf crowns."
  },
  {
    name: "Tomato or Chili Bunching",
    crop: "Hot Chili / Tomato",
    symptoms: "Upward leaf rolling, thickening and wrinkling of veins, severe stunted vegetative shoots.",
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600",
    description: "Suspected Chili Leaf Curl Complex spread by sap-sucking whiteflies during dry wind intervals."
  }
];

export default function PlantClinic({ activePlot, lang }: PlantClinicProps) {
  const t = translations[lang];
  const [cropName, setCropName] = useState("Paddy Rice");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<DiagnosisReport | null>(null);
  
  // Custom camera view finder simulation
  const [viewfinderActive, setViewfinderActive] = useState(false);
  const [uploadOption, setUploadOption] = useState<"upload" | "presets" | "camera">("presets");
  const [imagePreview, setImagePreview] = useState<string | null>(PRESET_DISEASES[0].imageUrl);
  const [mimeType, setMimeType] = useState<string | null>("image/jpeg");

  // Handle Preset selection for frictionless demo
  const handleSelectPreset = (preset: typeof PRESET_DISEASES[0]) => {
    setCropName(preset.crop);
    setSymptoms(preset.symptoms);
    setImagePreview(preset.imageUrl);
    setMimeType("image/jpeg");
  };

  // Convert uploaded files to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("File size exceeds 8MB limit. Please upload a smaller photo.");
        return;
      }
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      alert("Please describe the leaf/stem symptoms first.");
      return;
    }
    
    setLoading(true);
    setReport(null);

    // Prepare body
    const body: any = {
      cropName,
      symptoms,
    };

    if (imagePreview && imagePreview.startsWith("data:")) {
      body.imageBase64 = imagePreview;
      body.imageMimeType = mimeType || "image/jpeg";
    }

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Diagnosis failed");
      }

      const data = await response.json();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score > 85) return "text-emerald-600";
    if (score > 60) return "text-amber-600";
    return "text-slate-500";
  };

  const severityColor = (sev: string) => {
    switch (sev) {
      case "Severe": return "bg-rose-100 text-rose-800 border-rose-200 animate-pulse";
      case "Moderate": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-teal-100 text-teal-800 border-teal-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 gap-2">
        <div>
          <h3 className="text-xl font-display font-semibold text-emerald-950 flex items-center gap-2">
            <ShieldAlert className="text-emerald-700 w-5 h-5" /> {lang === "si" ? "පැලෑටි සායනය සහ රෝග නිර්ණය" : lang === "ta" ? "பயிர் நோய் கண்டறிதல் மற்றும் சிகிச்சை" : "Plant Clinic Pathology Advisor"}
          </h3>
          <p className="text-xs text-gray-500">
            {lang === "si" ? "බෝග රෝග හඳුනාගෙන ඒවාට අනුමත රසායනික ප්‍රතිකාර මෙන්ම කාබනික පරිසර හිතකාමී පළිබෝධනාශක උපදෙස් ලබාගන්න." : lang === "ta" ? "பயிர் நோய்களைக் கண்டறிந்து, அங்கீகரிக்கப்பட்ட இரசாயன சிகிச்சைகள் மற்றும் நிலையான தாவர பூச்சிக்கொல்லிகளைப் பெறுங்கள்." : "Diagnose plant conditions and retrieve authorized chemical treatments alongside sustainable botanical bio-pesticides."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Diagnostics Form panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-150 p-5 shadow-xs space-y-4">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold">{t.pathologyScanner}</span>

          {/* Input Method Switcher */}
          <div className="grid grid-cols-3 bg-gray-100 rounded-lg p-1 text-[11px] font-medium text-gray-600">
            <button
              onClick={() => {
                setUploadOption("presets");
                setImagePreview(PRESET_DISEASES[0].imageUrl);
              }}
              className={`py-1.5 rounded-md text-center transition-all ${
                uploadOption === "presets" ? "bg-white text-emerald-800 shadow-3xs" : ""
              }`}
            >
              {lang === "si" ? "ආදර්ශ සාම්පල" : lang === "ta" ? "மாதிரி" : "Demo Leaves"}
            </button>
            <button
              onClick={() => {
                setUploadOption("upload");
                setImagePreview(null);
              }}
              className={`py-1.5 rounded-md text-center transition-all ${
                uploadOption === "upload" ? "bg-white text-emerald-800 shadow-3xs" : ""
              }`}
            >
              {lang === "si" ? "ඡායාරූපය" : lang === "ta" ? "புகைப்படம்" : "Photo Upload"}
            </button>
            <button
              onClick={() => {
                setUploadOption("camera");
                setImagePreview(null);
                setViewfinderActive(true);
              }}
              className={`py-1.5 rounded-md text-center transition-all ${
                uploadOption === "camera" ? "bg-white text-emerald-800 shadow-3xs" : ""
              }`}
            >
              {lang === "si" ? "ලයිව් කැමරා" : lang === "ta" ? "கேமரா" : "Live Camera"}
            </button>
          </div>

          {/* Interactive view areas based on select method */}
          {uploadOption === "presets" && (
            <div className="space-y-2">
              <span className="text-[10px] text-gray-450 font-mono block">CLICK PRESET SPECIMEN</span>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_DISEASES.map((d) => {
                  const isActive = imagePreview === d.imageUrl;
                  return (
                    <button
                      key={d.name}
                      type="button"
                      onClick={() => handleSelectPreset(d)}
                      className={`text-[10px] border rounded-lg text-left p-1.5 transition-all text-xs flex flex-col justify-between h-[85px] leading-tight ${
                        isActive
                          ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500/15"
                          : "border-gray-150 hover:border-gray-250 bg-gray-50/40"
                      }`}
                    >
                      <span className="font-bold text-gray-700 block line-clamp-1">{d.crop}</span>
                      <span className="text-[9px] text-gray-400 line-clamp-2 block mb-1">{d.name}</span>
                      <img src={d.imageUrl} className="w-full h-8 object-cover rounded" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {uploadOption === "upload" && (
            <div className="space-y-1">
              <span className="text-[10px] text-gray-450 font-mono block uppercase">Drag and Drop Plant Crop Leaves</span>
              <div className="border border-dashed border-gray-200 hover:border-emerald-300 transition-all rounded-xl p-6 text-center bg-gray-50/20">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="drop-clinic-file"
                  onChange={handleFileChange}
                />
                <label htmlFor="drop-clinic-file" className="cursor-pointer space-y-2 block">
                  <Upload className="w-8 h-8 text-slate-350 mx-auto" />
                  <div>
                    <span className="text-xs font-semibold text-emerald-700 block hover:underline">Choose file</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">JPEG, PNG up to 8MB size</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {uploadOption === "camera" && viewfinderActive && (
            <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex flex-col justify-center items-center text-center p-4 border border-slate-700">
              <Camera className="w-10 h-10 text-emerald-500 animate-pulse" />
              <div className="space-y-1.5 mt-2 max-w-xs">
                <span className="text-white text-[11px] font-sans block">Agri-Scanner viewfinder is starting...</span>
                <p className="text-[9.5px] text-slate-400 leading-normal">
                  (Note: Allow camera authorization permissions inside frame to use system lenses. Click below to take simulated capture.)
                </p>
                <button
                  type="button"
                  onClick={() => {
                    // Inject a random realistic leaf picture
                    setImagePreview(PRESET_DISEASES[Math.floor(Math.random() * PRESET_DISEASES.length)].imageUrl);
                    setViewfinderActive(false);
                  }}
                  className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-3 py-1 rounded"
                >
                  Trigger Photo Capture
                </button>
              </div>
            </div>
          )}

          {/* Selected leaf canvas crop view */}
          {imagePreview && (
            <div className="border border-emerald-100 rounded-lg p-2.5 bg-slate-50 relative flex gap-2.5 items-center">
              <img src={imagePreview} className="w-16 h-12 object-cover rounded-md" referrerPolicy="no-referrer" />
              <div className="text-[11px] space-y-0.5 max-w-[70%]">
                <span className="text-[9px] font-mono text-emerald-600 block leading-none">CROP INFESTATION TARGET READY</span>
                <span className="font-semibold text-gray-700 block line-clamp-1">Analyzing visual pattern</span>
                <button
                  onClick={() => setImagePreview(null)}
                  className="text-red-500 text-[9.5px] hover:underline"
                >
                  Remove visual target
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleDiagnose} className="space-y-3.5 text-xs text-gray-700 border-t border-gray-100 pt-3">
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-0.5">{t.victimCrop}</label>
              <input
                required
                type="text"
                placeholder={lang === "si" ? "උදා: කීරි සම්බා, වම්බටු, කුරුඳු පඳුරු" : lang === "ta" ? "உதாரணம்: சம்பா நெல், கத்தரிக்காய், கருவா பட்டை" : "e.g., Keeri Samba Paddy, Brinjal, Cinnamon Bush"}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-850 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-0.5">{t.observedSymptoms}</label>
              <textarea
                required
                rows={3}
                placeholder={lang === "si" ? "පත්‍රවල ලප, කෘමි සලකුණු, කඳේ හානි ආදී ඔබ නිරීක්ෂණය කළ රෝග ලක්ෂණ ලියන්න..." : lang === "ta" ? "இலை புள்ளிகள், பூச்சி அடையாளங்கள், தண்டு பாதிப்பு போன்ற அறிகுறிகளை எழுதுங்கள்..." : "List leaf spots details, pest traces, stem damage, browning node lines, or insect sizes seen..."}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-850 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white font-medium py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {lang === "si" ? "ගැඹුරු ස්කෑන් කිරීමක් ක්‍රියාවෙහි පවතී..." : lang === "ta" ? "ஆய்வு செய்யப்படுகிறது..." : "Deep Diagnostic Scan in Progress..."}
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5" /> {t.diagnoseButton}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results section (7 cols) */}
        <div className="lg:col-span-7">
          {loading && (
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-12 text-center flex flex-col justify-center items-center h-[460px] space-y-4">
              <Leaf className="w-16 h-16 text-emerald-700 animate-bounce" />
              <div className="space-y-1">
                <p className="font-display font-bold text-gray-800 text-base">
                  {lang === "si" ? "පැලෑටි සෛල හා පටක විශ්ලේෂණය" : lang === "ta" ? "பயிர் திசுக்கள் ஆய்வு செய்யப்படுகிறது" : "Decrypting Pathogen Micro-signs"}
                </p>
                <p className="text-xs text-emerald-850 font-mono tracking-wide">
                  &quot;{lang === "si" ? "ශ්‍රී ලංකාවේ නිවර්තන කලාපීය බෝග රෝග දත්ත ගබඩාවන් හරහා තොරතුරු පිරික්සමින්..." : lang === "ta" ? "இலங்கையின் வெப்பமண்டல பயிர் நோய் விவரங்களுடன் ஒப்பிடப்படுகிறது..." : "Parsing crop tissues through tropical disease libraries in Sri Lanka..."}&quot;
                </p>
              </div>
            </div>
          )}

          {!loading && !report && (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-16 text-center space-y-3 h-[460px] flex flex-col justify-center items-center">
              <HeartOff className="w-12 h-12 text-slate-350" />
              <div className="space-y-1 max-w-sm">
                <p className="font-display font-semibold text-gray-700 text-sm">
                  {lang === "si" ? "රෝග නිර්ණය තෙක් බලා සිටී" : lang === "ta" ? "நோய் பகுப்பாய்விற்காக காத்திருக்கிறது" : "Waiting Crop Pathology Selection"}
                </p>
                <p className="text-xs text-gray-400">
                  {lang === "si" ? "ඉහතින් ආදර්ශ පත්‍රයක් තෝරන්න, නැතහොත් ඔබගේම වගාවක ඡායාරූපයක් ඇතුළත් කරන්න. රෝග නිර්ණය කිරීම මඟින් කෘතිම බුද්ධිය හරහා රෝග කාරක බීජාණු හඳුනාගැනීමට හැකිවේ." : lang === "ta" ? "ஒரு மாதிரி இலையைத் தேர்ந்தெடுக்கவும் அல்லது உங்கள் சொந்த புகைப்படத்தைப் பதிவேற்றவும். நோய் கண்டறிதல் உடனடியாக நோய் காரணிகளைத் தனிமைப்படுத்த உதவும்." : "Select a preset leaf above or upload your own leaf picture. Running the diagnosis triggers Gemini plant pathologists to isolate pathogen strains instantly."}
                </p>
              </div>
            </div>
          )}

          {!loading && report && (
            <div className="space-y-5">
              {/* Core Diagnosis Card */}
              <div className="bg-white border border-gray-150 rounded-xl p-5 shadow-xs relative overflow-hidden">
                {/* Severity Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold uppercase border px-2.5 py-0.5 rounded-full ${severityColor(report.severity)}`}>
                    {report.severity} Threat
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-0.5">
                    <span className="text-[9.5px] font-mono text-gray-400 uppercase tracking-widest block">DIAGNOSTIC CLINIC FINDING</span>
                    <h4 className="text-lg font-display font-extrabold text-[#113a17]">{report.diagnosis}</h4>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>Pathogen Confidence:</span>
                    <span className={`font-mono font-bold ${scoreColor(report.probability)}`}>{report.probability}%</span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {report.urgencyScale}
                    </span>
                  </div>

                  <div className="bg-emerald-50/50 p-3.5 rounded-lg border border-emerald-100 text-xs text-emerald-950 space-y-1 mt-1.5">
                    <p className="font-semibold text-[11px] uppercase tracking-wider text-emerald-800">Biological Progression Details:</p>
                    <p className="leading-relaxed font-sans text-[11.5px] text-gray-700">{report.cause}</p>
                  </div>
                </div>
              </div>

              {/* Verified Leaf Symptoms Checklist */}
              <div className="bg-slate-50/50 border border-slate-150 rounded-xl p-4.5 space-y-2.5 text-xs">
                <span className="font-bold text-gray-800 block uppercase tracking-wider text-[11px] font-display">Leaf symptoms matching the pattern:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11.5px] text-gray-600">
                  {report.symptomsConfirmed.map((s, i) => (
                    <div key={i} className="flex gap-2 items-start bg-white p-2.5 rounded-md border border-slate-100/80">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* dual treatment protocols: organic botanical tea vs sri lanka approved chemical sprays */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Organic botanical controls */}
                <div className="bg-amber-50/40 border border-amber-200/50 rounded-xl p-4.5 space-y-2 text-xs">
                  <span className="font-bold text-amber-950 block uppercase tracking-wider text-[11px] font-display flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600" /> 1st Defense: Organic Botanical Prescriptions
                  </span>
                  <ul className="space-y-2 text-gray-700 text-[11px] pl-3.5 list-decimal leading-relaxed">
                    {report.treatmentOrganic.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>

                {/* Approved systemic chemical controls */}
                <div className="bg-blue-50/20 border border-blue-200/50 rounded-xl p-4.5 space-y-2 text-xs">
                  <span className="font-bold text-blue-950 block uppercase tracking-wider text-[11px] font-display flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-500" /> Govijana Seva Approved Chemicals
                  </span>
                  <ul className="space-y-2 text-gray-700 text-[11px] pl-3.5 list-decimal leading-relaxed">
                    {report.treatmentChemical.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>

              {/* Preventative measures standard policy guidelines */}
              <div className="bg-white border border-gray-150 rounded-xl p-4 text-xs space-y-2 shadow-2xs">
                <span className="font-bold text-gray-800 block uppercase tracking-wider text-[11px] font-display">Long-Term Preventative Regimes</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {report.preventativeMeasures.map((measure, idx) => {
                    return (
                      <div key={idx} className="bg-gray-50/50 p-2.5 rounded border border-gray-100 text-[11px] text-gray-600">
                        <span className="font-bold text-emerald-800 block mb-0.5">Phase {idx+1}</span>
                        {measure}
                      </div>
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
