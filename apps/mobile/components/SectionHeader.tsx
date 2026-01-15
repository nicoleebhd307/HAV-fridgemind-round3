/**
 * SectionHeader Component
 * Reusable section header with title and optional "See All" link
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

interface SectionHeaderProps {
    title: string;
    showSeeAll?: boolean;
    onSeeAllPress?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    showSeeAll = true,
    onSeeAllPress,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {showSeeAll && (
                <TouchableOpacity onPress={onSeeAllPress} activeOpacity={0.7}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: Typography.fontSize.sectionTitle,
        fontFamily: Typography.fontFamily.bold,
        fontWeight: Typography.fontWeight.bold as any,
        color: Colors.text,
    },
    seeAll: {
        fontSize: Typography.fontSize.seeAll,
        fontFamily: Typography.fontFamily.regular,
        color: Colors.linkGreen,
    },
});
