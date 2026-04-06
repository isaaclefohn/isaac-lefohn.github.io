/**
 * Colorblind accessibility pattern overlays for block cells.
 * Each color index gets a unique geometric pattern (stripes, dots, crosshatch, etc.)
 * so blocks are distinguishable without relying on color alone.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CELL_SIZE } from '../utils/constants';

interface ColorblindPatternProps {
  colorIndex: number; // 0-6
}

const PATTERN_COLOR = 'rgba(255,255,255,0.45)';

/** Horizontal stripes */
const HorizontalStripes = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {[0.15, 0.40, 0.65, 0.90].map((pos) => (
      <View
        key={pos}
        style={{
          position: 'absolute',
          top: CELL_SIZE * pos - 1,
          left: 3,
          right: 3,
          height: 2,
          backgroundColor: PATTERN_COLOR,
          borderRadius: 1,
        }}
      />
    ))}
  </View>
);

/** Single center dot */
const CenterDot = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View
      style={{
        position: 'absolute',
        top: CELL_SIZE * 0.35,
        left: CELL_SIZE * 0.35,
        width: CELL_SIZE * 0.3,
        height: CELL_SIZE * 0.3,
        borderRadius: CELL_SIZE * 0.15,
        backgroundColor: PATTERN_COLOR,
      }}
    />
  </View>
);

/** Diagonal stripe (top-left to bottom-right) */
const DiagonalStripe = () => (
  <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]} pointerEvents="none">
    {[-0.3, 0.0, 0.3, 0.6].map((offset) => (
      <View
        key={offset}
        style={{
          position: 'absolute',
          top: -CELL_SIZE * 0.2,
          left: CELL_SIZE * offset,
          width: 2.5,
          height: CELL_SIZE * 1.6,
          backgroundColor: PATTERN_COLOR,
          transform: [{ rotate: '45deg' }],
        }}
      />
    ))}
  </View>
);

/** Four corner dots */
const CornerDots = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {[
      { top: 6, left: 6 },
      { top: 6, right: 6 },
      { bottom: 6, left: 6 },
      { bottom: 6, right: 6 },
    ].map((pos, i) => (
      <View
        key={i}
        style={{
          position: 'absolute',
          ...pos,
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: PATTERN_COLOR,
        }}
      />
    ))}
  </View>
);

/** Crosshatch (X pattern) */
const Crosshatch = () => (
  <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]} pointerEvents="none">
    {[-0.3, 0.0, 0.3, 0.6].map((offset) => (
      <React.Fragment key={offset}>
        <View
          style={{
            position: 'absolute',
            top: -CELL_SIZE * 0.2,
            left: CELL_SIZE * offset,
            width: 2,
            height: CELL_SIZE * 1.6,
            backgroundColor: PATTERN_COLOR,
            transform: [{ rotate: '45deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: -CELL_SIZE * 0.2,
            left: CELL_SIZE * offset,
            width: 2,
            height: CELL_SIZE * 1.6,
            backgroundColor: PATTERN_COLOR,
            transform: [{ rotate: '-45deg' }],
          }}
        />
      </React.Fragment>
    ))}
  </View>
);

/** Diamond outline */
const Diamond = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View
      style={{
        position: 'absolute',
        top: CELL_SIZE * 0.22,
        left: CELL_SIZE * 0.22,
        width: CELL_SIZE * 0.4,
        height: CELL_SIZE * 0.4,
        borderWidth: 2.5,
        borderColor: PATTERN_COLOR,
        borderRadius: 2,
        transform: [{ rotate: '45deg' }],
      }}
    />
  </View>
);

/** Vertical stripes */
const VerticalStripes = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {[0.2, 0.45, 0.7].map((pos) => (
      <View
        key={pos}
        style={{
          position: 'absolute',
          left: CELL_SIZE * pos - 1,
          top: 3,
          bottom: 3,
          width: 2.5,
          backgroundColor: PATTERN_COLOR,
          borderRadius: 1,
        }}
      />
    ))}
  </View>
);

const PATTERNS = [
  HorizontalStripes, // Red (index 0)
  CenterDot,         // Teal (index 1)
  DiagonalStripe,    // Blue (index 2)
  CornerDots,        // Green (index 3)
  Crosshatch,        // Yellow (index 4)
  Diamond,           // Purple (index 5)
  VerticalStripes,   // Orange (index 6)
];

export const ColorblindPattern: React.FC<ColorblindPatternProps> = ({ colorIndex }) => {
  const Pattern = PATTERNS[colorIndex % PATTERNS.length];
  return <Pattern />;
};
