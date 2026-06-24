import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, FarmPlot } from "./types";
import { Language, translations } from "./translations";
import { 
  Bot, 
  User, 
  Send, 
  RotateCcw, 
  MessageSquare, 
  HelpCircle,
  TrendingUp,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ChatAdvisorProps {
  activePlot: FarmPlot | null;
  lang: Language;
}

const CHAT_PROMPT_CHIPS_LANG = {
  en: [
    "How to prepare Neem Seed Kernel Extract (NSKE)?",
    "Best fertilization schedule for Keeri Samba Paddy?",
    "How does Gliricidia sepium serve as nitrogen tilling?",
    "What is the organic cure for Chili Leaf Curl?",
    "How does dolomite lime adjust Wet Zone pH specs?"
  ],
  si: [
    "කොහොඹ ඇට ශාකසාර දියරය (NSKE) සාදා ගන්නේ කෙසේද?",
    "කීරි සම්බා වී සඳහා හොඳම පොහොර කාලසටහන කුමක්ද?",
    "වැටහිරියා (Gliricidia) පසට නයිට්‍රජන් එක් කරන්නේ කෙසේද?",
    "මිරිස් කොළ කොඩවීමේ රෝගයට කාබනික පිළියම කුමක්ද?",
    "තෙත් කලාපයේ පසෙහි pH අගය ඩොලමයිට් මඟින් සකසන්නේ කෙසේද?"
  ],
  ta: [
    "வேப்ப விதை சாறு (NSKE) தயாரிப்பது எப்படி?",
    "கீரி சம்பா நெல்லுக்கான சிறந்த உர அட்டவணை எது?",
    "கிளைரிசிடியா இலைகள் மண்ணுக்கு எவ்வாறு நைட்ரஜன் சேர்க்கின்றன?",
    "மிளகாய் இலை சுருட்டல் நோய்க்கான இயற்கை மருந்து எது?",
    "ஈரமண்டல மண் அமிலத்தன்மையை டோலோமைட் எவ்வாறு சீராக்குகிறது?"
  ]
};

const chatTranslations = {
  en: {
    sidebarTitle: "PROMPTING CHIPS",
    sidebarHeadline: "Suggested Consultations",
    sidebarDesc: "Click any pre-recorded tropical farming query below to trigger an immediate diagnostic advisor session.",
    infoBox: "AI Advisor infuses recommendations direct from Sri Lanka Govijana Seva policy databases. Keep queries specific for best yield calculations.",
    inputPlaceholder: "Ask anything about weeding, organic leaf disease diagnostics, or fertilizer brands...",
    clearConfirm: "Are you sure you want to clear your current conversation logs?",
    clearSuccess: "Conversation cleared. I am ready for fresh agricultural queries or soil tilling consultations. How can I guide you today?",
    clearBtn: "Clear History"
  },
  si: {
    sidebarTitle: "යෝජිත ප්‍රශ්න",
    sidebarHeadline: "ප්‍රධාන උපදේශන විමසුම්",
    sidebarDesc: "කෘතිම බුද්ධියෙන් ක්ෂණික පිළිතුරු ලබා ගැනීමට පහත ඕනෑම ප්‍රශ්නයක් මත ක්ලික් කරන්න.",
    infoBox: "කෘෂි සහායකයා ශ්‍රී ලංකාවේ ගොවිජන සේවා දෙපාර්තමේන්තුවේ නිර්දේශ මත පදනම්ව ක්‍රියා කරයි. උපදෙස් ලබා ගැනීමට නිශ්චිතව විමසන්න.",
    inputPlaceholder: "වල් පැලෑටි පාලනය, රෝග විනිශ්චය හෝ පොහොර වර්ග පිළිබඳව විමසන්න...",
    clearConfirm: "ඔබට විශ්වාසද මෙම කතාබස් ඉතිහාසය මැකීමට අවශ්‍ය බව?",
    clearSuccess: "කතාබස් සටහන් ඉවත් කරන ලදී. මම නව කෘෂිකාර්මික උපදෙස් ලබා දීමට සුදානම්. ඔබට අද කුමන උපදෙසක්ද අවශ්‍ය?",
    clearBtn: "සංවාදය මකන්න"
  },
  ta: {
    sidebarTitle: "பரிந்துரைக்கப்பட்டவை",
    sidebarHeadline: "முக்கிய கேள்விகள்",
    sidebarDesc: "உடனடி பதில்களைப் பெற பின்வரும் கேள்விகளில் ஏதேனும் ஒன்றைக் கிளிக் செய்க.",
    infoBox: "விவசாய ஆலோசகர் இலங்கை கோவிஜன சேவா கொள்கை பரிந்துரைகளின்படி செயல்படுகிறார். துல்லியமான பலன்களுக்கு விவரமாக கேளுங்கள்.",
    inputPlaceholder: "களை கட்டுப்பாடு, இயற்கை நோய் கண்டறிதல் அல்லது உரங்கள் பற்றி கேளுங்கள்...",
    clearConfirm: "உரையாடல் வரலாற்றை அழிக்க நிச்சயமாக விரும்புகிறீர்களா?",
    clearSuccess: "உரையாடல் அழிக்கப்பட்டது. புதிய விவசாய ஆலோசனைகளை வழங்க நான் தயார். இன்று உங்களுக்கு என்ன உதவி செய்ய வேண்டும்?",
    clearBtn: "வரலாறு நீக்குக"
  }
};

export default function ChatAdvisor({ activePlot, lang }: ChatAdvisorProps) {
  const t = translations[lang];
  const curChat = chatTranslations[lang] || chatTranslations.en;
  const chips = CHAT_PROMPT_CHIPS_LANG[lang] || CHAT_PROMPT_CHIPS_LANG.en;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const saved = localStorage.getItem("aswanna_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      let welcomeStr = "";
      if (lang === "si") {
        welcomeStr = "ආයුබෝවන්! අස්වන්න කෘෂි-උපදේශන වැඩතලය වෙත සාදරයෙන් පිළිගනිමු. 🌾\n\nමම ලංකාවේ නිවර්තන කලාපීය බෝග වගාවන් පිළිබඳ කෘෂිකාර්මික උපදේශකයා වෙමි. මා සතුව පහත සඳහන් දත්ත පවතී:\n- දේශීය බෝග (කීරි සම්බා/රතු සහල් කුඹුරු, එනසාල්/කුරුඳු, මිරිස්, වම්බටු).\n- පස් තත්ත්වයන් (රතු බොරළු පස, වැලි සහිත රෙගොසෝල්, ඩොලමයිට් යෙදවුම්).\n- තිරසාර කාබනික සූත්‍ර (ගිරිසීඩියා කොළ පොහොර, කොහොඹ ඇට දියර, දුම් විනාකිරි).\n\n" + (activePlot ? `මම දකිනවා ඔබ දැනට **${activePlot.name}** බිම් කැබැල්ලෙහි වගා කර ඇති බව. අද දින ඔබට මාගෙන් ලැබිය යුතු සහය කුමක්ද?` : "අද දින ඔබට මාගෙන් අවශ්‍ය උපදෙස් මොනවාද?");
      } else if (lang === "ta") {
        welcomeStr = "வணக்கம்! அஸ்வன்ன விவசாய ஆலோசனை மையத்திற்கு உங்களை வரவேற்கிறோம். 🌾\n\nநான் இலங்கையின் வெப்பமண்டல பயிர்ச்செய்கை முறைகளில் நிபுணத்துவம் பெற்ற ஒரு விவசாய அதிகாரி ஆவேன். பின்வரும் விபரங்கள் என்னிடம் உள்ளன:\n- தேசிய பயிர்கள் (நெல் சாகுபடி, ஏலக்காய்/கருவா, மிளகாய், கத்தரிக்காய்).\n- மண் நிலைமைகள் (செம்மண், மணல் மண், டோலோமைட் பயன்பாடு).\n- நிலையான கரிம முறைகள் (கிளைரிசிடியா இலை உரம், வேப்ப எண்ணெய் கரைசல்).\n\n" + (activePlot ? `நீங்கள் காணி **${activePlot.name}** இல் பயிரிடுவதை நான் காண்கிறேன். இன்று உங்களுக்கு என்ன உதவி தேவை?` : "இன்று நான் உங்களுக்கு என்ன உதவி செய்ய வேண்டும்?");
      } else {
        welcomeStr = "Welcome to the Aswanna Agri-Advisor workspace. 🌾\n\nI am an agronomist specializing in Sri Lankan tropical cultivation patterns. I have matching indexes for:\n- National crops (Keeri Samba/Red rice paddy, Ceylon cardamom/cinnamon, chilies, brinjals).\n- Soil conditions (Red Reddish Brown, Sandy Regosols, dolomite balance regimes).\n- Sustainable organic formulas (Gliricidia foliage composting, Neem kernel tea, wood vinegar sprays).\n\n" + (activePlot ? `I see you are cultivating in the **${activePlot.zone.split(" (")[0]}** on **${activePlot.soilType}**! How is your **${activePlot.name}** doing today?` : "Which tropical crop can I help you fertilize, protect, or select today?");
      }

      const welcomeMsg: ChatMessage = {
        id: "welcome",
        role: "assistant",
        text: welcomeStr,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([welcomeMsg]);
    }
  }, [activePlot, lang]);

  // Auto-scroll chat window
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const saveChatHistory = (history: ChatMessage[]) => {
    setMessages(history);
    localStorage.setItem("aswanna_chat_history", JSON.stringify(history));
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...messages, userMsg];
    saveChatHistory(updatedHistory);
    setInputText("");
    setLoading(true);

    try {
      // Format chat messages context for Gemini
      const apiMessages = updatedHistory.map((m) => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          context: activePlot ? {
            plotName: activePlot.name,
            zone: activePlot.zone,
            soilType: activePlot.soilType,
            pH: activePlot.ph,
            NPK: `${activePlot.nitrogen}-${activePlot.phosphorus}-${activePlot.potassium}`,
            waterSource: activePlot.waterSource
          } : null
        })
      });

      if (!response.ok) {
        throw new Error("Chat api request failed");
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      saveChatHistory([...updatedHistory, assistantMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const clearChatHistory = () => {
    if (confirm(curChat.clearConfirm)) {
      localStorage.removeItem("aswanna_chat_history");
      const welcome: ChatMessage = {
        id: "welcome-reset",
        role: "assistant",
        text: curChat.clearSuccess,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      saveChatHistory([welcome]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-2">
        <div>
          <h3 className="text-xl font-display font-semibold text-emerald-950 flex items-center gap-2">
            <MessageSquare className="text-emerald-700 w-5 h-5 animate-pulse" /> {lang === "si" ? "අස්වන්න AI කෘෂි උපදෙස්" : lang === "ta" ? "அஸ்வன்ன AI மெய்நிகர் ஆலோசகர்" : "Aswanna AI Virtual Agronomist"}
          </h3>
          <p className="text-xs text-gray-500">
            {lang === "si" ? "දේශීය කෘෂිකාර්මික උපදෙස්, කාබනික පොහොර ක්‍රමවේද සහ පළිබෝධ පාලන ක්‍රම පිළිබඳ අපගේ කෘෂි සහායකයාගෙන් විමසන්න." : lang === "ta" ? "எம்முடன் பேசி உரம், பூச்சி தாக்குதல் மற்றும் மண்ணியல் அறிவுரைகளை அறியுங்கள்." : "Consult our conversational intelligence on Department of Agriculture standards, organic pest repelling, and soil remediation rules."}
          </p>
        </div>

        <button
          onClick={clearChatHistory}
          className="text-xs text-gray-400 hover:text-rose-500 border border-gray-250 hover:border-rose-200 px-3 py-1.5 rounded-lg flex items-center gap-1 sm:self-center transition-all bg-white shadow-2xs font-bold"
        >
          <RotateCcw className="w-3.5 h-3.5" /> {curChat.clearBtn}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-[560px]">
        {/* Chat Message Box Terminal (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-white rounded-xl border border-gray-150 shadow-xs overflow-hidden">
          {/* Header context band */}
          <div className="bg-emerald-50/50 p-3 px-4 border-b border-gray-150 text-[11px] text-emerald-900 flex justify-between items-center font-bold">
            <div className="flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-emerald-700 animate-pulse" />
              <span>{lang === "si" ? "අස්වන්න සක්‍රීය කෘෂි සහායකයා: ශ්‍රී ලංකා සංස්කරණය" : lang === "ta" ? "அஸ்வன்ன விவசாய ஆலோசகர்: இலங்கை பதிப்பு" : "Aswanna Virtual Agronomist companion active: Sri Lanka Edition"}</span>
            </div>
            {activePlot && (
              <span className="font-mono text-emerald-800 text-[10px] bg-emerald-100/50 border border-emerald-200/50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <Layers className="w-3" /> Context: {activePlot.name}
              </span>
            )}
          </div>

          {/* Messages Flow scrolling container */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[420px]">
            {messages.map((m) => {
              const isAssistant = m.role === "assistant";
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-[85%] ${isAssistant ? "" : "ml-auto flex-row-reverse"}`}
                >
                  <div className={`p-2.5 rounded-full flex-shrink-0 flex items-center justify-center w-8 h-8 ${
                    isAssistant ? "bg-emerald-100 text-emerald-800" : "bg-teal-700 text-teal-100"
                  }`}>
                    {isAssistant ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                  </div>

                  <div className="space-y-1">
                    <div className={`rounded-2xl p-4 text-xs leading-relaxed ${
                      isAssistant 
                        ? "bg-gray-50 border border-gray-150 text-gray-800 rounded-tl-none font-sans" 
                        : "bg-emerald-900 text-white rounded-tr-none font-semibold font-sans"
                    }`}>
                      <p className="whitespace-pre-line text-[12px]">{m.text}</p>
                    </div>
                    <span className={`text-[9.5px] font-mono text-gray-400 block ${isAssistant ? "text-left pl-1" : "text-right pr-1"}`}>
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center w-8 h-8">
                  <Bot className="w-4.5 h-4.5 animate-spin" />
                </div>
                <div className="rounded-2xl rounded-tl-none p-3.5 bg-slate-50 border border-slate-150 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[10.5px] text-gray-500 font-mono italic">AI Companion is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive input tray */}
          <div className="p-3 border-t border-gray-150 bg-gray-50/50 flex gap-2">
            <input
              type="text"
              className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-2xs"
              placeholder={curChat.inputPlaceholder}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(inputText);
                }
              }}
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={loading || !inputText.trim()}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-300 text-white rounded-lg p-2.5 flex items-center justify-center transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Suggestion prompt chips sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-emerald-50/20 rounded-xl border border-emerald-100 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-emerald-605 uppercase tracking-widest block font-bold">{curChat.sidebarTitle}</span>
              <h4 className="font-display font-black text-[#113a17] text-sm">{curChat.sidebarHeadline}</h4>
              <p className="text-[10.5px] text-gray-500 leading-normal">
                {curChat.sidebarDesc}
              </p>
            </div>

            <div className="space-y-2">
              {chips.map((chip) => {
                return (
                  <button
                    key={chip}
                    onClick={() => handleSendMessage(chip)}
                    className="w-full text-left bg-white hover:bg-emerald-50/40 border border-gray-150 hover:border-emerald-300 p-2.5 rounded-lg text-[10.5px] font-bold text-emerald-950 flex items-start gap-1.5 transition-all leading-relaxed shadow-3xs"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{chip}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-3 text-[10px] text-amber-900 flex gap-1.5 items-start">
            <TrendingUp className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span className="leading-normal">{curChat.infoBox}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
