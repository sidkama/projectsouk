export const MUSEUM_NAVIGATION = {
  museums: {
    label: "Museums",
    subcategories: [
      { name: "Louvre Museum", slug: "louvre" },
      { name: "MoMA", slug: "moma" },
      { name: "British Museum", slug: "british-museum" },
      { name: "Metropolitan Museum", slug: "met-museum" },
      { name: "Smithsonian", slug: "smithsonian" },
      { name: "European Museums", slug: "european" },
      { name: "American Museums", slug: "american" },
      { name: "Asian Museums", slug: "asian" },
    ]
  },
  clothing: {
    label: "Clothing",
    subcategories: [
      { name: "T-Shirts", slug: "t-shirts" },
      { name: "Hoodies", slug: "hoodies" },
      { name: "Scarves", slug: "scarves" },
      { name: "Ties", slug: "ties" },
      { name: "Bags", slug: "bags" },
      { name: "Jewelry", slug: "jewelry" },
      { name: "Watches", slug: "watches" },
      { name: "Umbrellas", slug: "umbrellas" },
    ]
  },
  souvenirs: {
    label: "Souvenirs",
    subcategories: [
      { name: "Postcards", slug: "postcards" },
      { name: "Magnets", slug: "magnets" },
      { name: "Keychains", slug: "keychains" },
      { name: "Pins & Badges", slug: "pins-badges" },
      { name: "Mugs", slug: "mugs" },
      { name: "Posters", slug: "posters" },
      { name: "Coasters", slug: "coasters" },
      { name: "Calendars", slug: "calendars" },
    ]
  },
  tickets: {
    label: "Tickets",
    subcategories: [
      { name: "General Admission", slug: "general-admission" },
      { name: "Student Discounts", slug: "student-discounts" },
      { name: "Senior Tickets", slug: "senior-tickets" },
      { name: "Group Rates", slug: "group-rates" },
      { name: "VIP Tours", slug: "vip-tours" },
      { name: "Exhibition Passes", slug: "exhibition-passes" },
      { name: "Annual Memberships", slug: "annual-memberships" },
      { name: "Workshop Access", slug: "workshop-access" },
    ]
  },
  art: {
    label: "Art",
    subcategories: [
      { name: "Art Prints", slug: "art-prints" },
      { name: "Canvas Reproductions", slug: "canvas-reproductions" },
      { name: "Posters", slug: "art-posters" },
      { name: "Photography", slug: "photography" },
      { name: "Sculptures", slug: "sculptures" },
      { name: "Figurines", slug: "figurines" },
      { name: "Replica Artifacts", slug: "replica-artifacts" },
      { name: "Limited Editions", slug: "limited-editions" },
    ]
  }
};

export const FILTER_OPTIONS = {
  priceRanges: [
    { label: "Under $25", min: 0, max: 25 },
    { label: "$25 - $50", min: 25, max: 50 },
    { label: "$50 - $100", min: 50, max: 100 },
    { label: "Over $100", min: 100, max: Infinity },
  ],
  materials: [
    "Canvas",
    "Cotton",
    "Silk",
    "Ceramic",
    "Leather",
    "Paper",
    "Resin",
    "Metal",
  ],
  countries: [
    "USA",
    "France",
    "UK",
    "Italy",
    "Spain",
    "Germany",
    "Netherlands",
    "Japan",
  ]
};

export const CURRENCY_OPTIONS = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

export const LANGUAGE_OPTIONS = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
];
