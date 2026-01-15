/**
 * Ambiguous Item Screen
 * Handles low-confidence OCR items with quick selection
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';

export default function AmbiguousScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ itemName?: string }>();

  const handleSelection = (selectedItem: string) => {
    // In a real app, this would update the OCR result
    // For now, we'll just navigate back with the selection
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.question}>What is this item?</Text>
          {params.itemName && (
            <Text style={styles.detectedName}>
              Detected: {params.itemName}
            </Text>
          )}
        </View>

        <View style={styles.options}>
          <PrimaryButton
            title="Carrot"
            onPress={() => handleSelection('Carrot')}
            variant="secondary"
          />
          
          <View style={styles.spacer} />
          
          <PrimaryButton
            title="Cucumber"
            onPress={() => handleSelection('Cucumber')}
            variant="secondary"
          />
          
          <View style={styles.spacer} />
          
          <PrimaryButton
            title="Other"
            onPress={() => handleSelection('Other')}
            variant="secondary"
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
    padding: Spacing.screenPadding,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  detectedName: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  options: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
  },
  spacer: {
    height: Spacing.md,
  },
});
