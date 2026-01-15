/**
 * Food Item Type Definitions
 */

export type FoodCategory = 
  | 'fruits'
  | 'vegetables'
  | 'dairy'
  | 'meat'
  | 'beverages'
  | 'snacks'
  | 'other';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  expiryDate: Date;
  detectedDate?: Date; // When the item was detected via OCR
  confidence?: number; // OCR confidence score (0-1)
  quantity?: number;
  notes?: string;
}

export interface OcrResult {
  items: OcrItem[];
  receiptDate?: Date;
  confidence: number;
}

export interface OcrItem {
  name: string;
  category: FoodCategory;
  expiryDate?: Date;
  confidence: number;
  quantity?: number;
  ambiguous?: boolean; // True if OCR confidence is low
}

export interface InventoryItem extends FoodItem {
  daysUntilExpiry: number;
  urgencyLevel: 'safe' | 'warning' | 'urgent';
}
