import React, { useState } from "react";
import { Language } from "./translations";
import AswannaLogo from "./AswannaLogo";
import { LogIn, UserPlus, Key, Phone, User, MapPin, Briefcase, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

interface AuthScreenProps {
  lang: Language;
  onLoginSuccess: (fullName: string, mobile: string, district: string, role: string) => void;
}

const DISTRICT_LIST = [
  { en: "Anuradhapura", si: "අනුරාධපුරය", ta: "அனுராதபுரம்" },
  { en: "Polonnaruwa", si: "පොළොන්නරුව", ta: "பொலன்னறுவை" },
  { en: "Kurunegala", si: "කුරුණෑගල", ta: "குருணாகல்" },
  { en: "Kandy", si: "මහනුවර", ta: "கண்டி" },
  { en: "Nuwara Eliya", si: "නුවරඑළිය", ta: "நுவரெலியா" },
  { en: "Badulla", si: "බදුල්ල", ta: "பதுளை" },
  { en: "Hambantota", si: "හම්බන්තොට", ta: "அம்பாந்தோட்டை" },
  { en: "Ampara", si: "அம்பாறை", ta: "அம்பாறை" },
  { en: "Jaffna", si: "යාපනය", ta: "யாழ்ப்பாணம்" },
  { en: "Colombo", si: "කොළඹ", ta: "கொழும்பு" }
];

const ROLE_LIST = [
  { en: "Paddy Rice Cultivator", si: "වී වගාකරු", ta: "நெல் விவசாயி" },
  { en: "Vegetable Crop Grower", si: "එළවළු වගාකරු", ta: "காய்கறி விவசாயி" },
  { en: "Fruit & Spice Cultivator", si: "පළතුරු සහ කුළුබඩු වගාකරු", ta: "பழம் மற்றும் மசாலா பயிர்செய்கையாளர்" },
  { en: "Agricultural Extension Officer", si: "කෘෂිකාර්මික ව්‍යාප්ති නිලධාරී", ta: "விவசாய விரிவாக்க அதிகாரி" },
  { en: "General Agro Enthusiast", si: "කෘෂි ලැදි සාමාන්‍ය පරිශීලක", ta: "பொது விவசாய ஆர்வலர்" }
];

export default function AuthScreen({ lang, onLoginSuccess }: AuthScreenProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [district, setDistrict] = useState("Anuradhapura");
  const [role, setRole] = useState("Paddy Rice Cultivator");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const tAuth = {
    en: {
      welcomeTitle: "Aswanna LK Agri-Intelligence",
      welcomeSubtitle: "Secure access for Sri Lankan growers and Extension Officers to run soil diagnostics, crop suitability grids, and active growth calendars.",
      loginTab: "Sign In",
      registerTab: "Join Aswanna",
      mobileLabel: "Mobile Number",
      mobilePlaceholder: "0771234567",
      passwordLabel: "Password Verification Key",
      passwordPlaceholder: "Enter security key",
      fullNameLabel: "Full Name",
      fullNamePlaceholder: "e.g., K. B. Gunawardene",
      districtLabel: "Cultivation District",
      roleLabel: "Agronomy Profile / Role",
      loginBtn: "Access Core Console",
      registerBtn: "Register Profile",
      errorUserNull: "Mobile number and password are required.",
      errorNoMatch: "Incorrect verification credentials.",
      errorAlreadyRegistered: "This mobile has registered profiles. Please Sign In."
    },
    si: {
      welcomeTitle: "අස්වන්න LK කෘෂි බුද්ධි පද්ධතිය",
      welcomeSubtitle: "පස විනිශ්චය, බෝග ගැළපුම සහ වගා දින දර්ශන සක්‍රීය කිරීමට ශ්‍රී ලාංකීය ගොවි මහත්වරුන් සහ ව්‍යාප්ති නිලධාරීන් සඳහා වූ ආරක්ෂිත පිවිසුම.",
      loginTab: "ඇතුළු වන්න",
      registerTab: "නව ගිණුමක් සකසන්න",
      mobileLabel: "ජංගම දුරකථන අංකය",
      mobilePlaceholder: "0771234567",
      passwordLabel: "මුරපදය (රහස් කේතය)",
      passwordPlaceholder: "රහස් කේතය ඇතුළත් කරන්න",
      fullNameLabel: "සම්පූර්ණ නම",
      fullNamePlaceholder: "උදා: කේ. බී. ගුණවර්ධන මයා",
      districtLabel: "වගා දිස්ත්‍රික්කය",
      roleLabel: "කෘෂිකාර්මික භූමිකාව",
      loginBtn: "පද්ධතියට ඇතුළු වන්න",
      registerBtn: "නොමිලේ ලියාපදිංචි වන්න",
      errorUserNull: "දුරකථන අංකය සහ මුරපදය අනිවාර්ය වේ.",
      errorNoMatch: "ඇතුළත් කළ කේතයන් වැරදි ය. නැවත උත්සාහ කරන්න.",
      errorAlreadyRegistered: "මෙම දුරකථන අංකය දැනටමත් ලියාපදිංචි වී ඇත. කරුණාකර ඇතුළු වන්න."
    },
    ta: {
      welcomeTitle: "அஸ்வன்ன LK விவசாய நுண்ணறிவு",
      welcomeSubtitle: "மண் கண்டறிதல், பயிர் பொருத்தம் மற்றும் வளர்ச்சி காலெண்டர்களை செயல்படுத்த இலங்கை விவசாயிகள் மற்றும் விரிவாக்க அதிகாரிகளுக்கான பாதுகாப்பான அணுகல்.",
      loginTab: "உள்நுழைக",
      registerTab: "புதிய கணக்கு",
      mobileLabel: "கைபேசி எண்",
      mobilePlaceholder: "0771234567",
      passwordLabel: "கடவுச்சொல்",
      passwordPlaceholder: "கடவுச்சொல்லை உள்ளிடவும்",
      fullNameLabel: "முழு பெயர்",
      fullNamePlaceholder: "உதாரணம்: கே. பி. குணவர்தன",
      districtLabel: "விவசாய மாவட்டம்",
      roleLabel: "விவசாய சுயவிவரம்",
      loginBtn: "அமைப்பில் உள்நுழைக",
      registerBtn: "பதிவு செய்க",
      errorUserNull: "கைபேசி எண் மற்றும் கடவுச்சொல் தேவை.",
      errorNoMatch: "தவறான நற்சான்றிதழ்கள்.",
      errorAlreadyRegistered: "கைபேசி எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது."
    }
  }[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!mobile.trim() || !password.trim()) {
      setErrorMessage(tAuth.errorUserNull);
      return;
    }

    const savedRegistry = localStorage.getItem("aswanna_auth_users");
    let usersList = savedRegistry ? JSON.parse(savedRegistry) : [];

    if (isRegisterMode) {
      if (!fullName.trim()) {
        setErrorMessage(lang === "si" ? "කරුණාකර සම්පූර්ණ නම ඇතුළත් කරන්න." : lang === "ta" ? "முழு பெயரை உள்ளிடவும்." : "Please enter full name.");
        return;
      }

      const existing = usersList.find((u: any) => u.mobile === mobile.trim());
      if (existing) {
        setErrorMessage(tAuth.errorAlreadyRegistered);
        return;
      }

      const newUser = {
        fullName,
        mobile: mobile.trim(),
        district,
        role,
        password: password.trim()
      };

      usersList.push(newUser);
      localStorage.setItem("aswanna_auth_users", JSON.stringify(usersList));

      onLoginSuccess(fullName, mobile.trim(), district, role);
    } else {
      const user = usersList.find((u: any) => u.mobile === mobile.trim() && u.password === password.trim());
      if (user) {
        onLoginSuccess(user.fullName, user.mobile, user.district, user.role);
      } else {
        if (mobile === "0771234567" && password === "1234") {
          onLoginSuccess("K. B. Gunawardene", "0771234567", "Anuradhapura", "Paddy Rice Cultivator");
        } else if (mobile === "0779998888" && password === "5678") {
          onLoginSuccess("Dr. Nimal Bandara", "0779998888", "Polonnaruwa", "Agricultural Extension Officer");
        } else {
          setErrorMessage(tAuth.errorNoMatch);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-radial from-emerald-950 via-slate-950 to-slate-950 text-white">
      <div className="absolute inset-0 opacity-15 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[330px] h-[330px] rounded-full bg-emerald-500 blur-3xl animate-bounce" style={{ animationDuration: "25s" }}></div>
        <div className="absolute bottom-[20%] right-[30%] w-[450px] h-[450px] rounded-full bg-teal-500 blur-3xl animate-pulse" style={{ animationDuration: "35s" }}></div>
      </div>

      <div className="w-full max-w-lg relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-7 md:p-9 shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <AswannaLogo className="w-14 h-14 mx-auto text-emerald-400" />
            <h2 className="text-2xl font-display font-black tracking-tight text-white mt-3">
              {tAuth.welcomeTitle}
            </h2>
            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
              {tAuth.welcomeSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 p-1 bg-slate-850 rounded-xl text-xs font-bold border border-slate-800">
            <button
              onClick={() => { setIsRegisterMode(false); setErrorMessage(""); }}
              className={`py-2 rounded-lg transition-all ${!isRegisterMode ? "bg-emerald-600 text-white shadow-xs" : "text-gray-400 hover:text-white"}`}
            >
              <LogIn className="w-3.5 h-3.5 inline mr-1.5 align-text-bottom" />
              {tAuth.loginTab}
            </button>
            <button
              onClick={() => { setIsRegisterMode(true); setErrorMessage(""); }}
              className={`py-2 rounded-lg transition-all ${isRegisterMode ? "bg-emerald-600 text-white shadow-xs" : "text-gray-400 hover:text-white"}`}
            >
              <UserPlus className="w-3.5 h-3.5 inline mr-1.5 align-text-bottom" />
              {tAuth.registerTab}
            </button>
          </div>

          {errorMessage && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs p-3 rounded-xl font-medium leading-normal text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium text-gray-300">
            {isRegisterMode && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1"
              >
                <label className="block text-slate-400 uppercase tracking-widest text-[9px] font-mono">
                  {tAuth.fullNameLabel}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    placeholder={tAuth.fullNamePlaceholder}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </motion.div>
            )}

            <div className="space-y-1">
              <label className="block text-slate-400 uppercase tracking-widest text-[9px] font-mono">
                {tAuth.mobileLabel}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  required
                  type="text"
                  maxLength={10}
                  placeholder={tAuth.mobilePlaceholder}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white tracking-widest font-mono text-[13px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-400 uppercase tracking-widest text-[9px] font-mono">
                {tAuth.passwordLabel}
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder={tAuth.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegisterMode && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="grid grid-cols-2 gap-3"
              >
                <div className="space-y-1">
                  <label className="block text-slate-400 uppercase tracking-widest text-[9px] font-mono">
                    {tAuth.districtLabel}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none text-[11.5px]"
                    >
                      {DISTRICT_LIST.map((d) => (
                        <option key={d.en} value={d.en} className="bg-slate-900 text-white">
                          {lang === "si" ? d.si : lang === "ta" ? d.ta : d.en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-400 uppercase tracking-widest text-[9px] font-mono">
                    {tAuth.roleLabel}
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none text-[11.5px]"
                    >
                      {ROLE_LIST.map((r) => (
                        <option key={r.en} value={r.en} className="bg-slate-900 text-white text-[11px]">
                          {lang === "si" ? r.si : lang === "ta" ? r.ta : r.en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-xs tracking-wider uppercase transition-all duration-200 mt-2 shadow-lg"
            >
              {isRegisterMode ? tAuth.registerBtn : tAuth.loginBtn}
            </button>
          </form>

          {!isRegisterMode && (
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 text-center font-bold">
                Quick Demo Access Accounts
              </p>
              <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setMobile("0771234567");
                    setPassword("1234");
                  }}
                  className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 text-left transition-all group"
                >
                  <span className="block text-[8px] text-emerald-400 font-mono font-bold uppercase tracking-wider group-hover:text-emerald-300">
                    🌾 Grower Profile
                  </span>
                  <span className="font-mono text-xs block mt-0.5">0771234567</span>
                  <span className="text-[9px] text-slate-400">PW: 1234</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobile("0779998888");
                    setPassword("5678");
                  }}
                  className="p-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 text-teal-300 text-left transition-all group"
                >
                  <span className="block text-[8px] text-teal-400 font-mono font-bold uppercase tracking-wider group-hover:text-teal-300">
                    🔬 Extension Officer
                  </span>
                  <span className="font-mono text-xs block mt-0.5">0779998888</span>
                  <span className="text-[9px] text-slate-400">PW: 5678</span>
                </button>
              </div>
            </div>
          )}

          <div className="text-center pt-2 border-t border-slate-800 text-[10px] text-gray-500 font-mono flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Govijana Seva Direct Registry Synchronizer Active
          </div>
        </motion.div>
      </div>
    </div>
  );
}
