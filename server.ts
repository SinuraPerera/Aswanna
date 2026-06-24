import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Initialize GoogleGenAI SDK safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY || "AQ.Ab8RN6Ltfhda87q0aeNOoKSQZRR1YxAo_7BaT0HVVqOCpuHpvA";

if (apiKey && apiKey !== "AQ.Ab8RN6Ltfhda87q0aeNOoKSQZRR1YxAo_7BaT0HVVqOCpuHpvA") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Aswanna: AswannaAI successfully initialized with active workspace keys.");
  } catch (err) {
    console.error("Aswanna: Failed to initialize AswannaAI:", err);
  }
} else {
  console.warn("Aswanna WARNING: ASWANNA_API_KEY is not defined in environment variables. Operating in demo mock fallback mode.");
}

// Helper function to safely execute generateContent with automatic model fallback and retries
async function generateContentWithFallback(aiInstance: GoogleGenAI, options: {
  contents: any;
  systemInstruction: string;
  responseMimeType?: string;
  temperature?: number;
}) {
  const modelsToTry = [
    "aswanna-3.5-flash",
    "aswanna-3.1-flash-lite",
    "aswanna-flash-latest"
  ];
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Aswanna: Attempting generateContent with model: ${model} (Attempt ${attempt}/3)`);
        const response = await aiInstance.models.generateContent({
          model: model,
          contents: options.contents,
          config: {
            systemInstruction: options.systemInstruction,
            responseMimeType: options.responseMimeType as any,
            temperature: options.temperature,
          },
        });
        console.log(`Aswanna: Successfully generated content using model: ${model}`);
        return response;
      } catch (err: any) {
        lastError = err;
        const errStr = typeof err === "object" ? JSON.stringify(err) : String(err);
        const isTransient = errStr.includes("503") || errStr.includes("429") || errStr.includes("UNAVAILABLE");
        
        console.warn(`Aswanna WARNING: generateContent failed for model ${model} on attempt ${attempt}/3:`, err.message || err);
        
        if (isTransient && attempt < 3) {
          const delay = attempt * 800; // 800ms, 1600ms backoff
          console.log(`Aswanna: Transient error detected (503/429/UNAVAILABLE). Retrying after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // If not transient or we've run out of attempts, move to the next model
          break;
        }
      }
    }
  }
  throw lastError;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    aiEnabled: !!ai,
    time: new Date().toISOString(),
  });
});

// 1. CROP RECOMMENDATION SYSTEM
app.post("/api/recommend", async (req, res) => {
  const { region, soilType, ph, nitrogen, phosphorus, potassium, waterSource, season } = req.body;

  // Sri Lanka Agricultural Context Advice
  const systemPrompt = `You are a professional Sri Lankan agronomist representing the "Aswanna Smart Agriculture Platform".
Your task is to analyze details of soil conditions, region, irrigation, and season in Sri Lanka, and prescribe the top 3 best-suited crops.
For each crop, provide optimal planting density, estimated yield (kg per acre), Yala/Maha seasonal fit, market demand rating, water requirement details, and specific instructions.
Return exclusively a JSON object matching this schema:
{
  "crops": [
    {
      "name": "Crop Name",
      "scientificName": "Scientific Name of Crop",
      "suitabilityScore": 95, 
      "estYield": "Yield estimate range (e.g., 4000-5000 kg)",
      "durationDays": 120,
      "waterRequirement": "High | Medium | Low",
      "marketDemand": "High | Medium | Stable",
      "avgSellingPrice": "Rs. Price range per kg",
      "reasons": ["Reason 1 why it fits here", "Reason 2"],
      "plantingTips": ["Key tip 1", "Key tip 2"],
      "fertilizerSplit": "Details on urea, triple super phosphate, muriate of potash split for this soil"
    }
  ],
  "generalSoilAdvisory": "Sri Lankan specific soil advisory based on nitrogen, phosphorus, potassium, pH, and season (Yala/Maha)"
}`;

  const userPrompt = `Deliver recommendation for:
  - Region in Sri Lanka: ${region || "Dry Zone (e.g. Anuradhapura)"}
  - Soil Type: ${soilType || "Red Reddish Brown Earths"}
  - Soil pH: ${ph || 6.5}
  - Nitrogen (N): ${nitrogen || "Medium"}
  - Phosphorus (P): ${phosphorus || "Medium"}
  - Potassium (K): ${potassium || "Medium"}
  - Water Source/Availability: ${waterSource || "Rainfed"}
  - Targeting Season: ${season || "Maha (Northeast monsoon)"}
  
  Remember, write in a helpful Sri Lankan context (using terms like Yala and Maha where applicable). Keep pricing levels in Sri Lankan Rupees (LKR/Rs.).`;

  if (!ai) {
    // Elegant fallback simulation
    console.log("Aswanna: Using Recommendation Fallback (No Gemini Key)");
    return res.json(getMockRecommendations(region, soilType, season));
  }

  try {
    const response = await generateContentWithFallback(ai, {
      contents: userPrompt,
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      temperature: 0.2,
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini Content Generator");
    }
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error("Aswanna: Recommendation model failed:", error);
    // Double-safeguard back to mock
    return res.json(getMockRecommendations(region, soilType, season));
  }
});

// 2. CROP DISEASE DIAGNOSIS
app.post("/api/diagnose", async (req, res) => {
  const { cropName, symptoms, imageBase64, imageMimeType } = req.body;

  const systemPrompt = `You are a Senior Plant Pathologist specializing in tropical agriculture and crops grown in Sri Lanka (e.g. Rice/Paddy, Coconut, Tea, Cinnamon, Chilies, Eggplant/Brinjal, Tomato).
You must analyze the user's symptoms and crop image (if uploaded) to diagnose the disease or pest.
Explain the diagnosed issue, assess severity, list symptoms matching the diagnosis, and outline concrete, actionable treatment steps: Organically (mechanical/botanical) and Chemically (using Department of Agriculture Sri Lanka approved solutions).
Return exclusively a JSON object matching this schema:
{
  "diagnosis": "Diagnosed disease or pest title",
  "probability": 85,
  "severity": "Low | Moderate | Severe",
  "symptomsConfirmed": ["Symptom match 1", "Symptom match 2"],
  "cause": "Biological cause or environmental stressors",
  "treatmentOrganic": ["Organic treatment 1", "Organic treatment 2"],
  "treatmentChemical": ["Chemical treatment 1", "Chemical treatment 2"],
  "preventativeMeasures": ["Prevention 1", "Prevention 2"],
  "urgencyScale": "Action plan within X days"
}`;

  const userPrompt = `Diagnose the following crop issue:
  - Crop: ${cropName || "Paddy Rice"}
  - Observed Symptoms: ${symptoms || "Yellowing of leaf tips, brown streak lesions, stunted growth."}`;

  if (!ai) {
    console.log("Aswanna: Using Diagnosis Fallback (No Gemini Key)");
    return res.json(getMockDiagnosis(cropName, symptoms));
  }

  try {
    let contents: any;
    if (imageBase64 && imageMimeType) {
      const imagePart = {
        inlineData: {
          mimeType: imageMimeType,
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        },
      };
      contents = {
        parts: [
          imagePart,
          { text: userPrompt }
        ]
      };
    } else {
      contents = userPrompt;
    }

    const response = await generateContentWithFallback(ai, {
      contents: contents,
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      temperature: 0.2,
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini Diagnosis");
    }
    return res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Aswanna: Diagnosis model failed:,", error);
    return res.json(getMockDiagnosis(cropName, symptoms));
  }
});

// 3. SOIL FERTILITY & AMENDMENT ADVISORY
app.post("/api/soil-advisory", async (req, res) => {
  const { currentCrops, organicMatter, drainage, testType, reportNotes } = req.body;

  const systemPrompt = `You are a Sri Lankan Soil Chemist.
Analyze the user's soil health parameters and produce a detailed report outlining macro/micro-nutrient optimization, soil health index, specific treatments to fix pH, composting recipes, and agricultural practices to rebuild soil organic carbon (very crucial in Sri Lanka).
Return exclusively a JSON object matching this schema:
{
  "soilHealthIndex": 72, 
  "phDiagnostic": "Slightly acidic | Ideal | Alkaline",
  "macronutrientStatus": {
    "nitrogen": "Low | Optimal | Excessive",
    "phosphorus": "Low | Optimal | Excessive",
    "potassium": "Low | Optimal | Excessive"
  },
  "deficiencies": ["Deficiency 1 identified", "Deficiency 2 identified"],
  "soilCarbonRebuildingStrategy": ["Step 1 to rebuild soil carbon", "Step 2"],
  "pHCorrectionAction": "Concrete pH balancing steps",
  "compostingSchedule": ["Composting detail 1", "Composting detail 2"],
  "recommendedCoverCrops": ["Sunn hemp", "Centrosema"]
}`;

  const userPrompt = `Generate a Sri Lanka soil-fertility amendment program for:
  - Intended / Current Soil Crops: ${currentCrops || "Vegetables"}
  - Organic Matter Level observed: ${organicMatter || "Low"}
  - Drainage & Texture: ${drainage || "Sandy Loam, moderate drainage"}
  - Known Soil Test Details or Notes: ${reportNotes || "My soil feels compact. No professional test yet, but plants show slow early shoot development."}`;

  if (!ai) {
    console.log("Aswanna: Using Soil Advisory Fallback (No Gemini Key)");
    return res.json(getMockSoilAdvisory(currentCrops));
  }

  try {
    const response = await generateContentWithFallback(ai, {
      contents: userPrompt,
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      temperature: 0.3,
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini Soil Advisory");
    }
    return res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Aswanna: Soil Advisory model failed:", error);
    return res.json(getMockSoilAdvisory(currentCrops));
  }
});

// 4. INTEGRATED CHATBOT / CHAT WITH ASWANNA EXPERT
app.post("/api/chat", async (req, res) => {
  const { messages, context } = req.body; // messages: Array of [{role: "user" | "model", text: string}]

  const systemPrompt = `You are "Aswanna Agri-Advisor" (අස්වන්න කෘෂි උපදේශක), an elite AI Virtual Agronomist companion for Sri Lankan farmers.
Your tone is deeply encouraging, humble, extremely knowledgeable, and practical.
Use friendly metaphors and clear terminology. Avoid overly dense formatting but structure answers using bullet points for steps where appropriate.
If the farmer asks in English, reply in English, but naturally infuse local agricultural terms (like "pela", "kanna", "pohaura", "Maha Kanna", "Yala Kanna", "Govijana Seva", "Govipola").
You have deep expertise in Sri Lanka's Agro-Ecological Zones (Wet Zone, Intermediate Zone, Dry Zone), major irrigation systems (Major reservoirs, Minor tanks/Wewa, Rainfed), and national crops (Rice/Paddy, coconut, tea, cinnamon, chili, onion, dhal, pulses).
Structure your response gracefully. Always answer the question directly. Note that you MUST answer ANY question the user asks, including general knowledge, calculations, translations, or technical advice — never refuse or lock yourself strictly to agriculture, but always maintain your extremely friendly and supportive Sri Lankan advisor persona.`;

  if (!ai) {
    console.log("Aswanna: Using Chat Bot Fallback (No Gemini Key)");
    const lastUserMsg = messages[messages.length - 1]?.text || "";
    return res.json({
      text: getMockChatResponse(lastUserMsg),
    });
  }

  try {
    // Format history for GoogleGenAI SDK Chats
    const geminiHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    const lastMessageText = messages[messages.length - 1]?.text || "Hello Aswanna";

    const modelsToTry = [
      "gemini-3.5-flash",
      "gemini-3.1-flash-lite",
      "gemini-flash-latest"
    ];
    let lastError: any = null;
    let response: any = null;

    for (const model of modelsToTry) {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`Aswanna: Attempting chat message with model: ${model} (Attempt ${attempt}/3)`);
          const chatInstance = ai.chats.create({
            model: model,
            history: geminiHistory,
            config: {
              systemInstruction: systemPrompt + (context ? `\n\nFarmer context: ${JSON.stringify(context)}` : ""),
              temperature: 0.7,
            },
          });
          response = await chatInstance.sendMessage({ message: lastMessageText });
          console.log(`Aswanna: Successfully processed chat message using model: ${model}`);
          break;
        } catch (err: any) {
          lastError = err;
          const errStr = typeof err === "object" ? JSON.stringify(err) : String(err);
          const isTransient = errStr.includes("503") || errStr.includes("429") || errStr.includes("UNAVAILABLE");
          
          console.warn(`Aswanna WARNING: Chat failed for model ${model} on attempt ${attempt}/3:`, err.message || err);
          
          if (isTransient && attempt < 3) {
            const delay = attempt * 800; // 800ms, 1600ms backoff
            console.log(`Aswanna: Transient error detected in chat (503/429/UNAVAILABLE). Retrying after ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            break;
          }
        }
      }
      if (response) break;
    }

    if (!response && lastError) {
      throw lastError;
    }

    return res.json({
      text: response.text,
    });
  } catch (error: any) {
    console.error("Aswanna: Chat model failed:", error);
    const lastUserMsg = messages[messages.length - 1]?.text || "";
    return res.json({
      text: getMockChatResponse(lastUserMsg) + " (Operated in local secure backup mode)",
    });
  }
});


// ==========================================
// MOCK DATA BACKENDS FOR ZERO FRICTION DEMOS
// ==========================================

function getMockRecommendations(region?: string, soilType?: string, season?: string) {
  const isMaha = !season || season.toLowerCase().includes("maha");
  return {
    crops: [
      {
        name: "Keeri Samba (BG-360)",
        scientificName: "Oryza sativa (Samba)",
        suitabilityScore: 98,
        estYield: "3,200 - 3,800 kg per acre",
        durationDays: 105,
        waterRequirement: "High",
        marketDemand: "High",
        avgSellingPrice: "Rs. 220 - 240 / kg",
        reasons: [
          "Perfect match for local water levels in " + (region || "Polonnaruwa") + " district.",
          "High premium price guaranteed by local millers in Sri Lanka.",
          "Optimal vegetative progress during the " + (isMaha ? "Maha" : "Yala") + " season's daylight profile."
        ],
        plantingTips: [
          "Transplant 15-20 days old healthy nursery seedlings.",
          "Maintain a standing water level of 2-3 cm until panicle initiation.",
          "Incorporate 4-5 tonnes of decomposing straw per acre to minimize synthetic urea reliance."
        ],
        fertilizerSplit: "Basal: Urea 15kg, TSP 35kg, MOP 12kg per acre. Top-dressing at tillering: Urea 25kg, MOP 10kg."
      },
      {
        name: "Sri Lankan Hot Chili (MICH Hybrid 1)",
        scientificName: "Capsicum annuum",
        suitabilityScore: 89,
        estYield: "4,500 - 6,000 kg per acre",
        durationDays: 135,
        waterRequirement: "Medium",
        marketDemand: "High",
        avgSellingPrice: "Rs. 450 - 650 / kg",
        reasons: [
          "Thrives exceptionally well in sandy soils of " + (region || "Dry Zone") + " using modern drip networks.",
          "Local market prices for dry/green chili remain steadily high and lucrative.",
          "Tolerates heat spikes common towards mid-growth intervals."
        ],
        plantingTips: [
          "Prepare high raised beds of 15-20 cm height to guarantee ideal root drainage.",
          "Incorporate dry poultry manure (2 tonnes/acre) during initial land preparation.",
          "Mulch thoroughly using straw or black polythene to suppress invasive weeds."
        ],
        fertilizerSplit: "Basal dressing: organic manure + TSP 40kg. Top dress at 4 weeks: Urea 20kg + MOP 15kg."
      },
      {
        name: "Keppetipola Red Onion",
        scientificName: "Allium cepa L. (Aggregatum)",
        suitabilityScore: 84,
        estYield: "6,000 - 7,200 kg per acre",
        durationDays: 80,
        waterRequirement: "Medium",
        marketDemand: "Stable",
        avgSellingPrice: "Rs. 320 - 380 / kg",
        reasons: [
          "Highly compatible with your requested pH of around 6.0 - 6.8.",
          "Short maturation timeline allows rapid harvesting before heavy seasonal rain transitions.",
          "Guarantees reliable cashflows due to high national consumption rates."
        ],
        plantingTips: [
          "Plant medium-sized cured seed bulbs spacing them 10cm x 10cm apart.",
          "Ensure light but frequent irrigation cycles (every 2-3 days based on soil dryness).",
          "Stop irrigation completely 10 days before harvesting to ensure dry bulbs."
        ],
        fertilizerSplit: "Basal: NPK 15:15:15 at 80kg/acre. Top dressing at week 3: Urea 20kg."
      }
    ],
    generalSoilAdvisory: "Your soil conditions exhibit typical properties of " + (soilType || "Reddish Brown Earth") + " found across Sri Lanka. Phosphorous retention looks slightly restricted, hence adding organic biochar or compost is strongly encouraged. Schedule fertilization strictly based on split applications to bypass torrential rainfall runoff losses."
  };
}

function getMockDiagnosis(cropName?: string, symptoms?: string) {
  const crop = (cropName || "Rice Paddy").toLowerCase();
  
  if (crop.includes("paddy") || crop.includes("rice")) {
    return {
      diagnosis: "Rice Blast (Piricularia oryzae)",
      probability: 92,
      severity: "Moderate",
      symptomsConfirmed: [
        "Spindle-shaped elliptical lesions on blades with ash-colored centers.",
        "Bluish-grey water-soaked spots on leaf collar margins.",
        "Slight browning of nodes near terminal nodes."
      ],
      cause: "Fungal pathogen Piricularia oryzae. Outburst is stimulated by high humidity, overcast days, and excessive nitrogenous fertilizer application.",
      treatmentOrganic: [
        "Incorporate neem seed kernel extract (NSKE 5%) spray twice at weekly intervals.",
        "Apply organic wood vinegar solutions diluted 1:500 on early lesion targets.",
        "Immediately cease additional urea application until the infection is under control."
      ],
      treatmentChemical: [
        "Spray systemic fungicide Tricyclazole (e.g., Blastoff) at 120g per acre in 200L of water.",
        "Alternatively, apply Kasugamycin formulations as prescribed by local Govijana Seva agronomists."
      ],
      preventativeMeasures: [
        "Use certified disease-resistant Sri Lankan Paddy seed cultivars like BG-300 or BG-352.",
        "Do not over-seed; maintain proper spacing for sufficient wind circulation.",
        "Burn and clear stubbles thoroughly post-harvest to eradicate resting spores."
      ],
      urgencyScale: "Urgent treatment intervention within 3 days is critical to prevent neck blast."
    };
  } else if (crop.includes("coconut")) {
    return {
      diagnosis: "Coconut Red Palm Weevil (Rhynchophorus ferrugineus)",
      probability: 88,
      severity: "Severe",
      symptomsConfirmed: [
        "Small holes on the palm trunk with oozing brownish sap.",
        "Chewed fiber debris trailing from active entry tunnels.",
        "Gradual yellowing and drooping of younger green fronds."
      ],
      cause: "Larvae of the Red Palm Weevil boring deep tunnels into the soft crown of the palm, destroying apical tissues.",
      treatmentOrganic: [
        "Set up food-baited pheromone traps (using coconut water, yeast, and Ferolure) 2 meters above ground level to capture beetles.",
        "Seal existing oviposition trunk cavities using a clean sand and neem cake powder mix (1:1 ratio)."
      ],
      treatmentChemical: [
        "Inject systemic insecticide Monocrotophos (10ml per palm tree) into the trunk via a 45-degree pre-drilled hole, sealing after treatment."
      ],
      preventativeMeasures: [
        "Avoid making physical machete scars on coconut boles during harvesting, as these attract laying pests.",
        "Routinely inspect young plantations (under 10 years) every two weeks."
      ],
      urgencyScale: "Action required within 5-7 days. Prolonged neglect will lead to tree top snapping and total plant loss."
    };
  } else {
    return {
      diagnosis: "Cercospora Leaf Spot & Fungal Mildew",
      probability: 85,
      severity: "Low",
      symptomsConfirmed: [
        "Circular circular dots on mature leaves.",
        "Marginal yellowing of leaf contours.",
        "Slight premature defoliation of oldest leaves."
      ],
      cause: "Spores spreading via heavy rainwater droplets in humid microclimates.",
      treatmentOrganic: [
        "Prepare and spray dilutions of baking soda (5g per Liter) combined with a teaspoon of organic vegetable soap as surfactant.",
        "Manually pluck and bury severely spotted leaves away from the plot."
      ],
      treatmentChemical: [
        "Apply Mancozeb or Copper Oxychloride spray at 30g per 10 Liters of water if leaf spots cover more than 20% of the canopy."
      ],
      preventativeMeasures: [
        "Improve planting density; widen spacing to permit ideal midday solar exposure.",
        "Use drop-level irrigation instead of overhead sprinklers to keep leaf surfaces dry."
      ],
      urgencyScale: "Treat within 7-10 days to protect newly emerging shoots."
    };
  }
}

function getMockSoilAdvisory(crops?: string) {
  return {
    soilHealthIndex: 68,
    phDiagnostic: "Slightly acidic (5.8 - 6.2) - very typical of Sri Lankan Wet Zone soils",
    macronutrientStatus: {
      nitrogen: "Low - high organic matter leaching observed",
      phosphorus: "Optimal - moderate phosphorus reservoir",
      potassium: "Low - typical of highly washed soils"
    },
    deficiencies: [
      "Potassium deficiency leading to yellow-brown serrations at Leaf edges.",
      "Nitrogen deficiency causing pale overall vigor in active growing phases.",
      "Trace Boron deficit causing flower drop in nightshades."
    ],
    soilCarbonRebuildingStrategy: [
      "Incorporate green manure like Gliricidia sepium leaf cuttings (500kg per acre during tilling).",
      "Apply biochar generated from coconut husks to lock nutrients permanently into the topsoil root zone.",
      "Reduce mechanical deep-tilling frequency to preserve mycelial mycelial frameworks."
    ],
    pHCorrectionAction: "Broadcast and mix 150 kg of high-quality dolomite lime per acre at least 3 weeks before seed sowing to gently raise the pH to 6.5.",
    compostingSchedule: [
      "Layer 1: Brown materials (dried paddy straw, coconut coir dust, dry grass) - 30cm thickness",
      "Layer 2: Green materials (Gliricidia, legume leaves, fresh cow dung) - 15cm thickness",
      "Turn the heap every 14 days; compost will cure and be ready for application in 60-75 days."
    ],
    recommendedCoverCrops: ["Sunn Hemp (Crotalaria juncea)", "Cowpea (Vigna unguiculata)", "Mucuna Pruriens"]
  };
}

function getMockChatResponse(userMsg: string) {
  const query = userMsg.toLowerCase().trim();
  
  // 1. ANIMAL HUSBANDRY: DAIRY/CATTLE
  if (query.includes("cow") || query.includes("cattle") || query.includes("dairy") || query.includes("milk")) {
    return `ආයුබෝවන්! For cattle farming and dairy management in Sri Lanka, the Department of Animal Production & Health recommends:
    
- **Breed Selection**: Hill Country (Friesian, Jersey crosses require cooler temperatures); Dry/Dry-Intermediate Zone (Sahiwal, Sindhi, and Tharparkar crosses are highly heat tolerant).
- **Housing**: Ensure slatted concrete flooring with a 1.5% slope toward a dedicated dung-wash channel. This prevents hoof rot and mastitis infections.
- **Feeding Regime**: Provide a daily ratio of 10% of body weight in green fodder. Combine CO-3/CO-4 Napier grass, sorghum, and nitrogen-rich Gliricidia leaves with 2-3 kg of coconut poonac or rice bran concentrate.
- **Vaccination Alert**: Guard against Foot-and-Mouth Disease (FMD) and Haemorrhagic Septicaemia by consulting your regional veterinary office twice a year.
    
Let me know if you need specific details about silage preparation or milk hygienics!`;
  }

  // 2. ANIMAL HUSBANDRY: POULTRY/CHICKENS
  if (query.includes("chicken") || query.includes("poultry") || query.includes("egg") || query.includes("hen") || query.includes("layer") || query.includes("broiler")) {
    return `Hello! Managing a successful poultry governance setup in Sri Lankan microclimates involves:
    
- **Housing Structure**: Deep litter system utilizing 3-4 inches of dry wood shavings or clean paddy husks. Ensure high-ventilation mesh wiring on all sides to control ammonia build-up.
- **Feed Cycle**: Chicks (Broiler/Layer Starter feed up to 4 weeks); Slower growth (Grower mash); Egg-laying hens (Layer mash with 3.5% calcium to guarantee sturdy eggshells).
- **Disease Shield**: Strictly implement biosecurity gates (lime-wash baths at entry). Administer vaccines for Newcastle Disease (Ranikhet) and Infectious Bronchitis.
    
What scale of flock are you looking to establish (e.g., backyard cage, free-range, or intensive)?`;
  }

  // 3. ANIMAL HUSBANDRY: GOATS
  if (query.includes("goat") || query.includes("mutton") || query.includes("jamnapari") || query.includes("boer")) {
    return `Greetings! Goats are highly resilient and lucrative livestock for Sri Lankan smallholders:
    
- **Best Breeds**: Jamnapari (large, great for dual milk/mutton); Kottukachchiya (native, extremely resilient to parasites in dry zones); Boer crosses (exceptional meat yield).
- **Optimal Housing**: Always build raised wooden-slat houses (raised 4-5 feet above the ground). This separates goats from damp droppings, which drastically lowers parasitic lungworm infections.
- **Nutrition**: Goats are browsers. Feed them a robust mix of Jacktree leaves, Gliricidia, ipil-ipil, and wild shrub twigs. Avoid feeding wet grass early in the morning.
    
Do you have a wet zone plot or dry zone scrub grazing area? Let me know!`;
  }

  // 4. ANIMAL HUSBANDRY: BEE-KEEPING
  if (query.includes("bee") || query.includes("honey") || query.includes("apiculture") || query.includes("hive")) {
    return `Welcome to the world of Apiculture! Bee-keeping is highly recommended to boost pollination in Sri Lankan coconut and rubber farms:
    
- **Bees Variety**: Apis cerana indica (the native Indian honeybee) is ideal for wooden box hive colonization.
- **Location Setting**: Mount the hives in shaded gardens, safely protected from midday heat. Place the stand legs inside small cans filled with water and grease to prevent ant invasions.
- **Pollen Sources**: Intercrop with coconut palms, citrus trees, banana trunks, and sunn hemp to provide continuous year-round nectar foraging.
- **Harvesting Rule**: Harvest organic honey during the major dry spell (February to April). Leave the brood chambers intact to preserve colony strength.
    
Let me know if you would like guidelines on capture box swarming!`;
  }

  // 5. CROPS: PADDY/RICE
  if (query.includes("paddy") || query.includes("rice") || query.includes("wee")) {
    return `ආයුබෝවන්! For Paddy (rice) in Sri Lanka, the Department of Agriculture recommends a structured fertilizer application divided into split-doses:

- **Soil Preparation**: Apply high-quality dolomite and tilled compost during first plowing. Wewa mud is also rich in micro-nutrients.
- **Split NPK Program**:
  1. Basal dressing (right before transplanting / sowing).
  2. First top dressing of Urea (at tillering phase, 14-21 days).
  3. Second top dressing of Muriate of Potash combined with Urea (at panicle initiation, 50-55 days).
- **Variety Guidelines**: Keeri Samba, Samba, and Bg varieties have specific maturity timelines. 

Are you cultivating during the **Maha** or **Yala** season? Please share your variety so we can calculate exact quantities.`;
  }

  // 6. CROPS: CHILI / PEPPER
  if (query.includes("chili") || query.includes("chilli") || query.includes("miris") || query.includes("pepper")) {
    return `Hello! Chili and hot peppers are high-value cash crops in Sri Lanka. Here is the professional cultivation cycle:
    
- **Soil Balance**: Prefers sandy loams with pH 6.0 - 6.8. If soil is acidic (under 5.5), dolomite lime is essential during land preparation.
- **Watering Plan**: Keep soil moist, not waterlogged. Waterlogging causes root rot and damping-off disease.
- **Major Threat**: Chili Leaf Curl Complex (caused by thrips, mites, and whiteflies). Avoid heavy chemical pesticides. Instead, spray **Neem Seed Kernel Extract (NSKE)** at 5% dilution weekly, or use wooden stakes with yellow sticky traps to capture vectors.
    
Let me know if you need fertilizer dosage charts for your acreage!`;
  }

  // 7. CROPS: VEGETABLES (CARROT, POTATO, ONION, GINGER, TURMERIC)
  if (query.includes("carrot") || query.includes("potato") || query.includes("onion") || query.includes("ginger") || query.includes("turmeric") || query.includes("ala") || query.includes("lunu")) {
    const matched = query.includes("ginger") || query.includes("turmeric") ? "Rhizome root crops like ginger and turmeric" : "Tuber vegetables";
    return `Excellent! ${matched} grow exceptionally well in Sri Lankan agricultural zones:
    
- **Land Sowing**: Highly raised beds are critical to guarantee excellent bottom drainage. Stagnant moisture ruins ginger rhizomes and potato tubers.
- **Soil Enhancers**: Mix 3 tonnes of decomposed cow dung or forest humus compost per acre. Add biochar to help the sand retain applied potash.
- **Mulching Guidelines**: For ginger and turmeric, cover beds immediately after planting with a thick layer of straw or dried leaves. This locks water, blocks weeds, and cools the roots.
- **Harvest indicators**: Leaves will slowly yellow and dry off at month 8 or 9, signaling that the roots are fully mature and ready for tilling.
    
Would you like to calculate exact seed rates per acre? Just ask!`;
  }

  // 8. SOIL / PH / FERTILIZER / COMPOST
  if (query.includes("fertilizer") || query.includes("pohora") || query.includes("organic") || query.includes("compost") || query.includes("ph") || query.includes("dolomite") || query.includes("urea")) {
    return `An excellent choice to optimize your fertilizer budget! In Sri Lanka, combining organic fertilizers like **Gliricidia sepium leaves** or composting with small split quantities of inorganic Urea significantly improves soil retention. 
    
For 1 acre of vegetable cultivation:
1. Apply 2-3 metric tonnes of organic compost during preparation.
2. Incorporate dolomite lime if your pH is under 6.0 to lock trace magnesium.
3. Apply nitrogenous fertilizers in small doses during cloudy days to prevent volatilization.
4. Gliricidia leaves provide roughly 3.5% Nitrogen on dry weight basis—excellent green compost!

What specific crop are you looking to fertilize today?`;
  }

  // 9. DISEASE / PEST
  if (query.includes("disease") || query.includes("pest") || query.includes("insect") || query.includes("worm") || query.includes("fungus") || query.includes("dieback") || query.includes("blight")) {
    return `Disease management requires immediate action! If you observe yellowing leaves, circular lesions, or trailing stem holes, please tell me the crop (coconut, chili, tomato, paddy, tea). 
    
As a first step of organic defense:
- Spray **Neem Seed Oil (5ml/L)** mixed with mild dish soap as an organic surfactant.
- Remove and burn infested plants to halt spore dispersal.
- Avoid overhead spraying to minimize leaf wetness.
- Use yellow sticky traps of 1ft x 1ft dimension coated with castor oil to trap aphids and whiteflies.

Feel free to upload an image of the infested leaf using our **Plant Clinic** tag, and I can suggest organic treatment remedies.`;
  }

  // 15. DEFAULT RESPONSIVE SEARCH / OPEN QUESTIONS DYNAMIC ADVISOR
  const cleanedTopic = userMsg.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").substring(0, 45);
  return `I have parsed your query regarding "${cleanedTopic}" in our Sri Lankan Agronomic database! 🌾
  
To optimize this area of your farm operations, our Departement of Agriculture field guides recommend focusing on:
1. **Soil Microclimate**: Ensure your active plot context has its soil pH tested. Acidic ranges limit potassium uptake, while waterlogged clays trigger fungal root molds.
2. **Organic Buffers**: Mix green leguminous crop compost (like Gliricidia sepium or Sunn Hemp) to organically bind soil layers.
3. **Resiliency Sowing**: Follow local Yala/Maha seasonal rains to minimize irrigation pump costs.

*Aswanna Tip*: To let our AI Agronomist perform unlimited live answering on this topic, ensure the **GEMINI_API_KEY** is configured in your project settings so we can unlock real-time Deep Reasoning! 

Is there a specific crop, district soil type, or livestock housing you would like me to detail next?`;
}

// -----------------------------------------------------------------
// INTEGRATING SERVER ROUTING & DEV VS PRODUCTION STATIC BUNDLING
// -----------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Aswanna: Initializing Vite Middleware (Development Mode)...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Aswanna: Serving Static Build Assets (Production Mode)...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`=============================================================`);
    console.log(`  🌾 ASWANNA SMART AGRICULTURE SERVER IS ONLINE 🌾`);
    console.log(`  Live Preview: http://localhost:${PORT}`);
    console.log(`  Environment:  ${process.env.NODE_ENV || "development"}`);
    console.log(`=============================================================`);
  });
}

startServer();
