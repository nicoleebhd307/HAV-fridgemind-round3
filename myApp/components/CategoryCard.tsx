/**
 * CategoryCard Component
 * Food category button with icon and green gradient background
 */

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/theme/colors';

interface CategoryCardProps {
    icon: string;
    onPress?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ icon, onPress }) => {
    const getIconName = (iconKey: string): any => {
        const iconMap: Record<string, any> = {
            nutrition: 'nutrition',
            fish: 'fish',
            leaf: 'leaf',
            cafe: 'cafe',
        };
        return iconMap[iconKey] || 'help-circle';
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.touchable}
        >
            <LinearGradient
                colors={['#02B786', '#44D65A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                {/* Inner white glossy shadow */}
                <LinearGradient
                    colors={[
                        'rgba(255,255,255,0.45)',
                        'rgba(255,255,255,0.15)',
                        'rgba(255,255,255,0)',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.innerHighlight}
                    pointerEvents="none"
                />

                <Ionicons
                    name={getIconName(icon)}
                    size={40}
                    color={Colors.backgroundSecondary}
                />
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchable: {
        borderRadius: 12,
        marginRight: 12,
    },
    card: {
        width: 80,
        height: 80,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // 🔥 BẮT BUỘC cho inner shadow
    },
    innerHighlight: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '80%',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
});
