export type VariantType = 'natural' | 'bridal' | 'anime' | 'festival';

export interface VariantConfig {
  name: string;
  description: string;
  addOns: string[];
}

export const VARIANT_CONFIGS: Record<VariantType, VariantConfig> = {
  natural: {
    name: 'Natural Beauty',
    description: 'Minimal makeup with traditional ornaments',
    addOns: ['Maang tikka', 'Nose ring', 'Jhumka earrings', 'Gold necklace'],
  },
  bridal: {
    name: 'South Indian Bridal',
    description: 'Jasmine flowers and temple jewellery',
    addOns: ['Jasmine flowers', 'Temple jewellery', 'Enhanced ornaments'],
  },
  anime: {
    name: 'Cute Anime Sparkle',
    description: 'Hearts, stars, and glitter tears',
    addOns: ['Floating hearts', 'Twinkling stars', 'Glitter tears'],
  },
  festival: {
    name: 'Festival Look',
    description: 'Bindi, diya glow, and golden shimmer',
    addOns: ['Traditional bindi', 'Diya glow', 'Golden shimmer'],
  },
};
