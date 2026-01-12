/**
 * ItemCard Component
 * Displays a food item with name, category, and expiry information
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { OcrItem, InventoryItem } from '@/types/food';

interface ItemCardProps {
  item: OcrItem | InventoryItem;
  showExpiry?: boolean;
  onPress?: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  showExpiry = true,
  onPress 
}) => {
  const formatDate = (date?: Date): string => {
    if (!date) return 'Unknown';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string): string => {
    const categoryMap: Record<string, string> = {
      fruits: Colors.categoryFruits,
      vegetables: Colors.categoryVegetables,
      dairy: Colors.categoryDairy,
      meat: Colors.categoryMeat,
      beverages: Colors.categoryBeverages,
      other: Colors.categoryOther,
    };
    return categoryMap[category] || Colors.categoryOther;
  };

  const getExpiryText = (): string => {
    if ('daysUntilExpiry' in item) {
      const inventoryItem = item as InventoryItem;
      if (inventoryItem.daysUntilExpiry < 0) {
        return `Expired ${Math.abs(inventoryItem.daysUntilExpiry)} days ago`;
      } else if (inventoryItem.daysUntilExpiry === 0) {
        return 'Expires today';
      } else if (inventoryItem.daysUntilExpiry === 1) {
        return 'Expires tomorrow';
      } else {
        return `Expires in ${inventoryItem.daysUntilExpiry} days`;
      }
    }
    return item.expiryDate ? `Expires: ${formatDate(item.expiryDate)}` : 'No expiry date';
  };

  const getExpiryColor = (): string => {
    if ('urgencyLevel' in item) {
      const inventoryItem = item as InventoryItem;
      switch (inventoryItem.urgencyLevel) {
        case 'safe':
          return Colors.expirySafe;
        case 'warning':
          return Colors.expiryWarning;
        case 'urgent':
          return Colors.expiryUrgent;
        default:
          return Colors.textSecondary;
      }
    }
    return Colors.textSecondary;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(item.category) }]} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          {item.quantity && item.quantity > 1 && (
            <Text style={styles.quantity}>×{item.quantity}</Text>
          )}
        </View>
        
        <View style={styles.meta}>
          <Text style={styles.category}>{item.category}</Text>
          {showExpiry && (
            <Text style={[styles.expiry, { color: getExpiryColor() }]}>
              {getExpiryText()}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Spacing.radiusMd,
    marginBottom: Spacing.itemGap,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryIndicator: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.cardPadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  expiry: {
    fontSize: 14,
    fontWeight: '500',
  },
});
