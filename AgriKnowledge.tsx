import React, { useState } from "react";
import { 
  BookOpen, 
  Search, 
  ChevronRight, 
  Sparkles, 
  HelpCircle, 
  Compass, 
  Award, 
  Milk, 
  Egg, 
  Beef, 
  Layers, 
  Droplet, 
  Thermometer, 
  Clock, 
  Activity, 
  Heart, 
  Sprout 
} from "lucide-react";

interface SeedDetail {
  variety: string;
  depth: string;
  spacing: string;
  germinationDays: string;
}

interface CropKnowledgeItem {
  id: string;
  nameEn: string;
  nameSi: string;
  nameTa: string;
  sinhalaPronunciation: string;
  category: "Cereals" | "Spices" | "Beverages" | "Vegetables" | "Tubers";
  soilPreference: string;
  phRange: string;
  rainfallRequirement: string;
  maturityPeriod: string;
  pestsAndDiseases: { name: string; prevention: string }[];
  seedCare: SeedDetail;
  nurseryMgmt: string;
  harvestingCuring: string;
}

interface AnimalHusbandryItem {
  id: string;
  nameEn: string;
  nameSi: string;
  nameTa: string;
  category: "Dairy" | "Poultry" | "Goats" | "Buffalo" | "Swine";
  bestBreedsSub: string[];
  feedingRegime: string;
  idealHousing: string;
  criticalHealthSympt: { disease: string; signs: string; organicCure: string }[];
  yieldExpectations: string;
}

const SRI_LANKA_CROPS_DB: CropKnowledgeItem[] = [
  {
    id: "paddy",
    nameEn: "Paddy (Rice)",
    nameSi: "වී වගාව",
    nameTa: "நெல் பயிர்செய்கை",
    sinhalaPronunciation: "Pee Wagawa",
    category: "Cereals",
    soilPreference: "Heavy clayey or loamy clay soils that retain water well.",
    phRange: "5.5 - 6.5",
    rainfallRequirement: "High (needs standing water or 1200mm+ precipitation)",
    maturityPeriod: "90 - 105 days (e.g. BG-300, BG-352)",
    pestsAndDiseases: [
      { name: "Rice Blast (Pathogen)", prevention: "Avoid excessive nitrogen; apply copper fungicide or neem kernel extract." },
      { name: "Brown Plant Hopper (BPH)", prevention: "Drain fields for 3-4 days to break insect lifecycle; preserve natural dragonflies." }
    ],
    seedCare: {
      variety: "BG-352 (high-yield white), BG-360 (Keeri Samba), Red Heenati (traditional heritage)",
      depth: "1 - 2 cm",
      spacing: "20 cm x 15 cm (transplanting)",
      germinationDays: "3 - 5 days"
    },
    nurseryMgmt: "Soak seed paddy in clean water for 24 hours, then keep in moist sacks for 36 hours before sowing in raised mud nurseries.",
    harvestingCuring: "Harvest when 90% of panicles turn golden yellow. Dry grains on straw mats to 13-14% moisture content to prevent storage rot."
  },
  {
    id: "cinnamon",
    nameEn: "Ceylon Cinnamon",
    nameSi: "කුරුඳු වගාව",
    nameTa: "இலவங்கப்பட்டை",
    sinhalaPronunciation: "Kurundu Wagawa",
    category: "Spices",
    soilPreference: "Sandy loam, loose sandy shells or humic silver sands that have deep root drainage.",
    phRange: "4.5 - 6.5 (Highly Acidic to Neutral)",
    rainfallRequirement: "1850mm - 3000mm (Wet Zone Coastal & Southern Belts thrive best)",
    maturityPeriod: "2 - 3 years for initial bark peeling, cycles thereafter every 6 months.",
    pestsAndDiseases: [
      { name: "Rough Bark Disease", prevention: "Prune infected branches clean; spray Bordeaux mixture 1%." },
      { name: "Pink Borer (Stem)", prevention: "Apply bio-pesticide paste made from cow dung, clay, and wood vinegar onto trunk bases." }
    ],
    seedCare: {
      variety: "Sri Wijaya, Sri Gemunu (high oil yield selections)",
      depth: "1.5 cm",
      spacing: "1.2 m x 0.9 m (planting pits)",
      germinationDays: "14 - 21 days"
    },
    nurseryMgmt: "Sow freshly collected clean cinnnamon seeds directly in polythene bags containing sand, compost, and topsoil mix.",
    harvestingCuring: "Select mature brown shoots. Scrap outer cork, rub with brass rods to consolidate bark, then peerless peeling. Cure in shadow racks for 4-7 days before grading into 'alba' or 'continental' quills."
  },
  {
    id: "cardamom",
    nameEn: "Ceylon Cardamom",
    nameSi: "කරදමුංගු වගාව",
    nameTa: "ஏலக்காய் சாகுபடி",
    sinhalaPronunciation: "Karadamungu Wagawa",
    category: "Spices",
    soilPreference: "Humus-rich forest soils, well-aerated with heavy organic canopy shade.",
    phRange: "5.5 - 6.8",
    rainfallRequirement: "High shaded mist (1500 - 2500m elevation in Knuckles, Kandy, Nuwara Eliya)",
    maturityPeriod: "3 years to first capsule harvest",
    pestsAndDiseases: [
      { name: "Cardamom Mosaic Virus ('Katteke')", prevention: "Strictly uproot and burn infected clumps; spray soap oil to exclude aphid carriers." },
      { name: "Thrips infestation", prevention: "Regulate shade density to allow dappled sunlight; spray organic biochar smoke dilution (1:400)." }
    ],
    seedCare: {
      variety: "Malabar, Mysore type, Ceylon Wild (High aromatic indices)",
      depth: "1.0 cm",
      spacing: "2.5 m x 2.5 m under natural forest canopy",
      germinationDays: "30 - 45 days"
    },
    nurseryMgmt: "Raise cardamom in heavily shaded beds. Apply premium leaf mold compost liberally. Water frequently to maintain wet mulch.",
    harvestingCuring: "Harvest capsules just before complete maturity when seeds turn dark. Wash, then dry capsules in local hot-air curing barns to preserve green color."
  },
  {
    id: "green_chili",
    nameEn: "Green Chilies",
    nameSi: "අමු මිරිස් වගාව",
    nameTa: "பச்சை மிளகாய் சாகுபடி",
    sinhalaPronunciation: "Amu Miris Wagawa",
    category: "Vegetables",
    soilPreference: "Loamy, well-aerated sandy soil; highly susceptible to waterlogged root death.",
    phRange: "6.0 - 7.0 (Ideal Neutral)",
    rainfallRequirement: "Moderate (prefers drip irrigation in Dry Zone during dry spells)",
    maturityPeriod: "70 - 80 days to initial green pod picking",
    pestsAndDiseases: [
      { name: "Chili Leaf Curl Complex", prevention: "Controlled by neem oil sprays. Companion plant with maize or marigolds to block sucking thrips." },
      { name: "Anthracnose (Fruit Rot)", prevention: "Avoid overhead watering; remove rotted pods immediately; spray organic copper tea." }
    ],
    seedCare: {
      variety: "MICH 1, MICH Hybrid 1, KA-2 (stable high-fecundity pods)",
      depth: "0.5 cm",
      spacing: "60 cm x 45 cm",
      germinationDays: "7 - 10 days"
    },
    nurseryMgmt: "Sow in seedling seed trays using sterilized coir dust and compost. Keep under fine mesh net to exclude virus-carrying aphids.",
    harvestingCuring: "Pluck clean firm green chilies every 5-7 days. For dry chili, let them red-ripen completely on vines then sun-dry on raised mats."
  },
  {
    id: "cardamom_tea",
    nameEn: "Upcountry Tea",
    nameSi: "තේ වගාව",
    nameTa: "தேயிலை பயிர்ச்செய்கை",
    sinhalaPronunciation: "They Wagawa",
    category: "Beverages",
    soilPreference: "Deep, highly acidic red-yellow latosols on high sloping landscapes.",
    phRange: "4.5 - 5.5 (Acid loving)",
    rainfallRequirement: "High moist distribution (2000mm - 4000mm, misty weather)",
    maturityPeriod: "4 - 5 years to full pluck canopy",
    pestsAndDiseases: [
      { name: "Blister Blight (Fungal)", prevention: "Pluck intensively; spray copper fungicides; preserve soil shading." },
      { name: "Shot-hole Borer", prevention: "Apply systemic prunings; keep potassium (MOP) feeds stable to rebuild hard stem fibers." }
    ],
    seedCare: {
      variety: "TRI 2023, TRI 2025 (High plucking vigor clones)",
      depth: "N/A (Generally propagated via vegetative cuttings)",
      spacing: "1.2 m x 0.6 m along contour ridges",
      germinationDays: "10 - 20 days (for cuttings strike)"
    },
    nurseryMgmt: "Raise single-node leaf cuttings in polythene bags under shade tunnels with micro-irrigation sprays for 9 months.",
    harvestingCuring: "Pluck 'two leaves and a bud' every 7 days. Process (wither, roll, ferment, and fire) under strict CTC/Orthodox tea standards."
  },
  {
    id: "brinjals",
    nameEn: "Brinjals (Eggplant)",
    nameSi: "වම්බටු වගාව",
    nameTa: "கத்தரிக்காய் சாகுபடி",
    sinhalaPronunciation: "Wambatu Wagawa",
    category: "Vegetables",
    soilPreference: "Silt loam or sandy organic loams, porous and deeply composted.",
    phRange: "5.8 - 6.8",
    rainfallRequirement: "Moderate (thrives with structured furrow basin watering)",
    maturityPeriod: "85 - 100 days",
    pestsAndDiseases: [
      { name: "Brinjal Fruit & Shoot Borer (BFSB)", prevention: "Clip and burn drooping shoots; use pheromone traps; spray neem seed kernel tea." },
      { name: "Bacterial Wilt", prevention: "Strict crop rotation with gram species; solarize soil beds; avoid damaging roots during tilling." }
    ],
    seedCare: {
      variety: "Thinja, Padagoda, Ravana (Hybrid selections)",
      depth: "0.5 cm",
      spacing: "90 cm x 60 cm",
      germinationDays: "6 - 9 days"
    },
    nurseryMgmt: "Sow in organic beds, water with light rose-can spray. Introduce Gliricidia leaf composting to provide seedling nitrogen levels.",
    harvestingCuring: "Harvest when fruits are glossy, full-size but unripe. Touch-test: a slight finger indent should bounce back."
  },
  {
    id: "manioc",
    nameEn: "Cassava (Manioc)",
    nameSi: "මඤ්ඤොක්කා වගාව",
    nameTa: "மரவள்ளிக்கிழங்கு சாகுபடி",
    sinhalaPronunciation: "Manyokka Wagawa",
    category: "Tubers",
    soilPreference: "Sandy-loams, loose red-yellow podzolic soils that permit easy tuber swelling and excellent drainage.",
    phRange: "5.0 - 6.5",
    rainfallRequirement: "Low to Moderate (Highly drought resilient, perfect for Dry & Intermediate Zones)",
    maturityPeriod: "8 - 10 months (e.g. MU-51, CARI-555)",
    pestsAndDiseases: [
      { name: "Cassava Mosaic Disease (CMD)", prevention: "Use disease-free stem cuttings; spray organic insecticide (soap mix) to control whitefly vectors; uproot affected plants." },
      { name: "Tuber Rot (Phytophthora)", prevention: "Plant in raised ridges or mounds to avoid waterlogging; avoid harvesting in water-saturated soil." }
    ],
    seedCare: {
      variety: "MU-51 (highly popular, sweet taste, low cyanide), CARI-555 (high yield selection)",
      depth: "5 - 8 cm (planted horizontally or slanted)",
      spacing: "90 cm x 90 cm",
      germinationDays: "7 - 10 days (sprout initiation)"
    },
    nurseryMgmt: "Not grown in nurseries. Select healthy semi-mature stems (about 20-30cm long with 4-6 nodes) and plant directly in prepared ridges.",
    harvestingCuring: "Harvest when leaves begin to yellow and dry out. Carefully dig around the plant base and lift the root clump without snapping tubers. Consume or process within 48 hours to avoid physiological deterioration."
  }
];

const SRI_LANKA_ANIMAL_HUSBANDRY_DB: AnimalHusbandryItem[] = [
  {
    id: "buffalo_husbandry",
    nameEn: "Buffalo Husbandry & Curd Production",
    nameSi: "මී ගව පාලනය සහ මීකිරි",
    nameTa: "எருமை மாடு வளர்ப்பு & தயிர் உற்பத்தி",
    category: "Buffalo",
    bestBreedsSub: ["Murrah (high milk index)", "Nili-Ravi (exceptional fat percent)", "Local Lanka Buffalo (hardy mud worker & curd selection)"],
    feedingRegime: "Loves grazing in marshes, lagoons, and paddy stubble. Feed 40-50 kg/day of local wild grasses, water hyacinth, and rice straw. Supplement with 1-2 kg of coconut poonac and mineral mix.",
    idealHousing: "Open spacious paddocks with mud wallowing ponds or overhead sprinkler nozzles. Wallowing is critical for buffaloes to thermoregulate because they have 10x fewer sweat glands than cows.",
    criticalHealthSympt: [
      { disease: "Haemorrhagic Septicaemia (HS)", signs: "High fever, loud grunting, swelling around throat and neck, respiratory distress.", organicCure: "Annual vaccination is mandatory. Quarantine the herd instantly; feed herbal extract of neem and wild ginger; keep bedding dry." },
      { disease: "Foot Rot", signs: "Limping, foul odor from hoof clefts, warm swollen heels.", organicCure: "Clean hooves with 5% copper sulphate footbath; keep the herd on elevated dry concrete ground; apply tar-margosa mixture." }
    ],
    yieldExpectations: "5 - 8 Liters of highly viscous milk (7-9% butterfat, perfect for Sri Lankan Curd) daily. Lactation period of 280 days."
  },
  {
    id: "dairy_cows",
    nameEn: "Dairy Cow Husbandry",
    nameSi: "කිරි ගව පාලනය",
    nameTa: "பால் மாடு வளர்ப்பு",
    category: "Dairy",
    bestBreedsSub: ["Friesian Cross (suitable for Hill Country / Wet Cool zones)", "Sahiwal / Jersey Cross (Dry/Intermediate heat resilient)", "Local Ceylon Breed (hardy, low feed demand)"],
    feedingRegime: "Provide high-quality CO-3 / CO-4 Napier grass (30-40 kg/day per cow), sweet silage, and 2-3 kg Concentrated Govipola Feed blocks. Access to clean water + trace mineral salt licks is absolutely mandatory, otherwise milk yields drop up to 40%.",
    idealHousing: "Scrubbed concrete flooring sloped 1:50 for urine runoff. Minimum 45 sq. ft. spacing per cow. Iron/Wood partitions with individual feeding troughs and a tin roof insulated with coconut fronds to shield from peak Dry Zone midday heat.",
    criticalHealthSympt: [
      { disease: "Mastitis (Uder infection)", signs: "Hard, swollen teat, watery/flaky milk with blood tracks.", organicCure: "Strip out infected teats frequently; wash udder with warm water + turmeric paste; avoid damp mud bedding." },
      { disease: "Foot & Mouth Disease (FMD)", signs: "High fever, drooling foam from mouth, blisters on hooves and tongue.", organicCure: "Quarantine immediately; wash lesions with potassium permanganate solution; apply organic margosa seed oil." }
    ],
    yieldExpectations: "8 - 18 Liters of fresh milk daily (based on breed and green folder split). Lactation cycle spans 305 days post-calving."
  },
  {
    id: "goat_farming",
    nameEn: "Goat Breeding & Farming",
    nameSi: "එළු පාලනය",
    nameTa: "ஆடு வளர்ப்பு",
    category: "Goats",
    bestBreedsSub: ["Jamnapari (suitable for Dry Zone leaf grazing)", "Boer (fast meat indexing)", "Kottukachchiya (hardy local Sri Lankan breed)"],
    feedingRegime: "Strictly bypass grazing on wet morning grass (prevents lungworm). Feed with Gliricidia foliage, jack leaves, neem branches, and supplementary rice bran mash with a pinch of common salt.",
    idealHousing: "Elevated slatted wooden floor system (3-4 feet high) with 1cm gaps between slats. This prevents foot rot by letting dung fall through, keeping hooves perfectly dry and clean.",
    criticalHealthSympt: [
      { disease: "Peste des Petits Ruminants (PPR/Goat Plague)", signs: "Severe nasal discharge, crusty eyes, high fever, foul diarrhea.", organicCure: "Immediate isolation. No organic cure; vaccinate young kits at 3 months; keep housing clean and sanitized." },
      { disease: "Bloat (Tympany)", signs: "Swollen left flank, grunting, respiratory distress, frothy gas buildup.", organicCure: "Administer 100ml ginger-garlic-tamarind juice in clean water; keep the goat standing and moving." }
    ],
    yieldExpectations: "1.5 - 3 Liters of milk daily for Jamnapari. Meat weight indexing 35kg within 9 months for Kottukachchiya."
  },
  {
    id: "poultry",
    nameEn: "Poultry (Layers & Broilers)",
    nameSi: "කුකුළු පාලනය",
    nameTa: "கோழி வளர்ப்பு",
    category: "Poultry",
    bestBreedsSub: ["Shaver Brown (Layer: outstanding egg layer)", "Cobb 500 (Broiler: rapid protein yield)", "Local Gam Kukul (heritage free-rambler: rich yellow yolks)"],
    feedingRegime: "Layers: Feed 120g premium grain feed block daily. Broilers: Broiler Starter crumbs (Day 1-21), then grower pellets. Supplement daily with chopped wild gotu kola and papaya leaves to naturally raise immune ratings.",
    idealHousing: "Deep Litter housing (utilize dry paddy husk or wood shavings, 4-6 inches thickness) or elevated wire mesh cages. Ensure excellent wind ventilation to prevent ammonia gas buildup, which causes respiratory blindness.",
    criticalHealthSympt: [
      { disease: "Newcastle Disease (Ranikhet)", signs: "Greenish watery droppings, twisted neck, gasping for air, high mortality.", organicCure: "Strictly vaccinate. Isolate sick; spray dilute neem kernel tea as general antiviral clean." },
      { disease: "Coccidiosis", signs: "Bloody diarrhea, pale combs, severe ruffling of wings.", organicCure: "Mix wood vinegar (3ml per liter of drinking water) or feed dried garlic powder; keep litter perfectly dry." }
    ],
    yieldExpectations: "280 - 310 eggs annually per Layer. Broilers scale to 2.2 kg weight within 38-42 days."
  }
];

export default function AgriKnowledge({ lang }: { lang: "en" | "si" | "ta" }) {
  const [activeSegment, setActiveSegment] = useState<"crops" | "animals">("crops");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<CropKnowledgeItem | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalHusbandryItem | null>(null);

  // Filter lists based on query
  const filteredCrops = SRI_LANKA_CROPS_DB.filter((crop) => {
    const query = searchQuery.toLowerCase();
    return (
      crop.nameEn.toLowerCase().includes(query) ||
      crop.nameSi.includes(query) ||
      crop.nameTa.includes(query) ||
      crop.category.toLowerCase().includes(query)
    );
  });

  const filteredAnimals = SRI_LANKA_ANIMAL_HUSBANDRY_DB.filter((animal) => {
    const query = searchQuery.toLowerCase();
    return (
      animal.nameEn.toLowerCase().includes(query) ||
      animal.nameSi.includes(query) ||
      animal.nameTa.includes(query) ||
      animal.category.toLowerCase().includes(query)
    );
  });

  const handleSelectCrop = (crop: CropKnowledgeItem) => {
    setSelectedCrop(crop);
    setSelectedAnimal(null);
  };

  const handleSelectAnimal = (animal: AnimalHusbandryItem) => {
    setSelectedAnimal(animal);
    setSelectedCrop(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Segment Toggles */}
      <div className="bg-white rounded-2xl border border-gray-150 p-4.5 flex flex-col md:flex-row items-center gap-4 justify-between shadow-3xs">
        {/* Toggle Pills */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl text-xs font-black">
          <button
            onClick={() => {
              setActiveSegment("crops");
              setSearchQuery("");
              setSelectedCrop(null);
              setSelectedAnimal(null);
            }}
            className={`px-4.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSegment === "crops"
                ? "bg-emerald-800 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>{lang === "si" ? "බෝග නාමාවලිය" : lang === "ta" ? "பயிர் கலைக்களஞ்சியம்" : "Crop Grow Directory"}</span>
          </button>
          <button
            onClick={() => {
              setActiveSegment("animals");
              setSearchQuery("");
              setSelectedCrop(null);
              setSelectedAnimal(null);
            }}
            className={`px-4.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSegment === "animals"
                ? "bg-emerald-800 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Heart className="w-4 h-4 text-emerald-400" />
            <span>{lang === "si" ? "සත්ව පාලන උපදෙස්" : lang === "ta" ? "கால்நடை வளர்ப்பு" : "Animal Husbandry"}</span>
          </button>
        </div>

        {/* Input search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white transition-all text-xs"
            placeholder={
              activeSegment === "crops"
                ? (lang === "si" ? "උදා: වී, කුරුඳු, මිරිස්..." : lang === "ta" ? "தேடுக: நெல், மிளகாய்..." : "Search Cinnamon, Paddy, Chilies...")
                : (lang === "si" ? "උදා: ගවයා, එළුවන්, කුකුළන්..." : lang === "ta" ? "தேடுக: ஆடு, மாடு..." : "Search Dairy, Poultry, Goats...")
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main interactive window: Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: searchable directory list (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-150 p-4.5 space-y-3 max-h-[500px] overflow-y-auto shadow-xs">
          <span className="text-[10px] font-mono text-gray-400 font-extrabold block tracking-wider uppercase">
            {activeSegment === "crops" ? "Sri Lankan Tropical Botanical Register" : "Livestock Breeding Classifications"}
          </span>

          <div className="space-y-1.5">
            {activeSegment === "crops" && 
              filteredCrops.map((crop) => {
                const isSelected = selectedCrop?.id === crop.id;
                return (
                  <button
                    key={crop.id}
                    onClick={() => handleSelectCrop(crop)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center text-xs ${
                      isSelected 
                        ? "border-emerald-600 bg-emerald-50/25 ring-1 ring-emerald-600/10" 
                        : "border-gray-100 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="space-y-0.5 max-w-[85%]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-800">
                          {lang === "si" ? crop.nameSi : lang === "ta" ? crop.nameTa : crop.nameEn}
                        </span>
                        <span className="text-[8.5px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                          {crop.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 truncate italic">
                        {crop.sinhalaPronunciation} • {crop.maturityPeriod}
                      </p>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 text-gray-300 ${isSelected ? "text-emerald-700" : ""}`} />
                  </button>
                );
              })}

            {activeSegment === "animals" && 
              filteredAnimals.map((animal) => {
                const isSelected = selectedAnimal?.id === animal.id;
                return (
                  <button
                    key={animal.id}
                    onClick={() => handleSelectAnimal(animal)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center text-xs ${
                      isSelected 
                        ? "border-emerald-600 bg-emerald-50/25 ring-1 ring-emerald-600/10" 
                        : "border-gray-100 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="space-y-0.5 max-w-[85%]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-800">
                          {lang === "si" ? animal.nameSi : lang === "ta" ? animal.nameTa : animal.nameEn}
                        </span>
                        <span className="text-[8.5px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                          {animal.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 truncate">
                        {animal.bestBreedsSub[0]}
                      </p>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 text-gray-300 ${isSelected ? "text-emerald-700" : ""}`} />
                  </button>
                );
              })}

            {activeSegment === "crops" && filteredCrops.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6 italic">No crops match your query</p>
            )}
            {activeSegment === "animals" && filteredAnimals.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6 italic">No livestock registers match your query</p>
            )}
          </div>
        </div>

        {/* Right Side: details panel (8 cols) */}
        <div className="lg:col-span-8">
          {/* Default view when nothing selected */}
          {!selectedCrop && !selectedAnimal && (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-16 text-center space-y-4 h-[380px] flex flex-col justify-center items-center">
              <BookOpen className="w-12 h-12 text-slate-300" />
              <div className="space-y-1.5 max-w-sm">
                <h4 className="font-display font-semibold text-gray-700 text-sm">Agriculture & Husbandry Library</h4>
                <p className="text-xs text-gray-400">
                  Select any tropical crop variety or livestock breed from the left directory to reveal Department of Agriculture guidelines, seed spacing maps, vaccine checks, or herbal medicines.
                </p>
              </div>
            </div>
          )}

          {/* Details for Selected Crop */}
          {selectedCrop && (
            <div className="bg-white rounded-2xl border border-gray-150 p-6 space-y-6 shadow-xs">
              {/* Header */}
              <div className="border-b border-gray-100 pb-4 space-y-1.5">
                <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5" /> SRI LANKAN TROPICAL BOTANICAL ARCHIVE
                </span>
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <h3 className="font-display font-extrabold text-[#113a17] text-lg">
                      {selectedCrop.nameEn} ({lang === "si" ? selectedCrop.nameSi : lang === "ta" ? selectedCrop.nameTa : selectedCrop.sinhalaPronunciation})
                    </h3>
                    <p className="text-xs text-gray-400 italic">Scientific taxonomy: <strong>{selectedCrop.scientificName}</strong></p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded">
                    {selectedCrop.category}
                  </span>
                </div>
              </div>

              {/* Bio Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-gray-600 space-y-0.5">
                  <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider block">Ideal Soil Type</span>
                  <span className="font-bold text-slate-800 leading-tight block">{selectedCrop.soilPreference}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-gray-600 space-y-0.5">
                  <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider block">Neutral pH Range</span>
                  <span className="font-bold text-slate-800 block text-sm">{selectedCrop.phRange}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-gray-600 space-y-0.5">
                  <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider block">Rainfall/Water Needs</span>
                  <span className="font-bold text-slate-800 leading-tight block">{selectedCrop.rainfallRequirement}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-gray-600 space-y-0.5">
                  <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider block">Maturity Period</span>
                  <span className="font-bold text-slate-800 block">{selectedCrop.maturityPeriod}</span>
                </div>
              </div>

              {/* Seeding and Nursery Spacing Card */}
              <div className="border border-emerald-100 bg-emerald-50/15 rounded-xl p-4.5 space-y-3.5">
                <h4 className="text-xs font-mono font-bold tracking-wider text-emerald-800 uppercase flex items-center gap-1.5 border-b border-emerald-100 pb-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" /> Seeding & Spacing Blueprint
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
                  <div>
                    <span className="text-emerald-700 font-bold block mb-0.5">Recommend Varieties</span>
                    <p className="text-[11px] leading-relaxed">{selectedCrop.seedCare.variety}</p>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-bold block mb-0.5">Sowing Depth & Spacing</span>
                    <p className="text-[11px] leading-relaxed font-mono">Depth: {selectedCrop.seedCare.depth} • Space: {selectedCrop.seedCare.spacing}</p>
                  </div>
                  <div>
                    <span className="text-emerald-700 font-bold block mb-0.5">Germination Span</span>
                    <p className="text-[11px] leading-relaxed font-mono">{selectedCrop.seedCare.germinationDays}</p>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-600 border-t border-emerald-100/50 pt-2 flex gap-1.5 items-start">
                  <Award className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[10.5px] leading-normal italic">
                    <strong>Department Nursery Directive:</strong> &quot;{selectedCrop.nurseryMgmt}&quot;
                  </p>
                </div>
              </div>

              {/* Pests, Diseases, and Harvesting splits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                <div className="border border-gray-150 rounded-xl p-4 space-y-2.5">
                  <span className="font-mono text-gray-400 text-[9px] uppercase tracking-widest font-black block border-b pb-1">Organic Pest Defense Regimes</span>
                  <div className="space-y-3">
                    {selectedCrop.pestsAndDiseases.map((pad, idx) => (
                      <div key={idx} className="space-y-1">
                        <span className="font-bold text-rose-800 block text-[11px] flex items-center gap-1">⚠ {pad.name}</span>
                        <p className="text-[10.5px] leading-relaxed text-gray-600 pl-4">{pad.prevention}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-150 rounded-xl p-4 bg-slate-50/20 space-y-2">
                  <span className="font-mono text-gray-400 text-[9px] uppercase tracking-widest font-black block border-b pb-1">Harvesting & Post-Harvest Curing</span>
                  <p className="text-[11px] leading-relaxed text-gray-600 font-sans">
                    {selectedCrop.harvestingCuring}
                  </p>
                  <div className="bg-amber-50 rounded p-2 text-[10px] text-amber-900 border border-amber-100 flex gap-1 items-start mt-2">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5" />
                    <span>Always ensure moisture readings comply strictly with Govijana storage silos thresholds to qualify for floor price guarantees.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Details for Selected Animal Husbandry */}
          {selectedAnimal && (
            <div className="bg-white rounded-2xl border border-gray-150 p-6 space-y-6 shadow-xs">
              {/* Header */}
              <div className="border-b border-gray-100 pb-4 space-y-1.5">
                <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-emerald-600" /> NATIONAL LIVESTOCK BREEDING MANUAL DEPT
                </span>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-extrabold text-[#113a17] text-lg">
                      {selectedAnimal.nameEn} ({lang === "si" ? selectedAnimal.nameSi : selectedAnimal.nameTa})
                    </h3>
                    <p className="text-xs text-gray-400">Breed selection & organic veterinary management standards</p>
                  </div>
                  <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold px-2.5 py-1 rounded">
                    {selectedAnimal.category} Sector
                  </span>
                </div>
              </div>

              {/* Breeds details */}
              <div className="bg-teal-50/20 border border-teal-100/50 p-4.5 rounded-xl space-y-3">
                <h4 className="text-xs font-mono font-bold tracking-wider text-teal-800 uppercase flex items-center gap-2 border-b border-teal-100 pb-1">
                  <Award className="w-4 h-4 text-teal-600" /> Verified Highly-Productive Breeds in Sri Lanka
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {selectedAnimal.bestBreedsSub.map((breed, idx) => (
                    <div key={idx} className="bg-white p-2 border border-teal-100 rounded-lg text-teal-950 font-medium">
                      {idx + 1}. {breed}
                    </div>
                  ))}
                </div>
              </div>

              {/* Feed and House bento split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                <div className="border border-gray-150 p-4.5 rounded-xl space-y-2">
                  <span className="font-mono text-gray-400 text-[9px] uppercase tracking-widest font-black block border-b pb-1 flex items-center gap-1">
                    <Milk className="w-3.5 h-3.5 text-emerald-600" /> Nutritional Feeding Regimes
                  </span>
                  <p className="text-[11px] leading-relaxed text-gray-600">
                    {selectedAnimal.feedingRegime}
                  </p>
                </div>

                <div className="border border-gray-150 p-4.5 rounded-xl space-y-2">
                  <span className="font-mono text-gray-400 text-[9px] uppercase tracking-widest font-black block border-b pb-1 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" /> Shelter & Hygienic Housing
                  </span>
                  <p className="text-[11px] leading-relaxed text-gray-600">
                    {selectedAnimal.idealHousing}
                  </p>
                </div>
              </div>

              {/* Health Warnings & Herbal treatment manuals */}
              <div className="border border-gray-150 rounded-xl p-4.5 space-y-3 bg-rose-50/5">
                <h4 className="text-xs font-mono font-bold tracking-wider text-rose-800 uppercase flex items-center gap-1.5 border-b border-rose-100 pb-1.5">
                  <Activity className="w-4 h-4 text-rose-600 animate-pulse" /> Critical Livestock Diseases & Organic Cures
                </h4>
                <div className="space-y-4 text-xs text-gray-600">
                  {selectedAnimal.criticalHealthSympt.map((sympt, idx) => (
                    <div key={idx} className="p-3 bg-white border border-rose-100 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-4">
                        <span className="font-bold text-rose-800 text-[11px] block">⚠ {sympt.disease}</span>
                        <span className="text-[9.5px] font-mono text-gray-400">Diagnostic Signs:</span>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-sans">{sympt.signs}</p>
                      </div>
                      <div className="md:col-span-8 border-l md:border-l border-gray-100 md:pl-3 space-y-0.5">
                        <span className="text-emerald-700 font-mono font-bold text-[9px] uppercase tracking-wider block">Eco-Veterinary Response</span>
                        <p className="text-[10.5px] leading-relaxed text-gray-600 font-sans italic">&quot;{sympt.organicCure}&quot;</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Yield expectations footer card */}
              <div className="bg-[#113a17] text-white p-4 rounded-xl flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5 text-xs">
                  <HelpCircle className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-300 font-bold block">Estimated Productivity</span>
                    <p className="text-[11.5px] text-white/95">{selectedAnimal.yieldExpectations}</p>
                  </div>
                </div>
                <div className="p-1 px-3 bg-white/10 rounded border border-white/10 font-bold text-[10.5px] font-mono">
                  Govijana Approved
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
