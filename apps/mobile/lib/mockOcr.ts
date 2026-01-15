/**
 * Mock OCR Data
 * Simulates OCR results from receipt/fridge scanning
 */

import { OcrResult, OcrItem } from '@/types/food';

export const mockOcrResults: OcrResult = {
  items: [
    {
      name: 'Organic Carrots',
      category: 'vegetables',
      expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      confidence: 0.92,
      quantity: 1,
      ambiguous: false,
    },
    {
      name: 'Whole Milk',
      category: 'dairy',
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      confidence: 0.88,
      quantity: 1,
      ambiguous: false,
    },
    {
      name: 'Fresh Spinach',
      category: 'vegetables',
      expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      confidence: 0.75,
      quantity: 1,
      ambiguous: false,
    },
    {
      name: 'Chicken Breast',
      category: 'meat',
      expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      confidence: 0.85,
      quantity: 2,
      ambiguous: false,
    },
    {
      name: 'Unknown Item',
      category: 'other',
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      confidence: 0.45, // Low confidence - would trigger ambiguous flow
      quantity: 1,
      ambiguous: true,
    },
  ],
  receiptDate: new Date(),
  confidence: 0.82,
};

/**
 * Simulates OCR processing delay
 */
export const simulateOcrProcessing = (): Promise<OcrResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOcrResults);
    }, 2500); // 2.5 second delay
  });
};

// ============================================
// AI RECIPES DATA
// TODO: Replace mock data with BE API response
// ============================================

export interface Recipe {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  cookTime: number;
  chef: string;
  imageUrl: string;
  isAIGenerated: boolean;
}

/**
 * Get AI-generated recipes based on fridge inventory
 */
export const getAIRecipes = (): Recipe[] => {
  return [
    {
      id: 'recipe_001',
      name: 'Sandwich',
      rating: 4.8,
      reviewCount: 500,
      cookTime: 15,
      chef: 'Chef Hoang Dieu',
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
      isAIGenerated: true,
    },
  ];
};

