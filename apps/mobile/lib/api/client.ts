/**
 * API Client for Mobile App
 * Handles all backend API calls
 */

import { API_BASE } from './config';

// Types matching backend schemas
export interface ReceiptParseResponse {
  receiptId: string;
  purchaseDate: string;
  ocrMode: string;
  items: ReceiptItemOut[];
  warnings: string[];
}

export interface ReceiptItemOut {
  tempId: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  price: number | null;
  category: string;
  confidence: number;
  predictedExpiryDate: string;
  shelfLevel: 'EAT_NOW' | 'USE_SOON' | 'SAFE';
}

export interface ConfirmItem {
  tempId: string;
  name: string;
  category: string | null;
  quantity: number | null;
  unit: string | null;
  price: number | null;
}

export interface InventoryItem {
  id: string;
  receiptId: string | null;
  name: string;
  category: string;
  quantity: number | null;
  unit: string | null;
  price: number | null;
  purchaseDate: string;
  predictedExpiryDate: string;
  shelfLevel: 'EAT_NOW' | 'USE_SOON' | 'SAFE';
  status: 'in_fridge' | 'consumed' | 'trashed';
  createdAt: string;
  updatedAt: string;
}

type Status = 'in_fridge' | 'consumed' | 'trashed';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Upload receipt image and get OCR results
 */
export async function uploadReceipt(imageUri: string): Promise<ReceiptParseResponse> {
  // Convert image URI to FormData for React Native
  const formData = new FormData();
  
  // @ts-ignore - React Native FormData format
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'receipt.jpg',
  } as any);

  const res = await fetch(`${API_BASE}/receipts`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return handleResponse<ReceiptParseResponse>(res);
}

/**
 * Confirm receipt and add items to inventory
 */
export async function confirmReceipt(
  receiptId: string,
  purchaseDate: string,
  items: ConfirmItem[]
): Promise<InventoryItem[]> {
  const res = await fetch(`${API_BASE}/receipts/${receiptId}/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      purchaseDate,
      items: items.map((item) => ({
        tempId: item.tempId,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
      })),
    }),
  });

  return handleResponse<InventoryItem[]>(res);
}

/**
 * Get all inventory items
 */
export async function getInventory(): Promise<InventoryItem[]> {
  const res = await fetch(`${API_BASE}/inventory`);
  return handleResponse<InventoryItem[]>(res);
}

/**
 * Update inventory item status
 */
export async function updateInventoryStatus(
  itemId: string,
  status: Status
): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE}/inventory/${itemId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  return handleResponse<InventoryItem>(res);
}

/**
 * Reset demo data
 */
export async function resetDemo(): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/demo/reset`, {
    method: 'POST',
  });

  return handleResponse<{ ok: boolean }>(res);
}
