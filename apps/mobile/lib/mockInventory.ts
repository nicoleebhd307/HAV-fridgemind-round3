/**
 * Mock Inventory Data
 * Simulates stored food inventory
 */

import { InventoryItem, FoodItem } from '@/types/food';

// In-memory storage (would be replaced with actual storage in production)
let inventory: InventoryItem[] = [];

/**
 * Calculate days until expiry and urgency level
 */
const calculateExpiryInfo = (expiryDate: Date): { daysUntilExpiry: number; urgencyLevel: 'safe' | 'warning' | 'urgent' } => {
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let urgencyLevel: 'safe' | 'warning' | 'urgent';
  if (daysUntilExpiry < 0) {
    urgencyLevel = 'urgent'; // Expired
  } else if (daysUntilExpiry <= 2) {
    urgencyLevel = 'urgent'; // Expiring today or tomorrow
  } else if (daysUntilExpiry <= 5) {
    urgencyLevel = 'warning'; // Expiring soon
  } else {
    urgencyLevel = 'safe'; // Plenty of time
  }

  return { daysUntilExpiry, urgencyLevel };
};

/**
 * Add items to inventory
 */
export const addItemsToInventory = (items: FoodItem[]): void => {
  const inventoryItems: InventoryItem[] = items.map((item) => {
    const expiryInfo = calculateExpiryInfo(item.expiryDate);
    return {
      ...item,
      ...expiryInfo,
    };
  });

  inventory = [...inventory, ...inventoryItems];
};

/**
 * Get all inventory items
 */
export const getInventory = (): InventoryItem[] => {
  // Recalculate expiry info for all items
  return inventory.map((item) => {
    const expiryInfo = calculateExpiryInfo(item.expiryDate);
    return {
      ...item,
      ...expiryInfo,
    };
  });
};

/**
 * Remove item from inventory
 */
export const removeItem = (id: string): void => {
  inventory = inventory.filter((item) => item.id !== id);
};

/**
 * Clear all inventory (for testing)
 */
export const clearInventory = (): void => {
  inventory = [];
};

// ============================================
// HOME SCREEN DATA
// TODO: Replace mock data with BE API response
// ============================================

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ExpiryAlertItem {
  id: string;
  name: string;
  imageUrl: string;
  urgencyLevel: 'fresh' | 'urgent';
  daysUntilExpiry?: number;
  expiryLabel: string;
}

/**
 * Get food categories for home screen
 */
export const getFoodCategories = (): CategoryItem[] => {
  return [
    {
      id: 'cat_meat',
      name: 'Meat',
      icon: 'nutrition',
      color: '#02B786',
    },
    {
      id: 'cat_fish',
      name: 'Fish',
      icon: 'fish',
      color: '#02B786',
    },
    {
      id: 'cat_vegetables',
      name: 'Vegetables',
      icon: 'leaf',
      color: '#02B786',
    },
    {
      id: 'cat_beverages',
      name: 'Beverages',
      icon: 'cafe',
      color: '#02B786',
    },
  ];
};

/**
 * Get expiry alerts for home screen
 */
export const getExpiryAlerts = (): ExpiryAlertItem[] => {
  return [
    {
      id: 'alert_pasta',
      name: 'Pasta / Noodles',
      imageUrl: 'https://images.unsplash.com/photo-1551462147-37cbd66ba94d?w=400&h=300&fit=crop',
      urgencyLevel: 'urgent',
      daysUntilExpiry: 2,
      expiryLabel: 'Expires in 2 days',
    },
    {
      id: 'alert_pakchoi',
      name: 'Pak Choi',
      imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
      urgencyLevel: 'fresh',
      expiryLabel: 'Fresh',
    },
  ];
};

