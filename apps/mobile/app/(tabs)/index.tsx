/**
 * Home Screen
 * Main entry point with personalized greeting, search, categories, expiry alerts, and AI recipes
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserGreeting } from '@/components/UserGreeting';
import { SearchBar } from '@/components/SearchBar';
import { SectionHeader } from '@/components/SectionHeader';
import { CategoryCard } from '@/components/CategoryCard';
import { ExpiryAlertCard } from '@/components/ExpiryAlertCard';
import { RecipeCard } from '@/components/RecipeCard';
import { AIBadge } from '@/components/AIBadge';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

// TODO: Replace mock data with BE API response
import { getFoodCategories, getExpiryAlerts } from '@/lib/mockInventory';
import { getAIRecipes } from '@/lib/mockOcr';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: Replace mock data with BE API response
  const categories = getFoodCategories();
  const expiryAlerts = getExpiryAlerts();
  const recipes = getAIRecipes();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Section */}
        <View style={styles.section}>
          <UserGreeting />
        </View>

        {/* Search Bar */}
        <View style={styles.section}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Categories"
            onSeeAllPress={() => console.log('See all categories')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                icon={category.icon}
                onPress={() => console.log('Category:', category.name)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Expiry Alerts Section */}
        <View style={styles.section}>
          <SectionHeader
            title="#Expiry Alerts"
            onSeeAllPress={() => console.log('See all alerts')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {expiryAlerts.map((alert) => (
              <ExpiryAlertCard
                key={alert.id}
                name={alert.name}
                imageUrl={alert.imageUrl}
                urgencyLevel={alert.urgencyLevel}
                expiryLabel={alert.expiryLabel}
                onPress={() => console.log('Alert:', alert.name)}
              />
            ))}
          </ScrollView>

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            <View style={[styles.paginationDot, styles.paginationDotActive]} />
            <View style={styles.paginationDot} />
          </View>
        </View>

        {/* AI Recipes Section */}
        <View style={styles.section}>
          <View style={styles.recipesHeader}>
            <Text style={styles.recipesTitle}>
              <Text style={styles.recipesTitleGreen}>Recipes</Text>
              {' '}
              <Text style={styles.recipesTitleBlack}>from Your Fridge</Text>
            </Text>
            <AIBadge />
          </View>

          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              name={recipe.name}
              imageUrl={recipe.imageUrl}
              rating={recipe.rating}
              reviewCount={recipe.reviewCount}
              cookTime={recipe.cookTime}
              chef={recipe.chef}
              onPress={() => console.log('Recipe:', recipe.name)}
              onFavorite={() => console.log('Favorite:', recipe.name)}
            />
          ))}
        </View>

        {/* Bottom spacing for navigation */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.lg,
  },
  horizontalScroll: {
    paddingRight: Spacing.screenPadding,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.paginationDot,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: Colors.primaryGreen,
  },
  recipesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  recipesTitle: {
    fontSize: Typography.fontSize.sectionTitle,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold as any,
    marginRight: 8,
  },
  recipesTitleGreen: {
    color: Colors.linkGreen,
  },
  recipesTitleBlack: {
    color: Colors.text,
  },
  bottomSpacer: {
    height: 100, // Space for bottom navigation
  },
});
