// Aswanna Interactive Theme Definitions

export type ThemeType = "forest" | "earth" | "harvester";

export interface ThemeStyles {
  background: string;
  card: string;
  cardBorder: string;
  primaryButton: string;
  primaryButtonHover: string;
  textHeading: string;
  textBody: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  tabActive: string;
  tabInactive: string;
  mutedText: string;
  inputBg: string;
  borderColor: string;
}

export const themes: Record<ThemeType, ThemeStyles> = {
  forest: {
    background: "bg-[#f4f7f3]",
    card: "bg-white",
    cardBorder: "border-gray-150",
    primaryButton: "bg-emerald-800 text-white",
    primaryButtonHover: "hover:bg-emerald-950",
    textHeading: "text-emerald-950",
    textBody: "text-gray-700",
    accentText: "text-emerald-700",
    accentBg: "bg-emerald-50/60",
    accentBorder: "border-emerald-150",
    tabActive: "bg-emerald-800 text-white",
    tabInactive: "text-gray-500 hover:bg-gray-50 hover:text-emerald-850",
    mutedText: "text-gray-400",
    inputBg: "bg-gray-50",
    borderColor: "border-gray-150"
  },
  earth: {
    background: "bg-[#fbf7f0]",
    card: "bg-white",
    cardBorder: "border-amber-200/60",
    primaryButton: "bg-amber-800 text-white",
    primaryButtonHover: "hover:bg-amber-950",
    textHeading: "text-amber-950",
    textBody: "text-amber-900/90",
    accentText: "text-amber-700",
    accentBg: "bg-amber-50/50",
    accentBorder: "border-amber-250/50",
    tabActive: "bg-amber-800 text-white",
    tabInactive: "text-amber-700/70 hover:bg-amber-55/20 hover:text-amber-900",
    mutedText: "text-amber-700/50",
    inputBg: "bg-amber-50/30",
    borderColor: "border-amber-100"
  },
  harvester: {
    background: "bg-[#0b130e]",
    card: "bg-[#111e16] border-[#1d3527]",
    cardBorder: "border-[#1d3527]",
    primaryButton: "bg-emerald-500 text-black font-semibold",
    primaryButtonHover: "hover:bg-emerald-400",
    textHeading: "text-emerald-50",
    textBody: "text-emerald-250/90",
    accentText: "text-emerald-400",
    accentBg: "bg-[#14281b]",
    accentBorder: "border-[#22442e]",
    tabActive: "bg-emerald-500 text-black font-bold",
    tabInactive: "text-emerald-300/70 hover:bg-emerald-950/40 hover:text-emerald-100",
    mutedText: "text-emerald-600",
    inputBg: "bg-[#0e1812]",
    borderColor: "border-[#1e3223]"
  }
};
