/**
 * ExpiryAlertCard Component
 * Shows food items with expiry warnings or fresh status
 */

import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

interface ExpiryAlertCardProps {
    name: string;
    imageUrl: string;
    urgencyLevel: 'fresh' | 'urgent';
    expiryLabel: string;
    onPress?: () => void;
}

export const ExpiryAlertCard: React.FC<ExpiryAlertCardProps> = ({
    name,
    imageUrl,
    urgencyLevel,
    expiryLabel,
    onPress,
}) => {
    const badgeColor = urgencyLevel === 'urgent' ? Colors.urgentRed : Colors.freshGreen;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <ImageBackground
                source={{ uri: imageUrl }}
                style={styles.imageBackground}
                imageStyle={styles.image}
            >
                <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                    <Text style={styles.badgeText}>{expiryLabel}</Text>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 200,
        height: 150,
        marginRight: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
    },
    image: {
        borderRadius: 12,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderTopLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    badgeText: {
        color: Colors.textInverse,
        fontSize: Typography.fontSize.badge,
        fontFamily: Typography.fontFamily.bold,
        fontWeight: Typography.fontWeight.bold as any,
    },
});

