/**
 * Radial particle burst animation.
 * 12 particles fly outward from a central point on trigger and fade out.
 * Used to emphasize impactful line clears and power-up detonations.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

const PARTICLE_COUNT = 12;

interface RadialBurstProps {
  visible: boolean;
  color?: string;
  /** Maximum particle travel distance */
  radius?: number;
  onComplete?: () => void;
}

export const RadialBurst: React.FC<RadialBurstProps> = ({
  visible,
  color = '#FBBF24',
  radius = 90,
  onComplete,
}) => {
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      progress: new Animated.Value(0),
    })),
  ).current;

  useEffect(() => {
    if (!visible) return;
    particles.forEach((p) => p.progress.setValue(0));
    Animated.parallel(
      particles.map((p) =>
        Animated.timing(p.progress, {
          toValue: 1,
          duration: 520,
          useNativeDriver: true,
        }),
      ),
    ).start(() => {
      onComplete?.();
    });
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={styles.container}>
      {particles.map((p, i) => {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        const dx = Math.cos(angle) * radius;
        const dy = Math.sin(angle) * radius;
        const translateX = p.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, dx],
        });
        const translateY = p.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, dy],
        });
        const opacity = p.progress.interpolate({
          inputRange: [0, 0.2, 1],
          outputRange: [1, 1, 0],
        });
        const scale = p.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1.2, 0.9, 0.4],
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                backgroundColor: color,
                shadowColor: color,
                opacity,
                transform: [{ translateX }, { translateY }, { scale }],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 900,
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
});
