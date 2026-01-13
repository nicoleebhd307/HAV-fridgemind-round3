/**
 * AIBadge Component
 * Gradient badge indicating AI-generated content
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';

export const AIBadge: React.FC = () => {
    return (
        <LinearGradient
            colors={[Colors.aiGradientStart, Colors.aiGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.badge}
        >
            <Ionicons name="sparkles" size={12} color={Colors.aiPurple} />
            <Text style={styles.text}>AI</Text>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 100,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    text: {
        fontSize: Typography.fontSize.aiBadge,
        fontFamily: Typography.fontFamily.medium,
        fontWeight: Typography.fontWeight.medium as any,
        color: Colors.aiPurple,
        marginLeft: 4,
    },
});
