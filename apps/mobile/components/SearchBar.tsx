/**
 * SearchBar Component
 * Search input with icon for home screen
 */

import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

interface SearchBarProps {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = 'Search here',
    value,
    onChangeText,
}) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={Colors.searchPlaceholder}
                value={value}
                onChangeText={onChangeText}
            />
            <Ionicons name="search" size={24} color={Colors.searchPlaceholder} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: Colors.searchBorder,
        paddingHorizontal: 16,
        paddingVertical: 12,
        shadowColor: '#0000001C',
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 3,
            height: 4,
        },
        shadowRadius: 2,
        elevation: 2,
    },
    input: {
        flex: 1,
        fontSize: Typography.fontSize.searchPlaceholder,
        fontFamily: Typography.fontFamily.regular,
        color: Colors.text,
        marginRight: 8,
    },
});
