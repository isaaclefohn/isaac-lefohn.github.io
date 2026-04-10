/**
 * Combo chain visual escalation.
 * Shows escalating text and effects as combo chains grow longer.
 * "NICE!" -> "GREAT!" -> "AMAZING!" -> "INCREDIBLE!" -> "UNBELIEVABLE!"
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS, ANIM } from '../utils/constants';

const COMBO_TIERS = [
  { min: 2, label: 'NICE!', color: '#22C55E', fontSize: 22, shake: 2 },
  { min: 3, label: 'GREAT!', color: '#3B82F6', fontSize: 26, shake: 4 },
  { min: 4, label: 'AMAZING!', color: '#A855F7', fontSize: 30, shake: 6 },
  { min: 5, label: 'INCREDIBLE!', color: '#FACC15', fontSize: 34, shake: 8 },
  { min: 7, label: 'UNBELIEVABLE!', color: '#FF3B5C', fontSize: 38, shake: 10 },
] as const;

function getComboTier(combo: number) {
  for (let i = COMBO_TIERS.length - 1; i >= 0; i--) {
    if (combo >= COMBO_TIERS[i].min) return COMBO_TIERS[i];
  }
  return null;
}

interface ComboDisplayProps {
  combo: number;
  multiplier: number;
}

export const ComboDisplay: React.FC<ComboDisplayProps> = ({ combo, multiplier }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [displayCombo, setDisplayCombo] = useState(0);

  useEffect(() => {
    if (combo < 2) {
      opacityAnim.setValue(0);
      scaleAnim.setValue(0);
      return;
    }

    setDisplayCombo(combo);

    const tier = getComboTier(combo);
    const shakeIntensity = tier?.shake ?? 2;

    // Reset
    scaleAnim.setValue(0.3);
    opacityAnim.setValue(1);
    shakeAnim.setValue(0);

    // Pop in with overshoot
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 20,
        bounciness: 15,
        useNativeDriver: true,
      }),
      // Shake sequence
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: shakeIntensity,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -shakeIntensity,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: shakeIntensity * 0.5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Fade out after delay
    const timer = setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, 1200);

    return () => clearTimeout(timer);
  }, [combo]); // eslint-disable-line react-hooks/exhaustive-deps

  const tier = getComboTier(displayCombo);
  if (!tier) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [
            { scale: scaleAnim },
            { translateX: shakeAnim },
          ],
        },
      ]}
    >
      <Text style={[styles.label, { color: tier.color, fontSize: tier.fontSize }]}>
        {tier.label}
      </Text>
      <Text style={[styles.multiplier, { color: tier.color }]}>
        {multiplier.toFixed(1)}x combo
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  label: {
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  multiplier: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
