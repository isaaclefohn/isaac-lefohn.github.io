/**
 * Premium home screen with animated title, rich stats, and polished layout.
 * All buttons visible, labeled with icons, sensibly aligned.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, Easing, Dimensions } from 'react-native';
import { usePlayerStore } from '../store/playerStore';
import { useSettingsStore } from '../store/settingsStore';
import { Button } from '../components/common/Button';
import { Tutorial } from '../components/Tutorial';
import { COLORS, SHADOWS, RADII, SPACING } from '../utils/constants';
import { formatCompact } from '../utils/formatters';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { highestLevel, coins, gems, totalScore, currentStreak } = usePlayerStore();
  const { tutorialCompleted, completeTutorial } = useSettingsStore();
  const [showTutorial, setShowTutorial] = useState(!tutorialCompleted);

  // Entrance animations
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(-30)).current;
  const blastScale = useRef(new Animated.Value(0.5)).current;
  const statsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsTranslate = useRef(new Animated.Value(40)).current;
  const blastGlow = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(titleTranslate, { toValue: 0, useNativeDriver: true, tension: 60, friction: 8 }),
      ]),
      Animated.spring(blastScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
      Animated.timing(statsOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(buttonsOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(buttonsTranslate, { toValue: 0, useNativeDriver: true, tension: 50, friction: 9 }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blastGlow, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(blastGlow, { toValue: 0.6, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleTutorialComplete = useCallback(() => {
    setShowTutorial(false);
    completeTutorial();
  }, [completeTutorial]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated Title */}
        <View style={styles.titleContainer}>
          <Animated.Text
            style={[
              styles.title,
              { opacity: titleOpacity, transform: [{ translateY: titleTranslate }] },
            ]}
          >
            COLOR BLOCK
          </Animated.Text>
          <Animated.Text
            style={[
              styles.titleAccent,
              { transform: [{ scale: blastScale }], opacity: blastGlow },
            ]}
          >
            BLAST
          </Animated.Text>
        </View>

        {/* Stats bar */}
        <Animated.View style={[styles.statsBar, { opacity: statsOpacity }]}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🪙</Text>
            <Text style={styles.statValue}>{formatCompact(coins)}</Text>
            <Text style={styles.statLabel}>COINS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💎</Text>
            <Text style={styles.statValue}>{formatCompact(gems)}</Text>
            <Text style={styles.statLabel}>GEMS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>{formatCompact(totalScore)}</Text>
            <Text style={styles.statLabel}>SCORE</Text>
          </View>
          {currentStreak > 0 && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>🔥</Text>
                <Text style={styles.statValue}>{currentStreak}</Text>
                <Text style={styles.statLabel}>STREAK</Text>
              </View>
            </>
          )}
        </Animated.View>

        {/* Main buttons */}
        <Animated.View
          style={[
            styles.buttonGroup,
            { opacity: buttonsOpacity, transform: [{ translateY: buttonsTranslate }] },
          ]}
        >
          {/* Primary play button - full width, large */}
          <Button
            title={highestLevel > 0 ? `Continue  \u2022  Level ${highestLevel + 1}` : 'Play'}
            icon="▶"
            onPress={() => navigation.navigate('Game', { level: highestLevel > 0 ? highestLevel + 1 : 1 })}
            variant="primary"
            size="large"
            style={styles.mainButton}
          />

          {/* Secondary row - Daily Challenge + Level Select */}
          <View style={styles.secondaryRow}>
            <Button
              title="Daily Challenge"
              icon="📅"
              onPress={() => navigation.navigate('DailyChallenge')}
              variant="secondary"
              size="medium"
              style={styles.halfButton}
            />
            <Button
              title="Select Level"
              icon="🗺"
              onPress={() => navigation.navigate('LevelSelect')}
              variant="secondary"
              size="medium"
              style={styles.halfButton}
            />
          </View>

          {/* Bottom row - Shop, Leaderboard, Settings - evenly spaced */}
          <View style={styles.bottomRow}>
            <View style={styles.bottomButtonWrapper}>
              <Button
                title="Shop"
                icon="🛒"
                onPress={() => navigation.navigate('Shop')}
                variant="ghost"
                size="small"
                style={styles.bottomButton}
              />
            </View>
            <View style={styles.bottomButtonWrapper}>
              <Button
                title="Rankings"
                icon="🏆"
                onPress={() => navigation.navigate('Leaderboard')}
                variant="ghost"
                size="small"
                style={styles.bottomButton}
              />
            </View>
            <View style={styles.bottomButtonWrapper}>
              <Button
                title="Settings"
                icon="⚙️"
                onPress={() => navigation.navigate('Settings')}
                variant="ghost"
                size="small"
                style={styles.bottomButton}
              />
            </View>
          </View>
        </Animated.View>

        {/* Level indicator */}
        {highestLevel > 0 && (
          <Animated.Text style={[styles.levelIndicator, { opacity: buttonsOpacity }]}>
            Highest Level: {highestLevel}
          </Animated.Text>
        )}
      </View>

      {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: SCREEN_WIDTH < 375 ? 38 : 48,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 6,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleAccent: {
    fontSize: SCREEN_WIDTH < 375 ? 46 : 56,
    fontWeight: '900',
    color: COLORS.accent,
    letterSpacing: 10,
    marginTop: -6,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: SPACING.xl,
    alignItems: 'center',
    width: '100%',
    ...SHADOWS.small,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.accentGold,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.surfaceBorder,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  mainButton: {
    width: '100%',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
  },
  halfButton: {
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: SPACING.xs,
    gap: SPACING.sm,
  },
  bottomButtonWrapper: {
    flex: 1,
  },
  bottomButton: {
    width: '100%',
  },
  levelIndicator: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.lg,
    letterSpacing: 1,
  },
});
