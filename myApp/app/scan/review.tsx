/**
 * Review Screen
 * Displays OCR results for user confirmation
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ItemCard } from '@/components/ItemCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { mockOcrResults } from '@/lib/mockOcr';
import { addItemsToInventory } from '@/lib/mockInventory';
import { FoodItem } from '@/types/food';

export default function ReviewScreen() {
  const router = useRouter();
  const [items, setItems] = useState(mockOcrResults.items);

  const handleConfirm = () => {
    // Convert OCR items to FoodItems
    const foodItems: FoodItem[] = items.map((item, index) => ({
      id: `item-${Date.now()}-${index}`,
      name: item.name,
      category: item.category,
      expiryDate: item.expiryDate || new Date(),
      detectedDate: new Date(),
      confidence: item.confidence,
      quantity: item.quantity || 1,
    }));

    // Save to inventory
    addItemsToInventory(foodItems);

    // Navigate to inventory
    router.push('/(tabs)/inventory');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Review Items</Text>
        <Text style={styles.subtitle}>
          {items.length} item{items.length !== 1 ? 's' : ''} detected
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item, index) => (
          <ItemCard 
            key={index} 
            item={item} 
            showExpiry={true}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Confirm & Save"
          onPress={handleConfirm}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.screenPadding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.screenPadding,
  },
  footer: {
    padding: Spacing.screenPadding,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
});
