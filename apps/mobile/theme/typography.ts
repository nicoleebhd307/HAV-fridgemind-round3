/**
 * FridgeMind Typography System
 * Inter font configuration with proper weights
 */

export const Typography = {
    fontFamily: {
        // Using variable font, weights are controlled via fontWeight property
        regular: 'Inter',
        medium: 'Inter',
        semibold: 'Inter',
        bold: 'Inter',
    },
    fontSize: {
        // Greeting section
        greeting: 32,
        userName: 32,

        // Section headers
        sectionTitle: 24,
        seeAll: 14,

        // Search
        searchPlaceholder: 16,

        // Recipe card
        recipeName: 14,
        recipeDetails: 11,
        rating: 14,

        // Badges
        badge: 14,
        aiBadge: 11,

        // Navigation
        navLabel: 10,

        // Common sizes
        body: 16,
        caption: 12,
    },
    fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },
};
