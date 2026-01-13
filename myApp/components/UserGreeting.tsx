/**
 * UserGreeting Component
 * Personalized greeting for home screen
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { getCurrentUser } from '@/lib/mockUser';

export const UserGreeting: React.FC = () => {
    // TODO: Replace with authenticated user name from BE
    const user = getCurrentUser();

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>
                Hi! <Text style={styles.userName}>{user.name}</Text> 👋
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
    },
    greeting: {
        fontSize: Typography.fontSize.greeting,
        fontFamily: Typography.fontFamily.bold,
        fontWeight: Typography.fontWeight.bold as any,
        color: Colors.text,
    },
    userName: {
        color: Colors.primaryGreen,
        fontWeight: Typography.fontWeight.bold as any,
    },
});
