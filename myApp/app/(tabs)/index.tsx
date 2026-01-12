/**
 * Home Screen
 * Main entry point with primary CTAs for scanning
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* App Title */}
        <View style={styles.header}>
          <Text style={styles.title}>FridgeMind</Text>
          <Text style={styles.subtitle}>Smart fridge management</Text>
        </View>

        {/* Primary Actions */}
        <View style={styles.actions}>
          <PrimaryButton
            title="Scan Receipt"
            onPress={() => router.push('/(tabs)/scan')}
            variant="primary"
          />
          
          <View style={styles.spacer} />
          
          <PrimaryButton
            title="Scan Fridge"
            onPress={() => router.push('/(tabs)/scan')}
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.screenPadding,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  actions: {
    width: '100%',
    maxWidth: 320,
  },
  spacer: {
    height: Spacing.md,
  },
});
