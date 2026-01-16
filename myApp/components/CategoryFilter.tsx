/**
 * CategoryFilter Component
 * Filter buttons for pantry categories
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { FoodCategory } from '@/types/food';

export interface CategoryFilterOption {
  id: string;
  label: string;
  category?: FoodCategory;
  icon?: string;
}

interface CategoryFilterProps {
  options: CategoryFilterOption[];
  selectedCategory?: FoodCategory | 'all';
  onSelect: (category: FoodCategory | 'all') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  options,
  selectedCategory = 'all',
  onSelect,
}) => {
  const getIconName = (iconKey?: string): any => {
    if (!iconKey) return 'help-circle';
    const iconMap: Record<string, any> = {
      nutrition: 'nutrition',
      fish: 'fish',
      leaf: 'leaf',
      cafe: 'cafe',
      meat: 'basket',
      vegetables: 'leaf',
      beverages: 'cafe',
      
    };
    return iconMap[iconKey] || 'help-circle';
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((option) => {
          const isSelected = 
            option.id === 'all' 
              ? selectedCategory === 'all'
              : selectedCategory === option.category;
          
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterButton,
                isSelected && styles.filterButtonActive,
              ]}
              onPress={() => onSelect(option.id === 'all' ? 'all' : option.category!)}
              activeOpacity={0.7}
            >
              {option.icon && (
                <Ionicons
                  name={getIconName(option.icon)}
                  size={16}
                  color={isSelected ? Colors.textInverse : Colors.text}
                  style={styles.icon}
                />
              )}
              <Text
                style={[
                  styles.filterText,
                  isSelected && styles.filterTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
    gap: Spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  icon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    textTransform: 'uppercase',
  },
  filterTextActive: {
    color: Colors.textInverse,
  },
});
