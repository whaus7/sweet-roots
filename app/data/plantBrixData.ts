export interface PlantBrixData {
  name: string;
  category: string;
  healthyBrixRange: {
    min: number;
    max: number;
  };
  description: string;
}

export const plantBrixData: PlantBrixData[] = [
  // Leafy Greens
  {
    name: "Spinach",
    category: "Leafy Greens",
    healthyBrixRange: { min: 6, max: 12 },
    description: "High in iron and nutrients",
  },
  {
    name: "Kale",
    category: "Leafy Greens",
    healthyBrixRange: { min: 8, max: 14 },
    description: "Nutrient-dense superfood",
  },
  {
    name: "Lettuce",
    category: "Leafy Greens",
    healthyBrixRange: { min: 4, max: 8 },
    description: "Mild and crisp",
  },
  {
    name: "Arugula",
    category: "Leafy Greens",
    healthyBrixRange: { min: 6, max: 10 },
    description: "Peppery and nutritious",
  },
  {
    name: "Swiss Chard",
    category: "Leafy Greens",
    healthyBrixRange: { min: 6, max: 12 },
    description: "Colorful and vitamin-rich",
  },
  {
    name: "Collard Greens",
    category: "Leafy Greens",
    healthyBrixRange: { min: 8, max: 14 },
    description: "Southern staple green",
  },

  // Brassicas
  {
    name: "Broccoli",
    category: "Brassicas",
    healthyBrixRange: { min: 8, max: 14 },
    description: "Cancer-fighting cruciferous",
  },
  {
    name: "Cauliflower",
    category: "Brassicas",
    healthyBrixRange: { min: 6, max: 12 },
    description: "Versatile white vegetable",
  },
  {
    name: "Cabbage",
    category: "Brassicas",
    healthyBrixRange: { min: 6, max: 10 },
    description: "Sturdy storage vegetable",
  },
  {
    name: "Brussels Sprouts",
    category: "Brassicas",
    healthyBrixRange: { min: 8, max: 14 },
    description: "Miniature cabbages",
  },

  // Root Vegetables
  {
    name: "Carrots",
    category: "Root Vegetables",
    healthyBrixRange: { min: 8, max: 16 },
    description: "Sweet orange roots",
  },
  {
    name: "Beets",
    category: "Root Vegetables",
    healthyBrixRange: { min: 10, max: 18 },
    description: "Sweet and colorful",
  },
  {
    name: "Radishes",
    category: "Root Vegetables",
    healthyBrixRange: { min: 6, max: 12 },
    description: "Peppery and crisp",
  },
  {
    name: "Turnips",
    category: "Root Vegetables",
    healthyBrixRange: { min: 6, max: 12 },
    description: "Mild root vegetable",
  },
  {
    name: "Parsnips",
    category: "Root Vegetables",
    healthyBrixRange: { min: 8, max: 14 },
    description: "Sweet winter root",
  },

  // Nightshades
  {
    name: "Tomatoes",
    category: "Nightshades",
    healthyBrixRange: { min: 8, max: 16 },
    description: "Sweet garden favorite",
  },
  {
    name: "Bell Peppers",
    category: "Nightshades",
    healthyBrixRange: { min: 6, max: 12 },
    description: "Colorful and sweet",
  },
  {
    name: "Eggplant",
    category: "Nightshades",
    healthyBrixRange: { min: 4, max: 8 },
    description: "Meaty purple vegetable",
  },
  {
    name: "Potatoes",
    category: "Nightshades",
    healthyBrixRange: { min: 6, max: 12 },
    description: "Starchy staple crop",
  },

  // Legumes
  {
    name: "Green Beans",
    category: "Legumes",
    healthyBrixRange: { min: 6, max: 10 },
    description: "Crisp garden beans",
  },
  {
    name: "Peas",
    category: "Legumes",
    healthyBrixRange: { min: 8, max: 14 },
    description: "Sweet garden peas",
  },
  {
    name: "Snap Peas",
    category: "Legumes",
    healthyBrixRange: { min: 8, max: 14 },
    description: "Edible pod peas",
  },

  // Alliums
  {
    name: "Onions",
    category: "Alliums",
    healthyBrixRange: { min: 6, max: 12 },
    description: "Essential cooking ingredient",
  },
  {
    name: "Garlic",
    category: "Alliums",
    healthyBrixRange: { min: 8, max: 14 },
    description: "Pungent flavor enhancer",
  },
  {
    name: "Leeks",
    category: "Alliums",
    healthyBrixRange: { min: 6, max: 12 },
    description: "Mild onion relative",
  },

  // Cucurbits
  {
    name: "Cucumbers",
    category: "Cucurbits",
    healthyBrixRange: { min: 4, max: 8 },
    description: "Cool and refreshing",
  },
  {
    name: "Zucchini",
    category: "Cucurbits",
    healthyBrixRange: { min: 4, max: 8 },
    description: "Versatile summer squash",
  },
  {
    name: "Winter Squash",
    category: "Cucurbits",
    healthyBrixRange: { min: 8, max: 16 },
    description: "Sweet storage squash",
  },
  {
    name: "Pumpkins",
    category: "Cucurbits",
    healthyBrixRange: { min: 8, max: 16 },
    description: "Autumn harvest favorite",
  },

  // Herbs
  {
    name: "Basil",
    category: "Herbs",
    healthyBrixRange: { min: 6, max: 12 },
    description: "Aromatic Italian herb",
  },
  {
    name: "Parsley",
    category: "Herbs",
    healthyBrixRange: { min: 6, max: 10 },
    description: "Fresh garnish herb",
  },
  {
    name: "Cilantro",
    category: "Herbs",
    healthyBrixRange: { min: 6, max: 10 },
    description: "Fresh Mexican herb",
  },
  {
    name: "Mint",
    category: "Herbs",
    healthyBrixRange: { min: 6, max: 12 },
    description: "Cooling aromatic herb",
  },

  // Microgreens
  {
    name: "Sunflower Microgreens",
    category: "Microgreens",
    healthyBrixRange: { min: 8, max: 16 },
    description: "Nutrient-dense sprouts",
  },
  {
    name: "Pea Shoots",
    category: "Microgreens",
    healthyBrixRange: { min: 8, max: 14 },
    description: "Sweet pea sprouts",
  },
  {
    name: "Radish Microgreens",
    category: "Microgreens",
    healthyBrixRange: { min: 6, max: 12 },
    description: "Spicy microgreens",
  },
  {
    name: "Broccoli Microgreens",
    category: "Microgreens",
    healthyBrixRange: { min: 8, max: 14 },
    description: "Nutrient-packed sprouts",
  },
];

export const getPlantByName = (name: string): PlantBrixData | undefined => {
  return plantBrixData.find((plant) => plant.name === name);
};

export const getPlantsByCategory = (category: string): PlantBrixData[] => {
  return plantBrixData.filter((plant) => plant.category === category);
};

export const getCategories = (): string[] => {
  return [...new Set(plantBrixData.map((plant) => plant.category))];
};
