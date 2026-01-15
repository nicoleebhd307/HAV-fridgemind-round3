/**
 * Scan Routes Layout
 * Handles navigation for scan-related screens
 */

import { Stack } from 'expo-router';

export default function ScanLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="review" 
        options={{ 
          title: 'Review Items',
          presentation: 'card',
        }} 
      />
      <Stack.Screen 
        name="ambiguous" 
        options={{ 
          title: 'Identify Item',
          presentation: 'card',
        }} 
      />
    </Stack>
  );
}
