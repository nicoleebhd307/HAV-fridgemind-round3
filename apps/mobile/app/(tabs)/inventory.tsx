/**
 * Inventory Screen
 * Virtual fridge showing all stored items with expiry tracking
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { ItemCard } from '@/components/ItemCard';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { getInventory } from '@/lib/mockInventory';
import { InventoryItem } from '@/types/food';

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadInventory = () => {
    const items = getInventory();
    // Sort by expiry date (urgent first)
    items.sort((a, b) => {
      if (a.urgencyLevel !== b.urgencyLevel) {
        const urgencyOrder = { urgent: 0, warning: 1, safe: 2 };
        return urgencyOrder[a.urgencyLevel] - urgencyOrder[b.urgencyLevel];
      }
      return a.daysUntilExpiry - b.daysUntilExpiry;
    });
    setInventory(items);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadInventory();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadInventory();
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const getUrgencyStats = () => {
    const urgent = inventory.filter(item => item.urgencyLevel === 'urgent').length;
    const warning = inventory.filter(item => item.urgencyLevel === 'warning').length;
    const safe = inventory.filter(item => item.urgencyLevel === 'safe').length;
    return { urgent, warning, safe };
  };

  const stats = getUrgencyStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Fridge</Text>
        {inventory.length > 0 && (
          <View style={styles.stats}>
            <View style={[styles.statBadge, { backgroundColor: Colors.expiryUrgent }]}>
              <Text style={styles.statText}>{stats.urgent} urgent</Text>
            </View>
            <View style={[styles.statBadge, { backgroundColor: Colors.expiryWarning }]}>
              <Text style={styles.statText}>{stats.warning} warning</Text>
            </View>
            <View style={[styles.statBadge, { backgroundColor: Colors.expirySafe }]}>
              <Text style={styles.statText}>{stats.safe} safe</Text>
            </View>
          </View>
        )}
      </View>

      {inventory.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Your fridge is empty</Text>
          <Text style={styles.emptySubtext}>
            Scan a receipt or your fridge to get started
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {inventory.map((item) => (
            <ItemCard key={item.id} item={item} showExpiry={true} />
          ))}
        </ScrollView>
      )}
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
    marginBottom: Spacing.md,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.radiusSm,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.screenPadding,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
