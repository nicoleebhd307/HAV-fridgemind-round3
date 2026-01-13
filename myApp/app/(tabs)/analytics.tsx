/**
 * Analytics Screen
 * Statistics and insights about fridge usage and food waste
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Food Waste Stats</Text>
          <Text style={styles.cardText}>Coming soon...</Text>
        </View>
      </ScrollView>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.screenPadding,
  },
  card: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  cardText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
