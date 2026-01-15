import { Tabs } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/theme/colors';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

// Custom button for the camera tab (orange gradient circular button in center)
function CameraTabButton(props: BottomTabBarButtonProps) {
  const { onPress, accessibilityState } = props;
  const isFocused = accessibilityState?.selected;

  return (
    <View style={styles.cameraButtonContainer}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={styles.cameraButtonTouchable}
      >
        <LinearGradient
          colors={['#FF7C61', '#FF4921']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.cameraButton, isFocused && styles.cameraButtonFocused]}
        >
          <IconSymbol size={40} name="camera.fill" color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primaryGreen,
        tabBarInactiveTintColor: '#9BA1A6',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          paddingTop: 12,
          paddingBottom: Platform.OS === 'ios' ? 28 : 16,
          paddingHorizontal: 0,
          height: Platform.OS === 'ios' ? 88 : 80,
          position: 'absolute',
          ...Platform.select({
            ios: {
              shadowColor: '#0000006E',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
            },
            android: {
              elevation: 16,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name="house.fill" 
              color={focused ? Colors.primaryGreen : '#9BA1A6'} 
            />
          ),
          tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name="chart.bar.fill" 
              color={focused ? Colors.primaryGreen : '#9BA1A6'} 
            />
          ),
          tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: '',
          tabBarIcon: () => null,
          tabBarButton: CameraTabButton,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Fridge',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name="refrigerator.fill" 
              color={focused ? Colors.primaryGreen : '#9BA1A6'} 
            />
          ),
          tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name="person.fill" 
              color={focused ? Colors.primaryGreen : '#9BA1A6'} 
            />
          ),
          tabBarButton: HapticTab,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  cameraButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    top: -20, // Position above the tab bar
  },
  cameraButtonTouchable: {
    borderRadius: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cameraButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButtonFocused: {
    opacity: 0.9, // Slightly darker when focused
  },
});
