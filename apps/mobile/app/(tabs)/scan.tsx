/**
 * Scan Screen
 * Camera scanning interface with processing flow
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraFrame } from '@/components/CameraFrame';
import { PrimaryButton } from '@/components/PrimaryButton';
import { LoadingState } from '@/components/LoadingState';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { simulateOcrProcessing } from '@/lib/mockOcr';

export default function ScanScreen() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    setIsProcessing(true);
    
    // Simulate OCR processing
    await simulateOcrProcessing();
    
    // Navigate to review screen
    setIsProcessing(false);
    router.push('/scan/review');
  };

  if (isProcessing) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingState message="Analyzing your receipt..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Camera Placeholder */}
        <View style={styles.cameraContainer}>
          <View style={styles.cameraPlaceholder}>
            <CameraFrame />
            <Text style={styles.instructionText}>
              Point the camera at your receipt or fridge
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <PrimaryButton
            title="Process"
            onPress={handleProcess}
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
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundTertiary,
  },
  cameraPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
  },
  instructionText: {
    marginTop: Spacing.xl,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  actionContainer: {
    padding: Spacing.screenPadding,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
