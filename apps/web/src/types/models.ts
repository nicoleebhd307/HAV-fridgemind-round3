export type ShelfLevel = 'EAT_NOW' | 'USE_SOON' | 'SAFE';
export type Status = 'in_fridge' | 'consumed' | 'trashed';

export type ReceiptItem = {
  tempId: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  price: number | null;
  category: string;
  confidence: number;
  predictedExpiryDate: string;
  shelfLevel: ShelfLevel;
};

export type ReceiptParseResponse = {
  receiptId: string;
  purchaseDate: string;
  ocrMode: string;
  items: ReceiptItem[];
  warnings: string[];
};

export type ConfirmItem = {
  tempId: string;
  name: string;
  category?: string | null;
  quantity?: number | null;
  unit?: string | null;
  price?: number | null;
};

export type InventoryItem = {
  id: string;
  receiptId: string | null;
  name: string;
  category: string;
  quantity: number | null;
  unit: string | null;
  price: number | null;
  purchaseDate: string;
  predictedExpiryDate: string;
  shelfLevel: ShelfLevel;
  status: Status;
  createdAt: string;
  updatedAt: string;
};
