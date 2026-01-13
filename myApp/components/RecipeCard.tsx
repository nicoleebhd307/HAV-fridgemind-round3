/**
 * RecipeCard Component
 * Displays AI-generated recipe with rating and details
 */

import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

interface RecipeCardProps {
    name: string;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    cookTime: number;
    chef: string;
    onPress?: () => void;
    onFavorite?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
    name,
    imageUrl,
    rating,
    reviewCount,
    cookTime,
    chef,
    onPress,
    onFavorite,
}) => {
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
                {/* Rating Badge */}
                <View style={styles.topRow}>
                    <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={16} color="#FFA500" />
                        <Text style={styles.ratingText}>
                            {rating} ({reviewCount} Review)
                        </Text>
                    </View>
                    <TouchableOpacity onPress={onFavorite} style={styles.favoriteButton}>
                        <Ionicons name="heart-outline" size={24} color={Colors.textInverse} />
                    </TouchableOpacity>
                </View>

                {/* Recipe Details Overlay */}
                <View style={styles.detailsOverlay}>
                    <Text style={styles.recipeName}>{name}</Text>
                    <View style={styles.detailsRow}>
                        <Ionicons name="time-outline" size={12} color={Colors.text} />
                        <Text style={styles.detailsText}>
                            {cookTime} mins | {chef}
                        </Text>
                    </View>
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        overflow: 'hidden',
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
    },
    image: {
        borderRadius: 12,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 100,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    ratingText: {
        fontSize: Typography.fontSize.rating,
        fontFamily: Typography.fontFamily.regular,
        color: Colors.text,
        marginLeft: 4,
    },
    favoriteButton: {
        padding: 4,
    },
    detailsOverlay: {
        backgroundColor: Colors.cardOverlay,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    recipeName: {
        fontSize: Typography.fontSize.recipeName,
        fontFamily: Typography.fontFamily.bold,
        fontWeight: Typography.fontWeight.bold as any,
        color: Colors.text,
        marginBottom: 4,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailsText: {
        fontSize: Typography.fontSize.recipeDetails,
        fontFamily: Typography.fontFamily.regular,
        color: Colors.text,
        marginLeft: 4,
    },
});
