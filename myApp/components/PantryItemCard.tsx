/**
 * PantryItemCard Component
 * Card displaying pantry item with icon, name, days ago, quantity, and expired badge
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { InventoryItem } from '@/types/food';

interface PantryItemCardProps {
  item: InventoryItem;
  onPress?: () => void;
}

export const PantryItemCard: React.FC<PantryItemCardProps> = ({
  item,
  onPress,
}) => {
  // Calculate days ago from detectedDate
  const getDaysAgo = (): string => {
    if (!item.detectedDate) return 'Unknown';
    const now = new Date();
    const diffTime = now.getTime() - item.detectedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  // Format quantity with unit
  const formatQuantity = (): string => {
    if (!item.quantity) return '';
    
    // Determine unit based on category or item name
    const getUnit = (): string => {
      const name = item.name.toLowerCase();
      if (name.includes('oil') || name.includes('butter') || name.includes('milk')) {
        return 'oz';
      }
      // Default to 'pc' for countable items
      return 'pc';
    };
    
    return `${item.quantity}${getUnit()}`;
  };

  // Check if expired
  const isExpired = item.daysUntilExpiry < 0;
  const expiredDays = isExpired ? Math.abs(item.daysUntilExpiry) : 0;

  // Get image URL for item (using mock images)
  const getImageUrl = (): string => {
    const name = item.name.toLowerCase();
    const imageMap: Record<string, string> = {
      'tomatoes': 'https://images.unsplash.com/photo-1546470427-e26207bf7149?w=400&h=300&fit=crop',
      'fresh mozzarella': 'https://images.unsplash.com/photo-1618164436263-4f38d6c0b0b8?w=400&h=300&fit=crop',
      'mozzarella': 'https://images.unsplash.com/photo-1618164436263-4f38d6c0b0b8?w=400&h=300&fit=crop',
      'fresh basil': 'https://images.unsplash.com/photo-1618375569909-4c44f7ab9675?w=400&h=300&fit=crop',
      'basil': 'https://images.unsplash.com/photo-1618375569909-4c44f7ab9675?w=400&h=300&fit=crop',
      'olive oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop',
      'bananas': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
      'peanut butter': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=300&fit=crop',
      'carrot': 'https://images.unsplash.com/photo-1633380110125-f6e685676160?w=400&h=300&fit=crop',
      'carrots': 'https://images.unsplash.com/photo-1633380110125-f6e685676160?w=400&h=300&fit=crop',
      'pak choi': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
      'chicken breast': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',
      'chicken': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',
      'whole milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
      'milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
      'fresh spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
      'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop',
    };
    
    // Try exact match first
    if (imageMap[name]) {
      return imageMap[name];
    }
    
    // Try partial match
    for (const [key, url] of Object.entries(imageMap)) {
      if (name.includes(key) || key.includes(name)) {
        return url;
      }
    }
    
    // Default images by category
    const categoryDefaults: Record<string, string> = {
      vegetables: 'https://images.unsplash.com/photo-1546470427-e26207bf7149?w=400&h=300&fit=crop',
      fruits: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
      meat: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',
      dairy: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop',
      beverages: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
      snacks: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=300&fit=crop',
      other: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop',
    };
    
    return categoryDefaults[item.category] || categoryDefaults.other;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getImageUrl() }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          {isExpired && (
            <View style={styles.expiredBadge}>
              <Text style={styles.expiredText}>
                EXPIRED {expiredDays} {expiredDays === 1 ? 'DAY' : 'DAYS'} AGO
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.meta}>
          <Text style={styles.daysAgo}>{getDaysAgo()}</Text>
          {formatQuantity() && (
            <Text style={styles.quantity}>{formatQuantity()}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.backgroundTertiary,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.xs,
  },
  expiredBadge: {
    backgroundColor: Colors.expiryUrgent,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  expiredText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textInverse,
    textTransform: 'uppercase',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  daysAgo: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
});
