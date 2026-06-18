export const mockProducts = [
  {
    _id: "p1",
    name: "Apex Dry-Fit Pro T-Shirt",
    code: "ATH-TS-001",
    category: "Sports T-Shirts",
    price: 799,
    description: "Engineered for high-intensity workouts, this t-shirt features anti-microbial fabric with moisture-wicking technology. Designed with flatlock seams to minimize chafing and highly breathable mesh zones on the back for maximum ventilation.",
    fabric: "88% Polyester, 12% Spandex (Dry-Fit Interlock)",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#1a365d", "#15803d", "#374151"],
    colorNames: ["Navy Blue", "Forest Green", "Charcoal Gray"],
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600"
    ],
    isActive: true,
    isFeatured: true,
    stockStatus: "In Stock",
    tags: ["running", "gym", "breathable", "dryfit"]
  },
  {
    _id: "p2",
    name: "AeroDry Football Jersey",
    code: "ATH-JY-002",
    category: "Jerseys",
    price: 999,
    description: "Standard-fit football jersey made from lightweight knit fabric. Features classic raglan sleeves, vibrant custom sublimated side panels, and sweat-wicking materials to keep you cool and dry on the pitch.",
    fabric: "100% Recycled Polyester (Double Knit Mesh)",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["#dc2626", "#2563eb", "#ffffff"],
    colorNames: ["Fiery Red", "Electric Blue", "Classic White"],
    images: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600"
    ],
    isActive: true,
    isFeatured: true,
    stockStatus: "In Stock",
    tags: ["football", "soccer", "jersey", "sublimated"]
  },
  {
    _id: "p3",
    name: "Vanguard Team Basketball Kit",
    code: "ATH-TU-003",
    category: "Team Uniforms",
    price: 1899,
    description: "Premium basketball uniform kit consisting of a matching jersey and shorts. Rib-knit detailing at the neckline and armholes, and lightweight mesh construction for free-flowing court movements.",
    fabric: "100% Polyester Mesh (Closed Hole)",
    sizes: ["M", "L", "XL", "XXL", "XXXL"],
    colors: ["#eab308", "#000000"],
    colorNames: ["Golden Yellow", "Matte Black"],
    images: [
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1526232762687-2159ad2c38a7?auto=format&fit=crop&q=80&w=600"
    ],
    isActive: true,
    isFeatured: true,
    stockStatus: "Limited Stock",
    tags: ["basketball", "team", "kit", "jersey"]
  },
  {
    _id: "p4",
    name: "FlexCore Active Shorts",
    code: "ATH-SH-004",
    category: "Sports Shorts",
    price: 599,
    description: "Ergonomically cut training shorts with an elastic waistband and inner drawcord. Side zipper pockets to store essentials, and four-way stretch fabric that supports complete freedom of movement during runs or training.",
    fabric: "90% Nylon, 10% Spandex woven stretch",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#111827", "#4b5563"],
    colorNames: ["Midnight Black", "Slate Gray"],
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600"
    ],
    isActive: true,
    isFeatured: false,
    stockStatus: "In Stock",
    tags: ["shorts", "running", "training", "zipper-pocket"]
  },
  {
    _id: "p5",
    name: "Tapered Performance Track Pants",
    code: "ATH-TP-005",
    category: "Track Pants",
    price: 1199,
    description: "Athletic joggers featuring a tapered fit with ankle zippers for quick shoe transitions. Double-weave knees for durability and comfortable elastic cuff detailing at the waist.",
    fabric: "70% Cotton, 25% Polyester, 5% Spandex",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["#000000", "#1e3a8a", "#6b7280"],
    colorNames: ["Jet Black", "Deep Navy", "Melange Gray"],
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&q=80&w=600"
    ],
    isActive: true,
    isFeatured: false,
    stockStatus: "In Stock",
    tags: ["joggers", "trackpants", "tapered", "warmup"]
  },
  {
    _id: "p6",
    name: "ThermaShield Athleisure Hoodie",
    code: "ATH-HD-006",
    category: "Hoodies",
    price: 1699,
    description: "Heavyweight fleece hoodie designed for cold-weather workouts or casual athleisure streetwear. Drawstring-adjustable hood, kangaroo front pocket, and double-brushed inner liner for maximum heat retention.",
    fabric: "80% Cotton fleece, 20% Polyester",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    colors: ["#374151", "#78716c", "#1e1b4b"],
    colorNames: ["Charcoal Gray", "Stone Beige", "Indigo Blue"],
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600"
    ],
    isActive: true,
    isFeatured: true,
    stockStatus: "In Stock",
    tags: ["hoodie", "fleece", "warm", "casual", "pullover"]
  },
  {
    _id: "p7",
    name: "Apex Pro Athletic Tracksuit",
    code: "ATH-TS-007",
    category: "Tracksuits",
    price: 2499,
    description: "Complete full-zip jacket and track pants set. Clean athletic look with contrast striping along the shoulders and pants. Ribbed cuffs and hem to trap body heat during warm-up sessions.",
    fabric: "100% Polyester Tricot (Glosses Finish)",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["#0f172a", "#be123c"],
    colorNames: ["Dark Slate", "Crimson Red"],
    images: [
      "https://images.unsplash.com/photo-1483721310020-03333e577076?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1485727749690-d091e8284ef3?auto=format&fit=crop&q=80&w=600"
    ],
    isActive: true,
    isFeatured: true,
    stockStatus: "In Stock",
    tags: ["tracksuit", "matching-set", "full-zip", "unisex"]
  },
  {
    _id: "p8",
    name: "Championship Custom Sublimated Kit",
    code: "ATH-CK-008",
    category: "Custom Team Kits",
    price: 2999,
    description: "Professional sublimation jersey & shorts kit for cricket or football teams. Fully customizable with team logos, custom names, and numbers. Highly breathable mesh panels keep player body heat down.",
    fabric: "100% Polyester Micro-Mesh (Moisture Management)",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    colors: ["#3b82f6", "#f97316", "#10b981"],
    colorNames: ["Royal Blue", "Sunset Orange", "Emerald Teal"],
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=600"
    ],
    isActive: true,
    isFeatured: true,
    stockStatus: "In Stock",
    tags: ["custom", "sublimated", "teamkit", "cricket", "football"]
  },
  {
    _id: "p9",
    name: "Athenura Endurance Compression Socks",
    code: "ATH-AC-009",
    category: "Accessories",
    price: 399,
    description: "High-performance compression socks featuring cushioned footbeds for impact absorption. Arch compression band for support and stay-up rib cuffs that hold firmly on your legs during intense runs.",
    fabric: "75% Nylon, 15% Polyester, 10% Elastane",
    sizes: ["S", "M", "L"],
    colors: ["#ffffff", "#000000"],
    colorNames: ["Arctic White", "Classic Black"],
    images: [
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600"
    ],
    isActive: true,
    isFeatured: false,
    stockStatus: "In Stock",
    tags: ["socks", "compression", "running", "accessories"]
  },
  {
    _id: "p10",
    name: "Swift-Dry Runner T-Shirt",
    code: "ATH-TS-010",
    category: "Sports T-Shirts",
    price: 649,
    description: "A super lightweight racing tee. Quick-drying construction with mesh panels for underarms. Features reflective strips on both front chest and back for night runs.",
    fabric: "100% Polyester Quick-Dry Melange",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#10b981", "#ef4444"],
    colorNames: ["Neon Green", "Ruby Red"],
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600"
    ],
    isActive: true,
    isFeatured: false,
    stockStatus: "Out of Stock",
    tags: ["running", "lightweight", "reflective"]
  }
];
