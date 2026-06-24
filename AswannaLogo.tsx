import React from "react";
import { Language, translations } from "./translations";

interface LogoProps {
  className?: string;
  showText?: boolean;
  textSize?: "sm" | "md" | "lg";
  lang?: Language;
}

export default function AswannaLogo({ className = "w-10 h-10", showText = true, textSize = "md", lang }: LogoProps) {
  const currentLang = lang || (localStorage.getItem("aswanna_lang") as Language) || "en";
  const t = translations[currentLang];
  return (
    <div className="flex items-center gap-3">
      <div className={`relative ${className} flex-shrink-0 flex items-center justify-center`}>
        {/* Custom SVG logo based on the provided green farmer silhouette */}
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-emerald-700"
        >
          {/* Garden Trowel (Left Tool) */}
          <path
            d="M50 45 C40 30 35 45 48 65 C49 67 43 72 45 74 L52 81 C54 83 58 75 58 74 C60 70 54 50 50 45 Z"
            fill="currentColor"
            fillOpacity="0.45"
          />
          {/* Trowel Handle */}
          <rect
            x="48"
            y="76"
            width="3"
            height="12"
            transform="rotate(-40 48 76)"
            fill="#4D7C0F"
          />

          {/* Garden Fork (Right Tool) */}
          <path
            d="M68 80 L76 72 M76 72 L62 58 M76 72 L92 42 M72 48 L80 56 M76 72 L84 64"
            stroke="#84CC16"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Pitchfork Prongs */}
          <path
            d="M92 42 L80 54 M86 36 L74 48 M98 48 L86 60"
            stroke="#84CC16"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Ground Curve */}
          <path
            d="M15 88 C45 75 75 75 105 88 C75 80 45 80 15 88 Z"
            fill="currentColor"
          />

          {/* Farmer Silhouette (Center) */}
          {/* Head & Straw Hat */}
          <ellipse cx="60" cy="35" rx="4" ry="5" fill="currentColor" />
          <path d="M51 32 C55 31 65 31 69 32 C71 32 72 34 68 34 C64 34 56 34 52 34 C50 34 49 32 51 32 Z" fill="currentColor" />
          <path d="M57 30 L63 30 L62 26 L58 26 Z" fill="currentColor" opacity="0.9" />

          {/* Torso & Belt */}
          <path d="M54 44 C53 47 54 59 55 68 L65 68 C66 59 67 47 66 44 C65 41 55 41 54 44 Z" fill="currentColor" />
          <line x1="55" y1="58" x2="65" y2="58" stroke="#4D7C0F" strokeWidth="2" />

          {/* Arms */}
          {/* Left Arm on hip */}
          <path d="M54 44 Q49 50 54 56" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Right Arm waving */}
          <path d="M66 44 Q73 43 72 52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Legs & Boots */}
          <path d="M55 68 L56 84 C56 86 52 86 52 88 L58 88 L58 68 Z" fill="currentColor" />
          <path d="M65 68 L64 84 C64 86 68 86 68 88 L62 88 L62 68 Z" fill="currentColor" />
          
          {/* Ground vegetation dots */}
          <circle cx="25" cy="85" r="1.5" fill="#4D7C0F" />
          <circle cx="95" cy="84" r="1.5" fill="#4D7C0F" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-display font-medium tracking-tight text-[#164e21] leading-none ${
              textSize === "sm" ? "text-lg" : textSize === "md" ? "text-xl" : "text-3xl"
            }`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Aswanna{" "}
            <span className="text-emerald-500 font-light text-xs align-super uppercase tracking-widest pl-0.5">LK</span>
          </span>
          <span className="text-[10px] text-emerald-700/80 font-mono tracking-widest uppercase truncate max-w-[150px]" title={t.tagline}>
            {t.tagline}
          </span>
        </div>
      )}
    </div>
  );
}
