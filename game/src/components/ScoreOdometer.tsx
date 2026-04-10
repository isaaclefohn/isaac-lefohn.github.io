/**
 * Score odometer that rolls digits upward like a slot machine.
 * Each digit animates independently for a satisfying "tick" effect.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS } from '../utils/constants';

interface ScoreOdometerProps {
  value: number;
  fontSize?: number;
  color?: string;
  /** Number of digits to display (zero-padded) */
  digits?: number;
}

const DIGIT_HEIGHT_RATIO = 1.2;

const SingleDigit: React.FC<{
  digit: number;
  fontSize: number;
  color: string;
  index: number;
}> = ({ digit, fontSize, color, index }) => {
  const translateY = useRef(new Animated.Value(-digit * fontSize * DIGIT_HEIGHT_RATIO)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: -digit * fontSize * DIGIT_HEIGHT_RATIO,
      duration: 300 + index * 30, // Stagger: rightmost digits move faster
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [digit]); // eslint-disable-line react-hooks/exhaustive-deps

  const digitHeight = fontSize * DIGIT_HEIGHT_RATIO;

  return (
    <View style={[styles.digitContainer, { height: digitHeight, width: fontSize * 0.65 }]}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <Text
            key={d}
            style={[
              styles.digitText,
              { fontSize, color, lineHeight: digitHeight, height: digitHeight },
            ]}
          >
            {d}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
};

export const ScoreOdometer: React.FC<ScoreOdometerProps> = ({
  value,
  fontSize = 28,
  color = COLORS.textPrimary,
  digits = 0,
}) => {
  const valueStr = digits > 0
    ? String(value).padStart(digits, '0')
    : String(value);

  return (
    <View style={styles.container}>
      {valueStr.split('').map((char, i) => (
        <SingleDigit
          key={`${valueStr.length}-${i}`}
          digit={parseInt(char, 10)}
          fontSize={fontSize}
          color={color}
          index={valueStr.length - 1 - i}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  digitContainer: {
    overflow: 'hidden',
  },
  digitText: {
    fontWeight: '900',
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
});
