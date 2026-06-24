import React, { useState, useEffect } from "react";
import { FarmPlot, AgroEcologicalZone, SoilType } from "./types";
import AswannaLogo from "./components/AswannaLogo";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./components/Dashboard";
import CropAdvisor from "./components/CropAdvisor";
import PlantClinic from "./components/PlantClinic";
import SoilHealth from "./components/SoilHealth";
import GrowthCalendar from "./components/GrowthCalendar";
import ChatAdvisor from "./components/ChatAdvisor";
import MarketHub from "./components/MarketHub";
import AgriCalculator from "./components/AgriCalculator";
import HusbandryHub from "./components/HusbandryHub";
import { themes, ThemeType, ThemeStyles } from "./theme";
import { Language, translations } from "./translations";
import { 
  Sprout, 
  Layers, 
  Compass, 
  ShieldAlert, 
  Atom, 
  CalendarDays, 
  MessageSquareReply, 
  HelpCircle,
  MapPin,
  Flame,
  Info,
  Calendar,
  Sparkles,
  ShoppingBag,
  Calculator,
  Paintbrush,
  Languages,
  LogOut,
  User as UserIcon,
  Heart,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Initial typical mock plot to populate the app on first boot (Wet/Dry balance)
const DEFAULT_PLOTS: FarmPlot[] = [
  {
    id: "1",
    name: "Anuradhapura Paddy Basin A",
    sizeAcres: 2.5,
    zone: AgroEcologicalZone.DRY_ZONE,
    soilType: SoilType.RED_REDDISH_BROWN,
    ph: 6.3,
    nitrogen: "Low",
    phosphorus: "Low",
    potassium: "Medium",
    waterSource: "Irrigation Tank (Wewa)",
    currentCrop: "Paddy Rice (Basmati BG-360)"
  },
  {
    id: "2",
    name: "Kandy Cardamom Backyard Lot",
    sizeAcres: 0.8,
    zone: AgroEcologicalZone.WET_ZONE,
    soilType: SoilType.RED_YELLOW_PODZOLIC,
    ph: 5.8,
    nitrogen: "Medium",
    phosphorus: "Low",
    potassium: "Low",
    waterSource: "Rainfed Only",
    currentCrop: "Ceylon Cardamom"
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ fullName: string; mobile: string; district: string; role: string } | null>(() => {
    const saved = localStorage.getItem("aswanna_user_session");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<"dashboard" | "advisor" | "clinic" | "soil" | "calendar" | "chat" | "market" | "calculator" | "husbandry">("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [plots, setPlots] = useState<FarmPlot[]>([]);
  const [activePlot, setActivePlot] = useState<FarmPlot | null>(null);
  const [currentTime, setCurrentTime] = useState("2026-06-22T10:45:00-07:00");

  // Localisation and Theme State
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("aswanna_lang") as Language) || "en";
  });
  const [theme, setTheme] = useState<ThemeType>(() => {
    return (localStorage.getItem("aswanna_theme") as ThemeType) || "forest";
  });

  const t = translations[lang];
  const themeStyles = themes[theme];

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("aswanna_lang", newLang);
  };

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem("aswanna_theme", newTheme);
  };

  const handleLoginSuccess = (fullName: string, mobile: string, district: string, role: string) => {
    const session = { fullName, mobile, district, role };
    setCurrentUser(session);
    localStorage.setItem("aswanna_user_session", JSON.stringify(session));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("aswanna_user_session");
    setActiveTab("dashboard");
  };

  // Load user registered plots
  useEffect(() => {
    if (!currentUser) {
      setPlots([]);
      setActivePlot(null);
      return;
    }
    const storageKey = `aswanna_plots_${currentUser.mobile}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPlots(parsed);
        if (parsed.length > 0) {
          setActivePlot(parsed[0]);
        } else {
          setActivePlot(null);
        }
      } catch (e) {
        console.error(e);
        setPlots(DEFAULT_PLOTS);
        setActivePlot(DEFAULT_PLOTS[0]);
      }
    } else {
      setPlots(DEFAULT_PLOTS);
      setActivePlot(DEFAULT_PLOTS[0]);
      localStorage.setItem(storageKey, JSON.stringify(DEFAULT_PLOTS));
    }
  }, [currentUser]);

  // Update central plots lists
  const handleAddPlot = (newPlot: FarmPlot) => {
    const updated = [newPlot, ...plots];
    setPlots(updated);
    setActivePlot(newPlot);
    if (currentUser) {
      localStorage.setItem(`aswanna_plots_${currentUser.mobile}`, JSON.stringify(updated));
    }
  };

  const handleDeletePlot = (id: string) => {
    const updated = plots.filter((p) => p.id !== id);
    setPlots(updated);
    if (activePlot?.id === id) {
      setActivePlot(updated.length > 0 ? updated[0] : null);
    }
    if (currentUser) {
      localStorage.setItem(`aswanna_plots_${currentUser.mobile}`, JSON.stringify(updated));
    }
  };

  const handleSelectPlot = (plot: FarmPlot) => {
    setActivePlot(plot);
  };

  if (!currentUser) {
    return <AuthScreen lang={lang} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-350 ${themeStyles.background}`}>
      
      {/* Premium Top Navigation header bar */}
      <header className={`sticky top-0 z-50 transition-colors duration-350 border-b backdrop-blur-md shadow-2xs ${
        theme === "harvester" ? "bg-[#111e16]/95 border-[#1d3527]" : "bg-white/95 border-emerald-100"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo brand module */}
          <div className="flex items-center gap-3 shrink-0">
            <AswannaLogo className="w-10 h-10" textSize="md" />
            <span className={`hidden md:inline-block text-[11px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded uppercase ${
              theme === "harvester" ? "bg-[#182b20] text-emerald-400" : "bg-emerald-50 text-emerald-800"
            }`}>
              {t.tagline}
            </span>
          </div>

          {/* UNIFIED CONTROLS (Single responsive set of actions) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Active Plot status pill */}
            {activePlot && (
              <div className={`hidden sm:flex items-center gap-1.5 border rounded-xl px-3 py-1.5 text-[11px] font-bold ${
                theme === "harvester" 
                  ? "bg-[#14281b] border-[#22442e] text-emerald-400" 
                  : "bg-emerald-50 border-emerald-100 text-emerald-900"
              }`}>
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate max-w-[120px]">{activePlot.name}</span>
              </div>
            )}

            {/* Quick multi-language switch direct helper */}
            <button
              onClick={() => handleLangChange(lang === "en" ? "si" : lang === "si" ? "ta" : "en")}
              className={`px-3 py-1.5 rounded-xl text-[10.5px] font-black border transition-all ${
                theme === "harvester" ? "bg-[#14281b] border-[#1d3527] text-emerald-400" : "bg-slate-150 border-slate-200 text-slate-800"
              }`}
            >
              {lang === "en" ? "EN" : lang === "si" ? "සිං" : "த"}
            </button>

            {/* Hamburger trigger button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2.5 rounded-xl border transition-colors ${
                theme === "harvester" 
                  ? "bg-[#14281b] border-[#22442e] text-emerald-400 hover:bg-[#183222]" 
                  : "bg-emerald-50/50 border-emerald-100 text-emerald-900 hover:bg-emerald-100/50"
              }`}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* UNIFIED SLIDE-DOWN DRAWER PANEL */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`border-t overflow-hidden ${
                theme === "harvester" ? "bg-[#0b150f] border-[#1d3527]" : "bg-emerald-50/95 border-emerald-100"
              }`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5 text-xs">
                
                {/* 1. Active Plot Dropdown if any */}
                {plots.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">{t.activeContext}</span>
                    <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 font-semibold ${
                      theme === "harvester" ? "bg-[#14281b] border-[#22442e]" : "bg-white border-emerald-200"
                    }`}>
                      <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                      <select
                        className="w-full bg-transparent font-bold focus:outline-none cursor-pointer text-inherit"
                        value={activePlot?.id || ""}
                        onChange={(e) => {
                          const target = plots.find((p) => p.id === e.target.value);
                          if (target) {
                            setActivePlot(target);
                            setIsMobileMenuOpen(false);
                          }
                        }}
                      >
                        {plots.map((p) => (
                          <option key={p.id} value={p.id} className="text-gray-800 bg-white">
                            {p.name} ({p.sizeAcres} {t.acres})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* 2. Primary Tabs List */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">App Navigation</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    
                    {/* Dashboard */}
                    <button
                      onClick={() => { setActiveTab("dashboard"); setIsMobileMenuOpen(false); }}
                      className={`p-3 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left ${
                        activeTab === "dashboard" ? themeStyles.tabActive : themeStyles.tabInactive
                      }`}
                    >
                      <Compass className="w-4 h-4 shrink-0" />
                      <span>{t.tabs.dashboard}</span>
                    </button>

                    {/* Advisor */}
                    <button
                      onClick={() => { setActiveTab("advisor"); setIsMobileMenuOpen(false); }}
                      className={`p-3 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left ${
                        activeTab === "advisor" ? themeStyles.tabActive : themeStyles.tabInactive
                      }`}
                    >
                      <Sprout className="w-4 h-4 shrink-0" />
                      <span>{t.tabs.advisor}</span>
                    </button>

                    {/* Plant Pathologist (Clinic) */}
                    <button
                      onClick={() => { setActiveTab("clinic"); setIsMobileMenuOpen(false); }}
                      className={`p-3 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left ${
                        activeTab === "clinic" ? themeStyles.tabActive : themeStyles.tabInactive
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{t.tabs.clinic}</span>
                    </button>

                    {/* Smart Soil Clinic */}
                    <button
                      onClick={() => { setActiveTab("soil"); setIsMobileMenuOpen(false); }}
                      className={`p-3 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left ${
                        activeTab === "soil" ? themeStyles.tabActive : themeStyles.tabInactive
                      }`}
                    >
                      <Atom className="w-4 h-4 shrink-0" />
                      <span>{t.tabs.soil}</span>
                    </button>

                    {/* Planting Scheduler */}
                    <button
                      onClick={() => { setActiveTab("calendar"); setIsMobileMenuOpen(false); }}
                      className={`p-3 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left ${
                        activeTab === "calendar" ? themeStyles.tabActive : themeStyles.tabInactive
                      }`}
                    >
                      <CalendarDays className="w-4 h-4 shrink-0" />
                      <span>{t.tabs.calendar}</span>
                    </button>

                    {/* Market Price Hub */}
                    <button
                      onClick={() => { setActiveTab("market"); setIsMobileMenuOpen(false); }}
                      className={`p-3 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left ${
                        activeTab === "market" ? themeStyles.tabActive : themeStyles.tabInactive
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <span>{t.tabs.market}</span>
                    </button>

                    {/* Fertilizer & NPK */}
                    <button
                      onClick={() => { setActiveTab("calculator"); setIsMobileMenuOpen(false); }}
                      className={`p-3 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left ${
                        activeTab === "calculator" ? themeStyles.tabActive : themeStyles.tabInactive
                      }`}
                    >
                      <Calculator className="w-4 h-4 shrink-0" />
                      <span>{t.tabs.calculator}</span>
                    </button>

                    {/* Agronomist Chatbot */}
                    <button
                      onClick={() => { setActiveTab("chat"); setIsMobileMenuOpen(false); }}
                      className={`p-3 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left ${
                        activeTab === "chat" ? themeStyles.tabActive : themeStyles.tabInactive
                      }`}
                    >
                      <MessageSquareReply className="w-4 h-4 shrink-0" />
                      <span>{t.tabs.chat}</span>
                    </button>

                    {/* Husbandry */}
                    <button
                      onClick={() => { setActiveTab("husbandry"); setIsMobileMenuOpen(false); }}
                      className={`p-3 col-span-2 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all ${
                        activeTab === "husbandry" ? themeStyles.tabActive : themeStyles.tabInactive
                      }`}
                    >
                      <Heart className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{t.tabs.husbandry}</span>
                    </button>
                  </div>
                </div>

                {/* 3. Theme Selector */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Theme Setting</span>
                  <div className={`grid grid-cols-3 p-1 rounded-xl text-xs font-bold border text-center ${
                    theme === "harvester" ? "bg-[#14281b] border-[#1d3527]" : "bg-white border-gray-200"
                  }`}>
                    <button 
                      type="button"
                      onClick={() => { handleThemeChange("forest"); setIsMobileMenuOpen(false); }} 
                      className={`py-2 rounded-lg transition-all ${theme === "forest" ? "bg-emerald-800 text-white" : "text-gray-400"}`}
                    >
                      🌱 Forest
                    </button>
                    <button 
                      type="button"
                      onClick={() => { handleThemeChange("earth"); setIsMobileMenuOpen(false); }} 
                      className={`py-2 rounded-lg transition-all ${theme === "earth" ? "bg-amber-850 text-white" : "text-gray-400"}`}
                    >
                      🏺 Earth
                    </button>
                    <button 
                      type="button"
                      onClick={() => { handleThemeChange("harvester"); setIsMobileMenuOpen(false); }} 
                      className={`py-2 rounded-lg transition-all ${theme === "harvester" ? "bg-emerald-500 text-black" : "text-gray-400"}`}
                    >
                      🌙 Night
                    </button>
                  </div>
                </div>

                {/* 4. Active Profile & Logout inside drawer */}
                <div className={`flex items-center justify-between border rounded-xl px-4 py-3 font-semibold ${
                  theme === "harvester" ? "bg-[#14281b] border-[#22442e]" : "bg-white border-emerald-150"
                }`}>
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-gray-800">{currentUser.fullName}</span>
                      <span className="text-[10px] font-mono text-gray-400">{currentUser.role}</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-1.5 text-rose-500 font-bold hover:text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main layout container with sidebar or horizontal selectors */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        


        {/* Action context detail banner if applicable */}
        {activePlot && activeTab !== "dashboard" && (
          <div className={`p-4 rounded-xl border flex flex-wrap justify-between items-center gap-3 text-xs leading-none ${
            theme === "harvester" 
              ? "bg-[#14281b] border-[#22442e] text-emerald-200" 
              : "bg-emerald-50/50 border-emerald-100 text-emerald-950"
          }`}>
            <div className="flex items-center gap-2 font-semibold">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.selectContext}: <strong>{activePlot.name}</strong></span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wide ${
                theme === "harvester" ? "bg-[#1d3c26] text-emerald-300" : "bg-emerald-100 text-emerald-800"
              }`}>
                {t.phScale} {activePlot.ph}
              </span>
            </div>
            <span className="text-gray-400 text-[11px] font-mono">
              {t.soilLevel}: {activePlot.soilType.split(" Soils")[0]}
            </span>
          </div>
        )}

        {/* Render Tab Sub-Components */}
        <div className="min-h-[460px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "dashboard" && (
                <Dashboard 
                  plots={plots} 
                  activePlot={activePlot} 
                  onSelectPlot={handleSelectPlot} 
                  onAddPlot={handleAddPlot} 
                  onDeletePlot={handleDeletePlot}
                  currentTime={currentTime}
                  lang={lang}
                />
              )}

              {activeTab === "advisor" && (
                <CropAdvisor 
                  activePlot={activePlot}
                  plots={plots}
                  lang={lang}
                />
              )}

              {activeTab === "clinic" && (
                <PlantClinic 
                  activePlot={activePlot}
                  lang={lang}
                />
              )}

              {activeTab === "soil" && (
                <SoilHealth 
                  activePlot={activePlot}
                  lang={lang}
                />
              )}

              {activeTab === "calendar" && (
                <GrowthCalendar 
                  activePlot={activePlot}
                  lang={lang}
                />
              )}

              {activeTab === "market" && (
                <MarketHub 
                  theme={theme}
                  themeStyles={themeStyles}
                  lang={lang}
                />
              )}

              {activeTab === "calculator" && (
                <AgriCalculator 
                  theme={theme}
                  themeStyles={themeStyles}
                  lang={lang}
                />
              )}

              {activeTab === "chat" && (
                <ChatAdvisor 
                  activePlot={activePlot}
                  lang={lang}
                />
              )}

              {activeTab === "husbandry" && (
                <HusbandryHub 
                  lang={lang}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 mt-20 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-6">
            <AswannaLogo className="w-8 h-8 text-emerald-500" showText={true} />
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-400">
              <a href="#" className="hover:text-white transition-all">Aswanna Smart Agricultural Platform</a>
              <a href="#" className="hover:text-white transition-all">Sri Lanka First Agricultural Portal</a>
              <a href="#" className="hover:text-white transition-all">Market Prices</a>
              <a href="#" className="hover:text-white transition-all">Weather Forecasting</a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800 pb-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500">Core Developers</span>
              <ul className="flex flex-col sm:flex-row gap-x-6 gap-y-1.5 text-slate-300 text-xs font-semibold">
                <li>Sinura Perera</li>
                <li>Vihas Kodithuwakku</li>
                <li>Dulnith Bandara</li>
              </ul>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500">Connect & Support</span>
              <div className="flex flex-col sm:flex-row gap-x-6 gap-y-1.5 text-slate-300 text-xs font-semibold">
                <a href="tel:+94774470098" className="hover:text-emerald-400 transition-colors">Call: +94 77 447 0098</a>
                <a href="https://github.com/Aswanna" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors underline decoration-dotted">GitHub: github.com/Aswanna</a>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 max-w-xs">
              Sri Lankan agrarian software initiative designed for regional crop prediction, local carbon preservation, and real-time agricultural telemetry.
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-500 gap-4">
            <p>© 2026 Aswanna LK. Empowering Sri Lanka&apos;s food security through local organic carbon preservation and advanced agronomic predictive indicators.</p>
            <p className="font-mono text-[10px]">LK-AGRI-v2.6.22-LIVE</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
