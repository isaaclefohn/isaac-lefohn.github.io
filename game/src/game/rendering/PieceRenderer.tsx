/**
 * Premium piece renderer with 3D block style matching the board.
 * Uses standard React Native Views (Expo Go compatible).
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Piece, getPieceSize } from '../engine/Piece';
import { ColorblindPattern } from '../../components/ColorblindPattern';
import { useSettingsStore } from '../../store/settingsStore';
import { usePlayerStore } from '../../store/playerStore';
import { getTheme } from './ThemeManager';
import { COLORS, CELL_RADIUS } from '../../utils/constants';

interface PieceRendererProps {
  piece: Piece | null;
  cellSize?: number;
  gap?: number;
  selected?: boolean;
  disabled?: boolean;
}

const TRAY_CELL_SIZE = 28;
const TRAY_GAP = 3;

export const PieceRenderer: React.FC<PieceRendererProps> = ({
  piece,
  cellSize = TRAY_CELL_SIZE,
  gap = TRAY_GAP,
  selected = false,
  disabled = false,
}) => {
  const { colorblindMode, graphicsQuality } = useSettingsStore();
  const isLowQuality = graphicsQuality === 'low';
  const { equippedTheme } = usePlayerStore();
  const theme = getTheme(equippedTheme);
  const BLOCK_COLORS = theme.blockColors;
  const BLOCK_LIGHT = theme.blockColorsLight;
  const BLOCK_DARK = theme.blockColorsDark;

  if (!piece) {
    return null;
  }

  const { width, height } = getPieceSize(piece);
  const totalWidth = width * (cellSize + gap) + gap;
  const totalHeight = height * (cellSize + gap) + gap;
  const colorIdx = piece.colorIndex - 1;
  const baseColor = BLOCK_COLORS[colorIdx] || BLOCK_COLORS[0];
  const lightColor = BLOCK_LIGHT[colorIdx] || BLOCK_LIGHT[0];
  const darkColor = BLOCK_DARK[colorIdx] || BLOCK_DARK[0];
  const radius = CELL_RADIUS * (cellSize / 40);

  return (
    <View
      style={{
        width: totalWidth,
        height: totalHeight,
        opacity: disabled ? 0.3 : selected ? 1 : 0.8,
        transform: [{ scale: selected ? 1.05 : 1 }],
      }}
    >
      {piece.shape.map((row, r) =>
        row.map((cell, c) => {
          if (!cell) return null;
          const x = gap + c * (cellSize + gap);
          const y = gap + r * (cellSize + gap);
          return (
            <View
              key={`${r}-${c}`}
              style={[
                styles.cell,
                {
                  left: x,
                  top: y,
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: baseColor,
                  borderRadius: radius,
                  borderTopColor: lightColor,
                  borderLeftColor: lightColor,
                  borderBottomColor: darkColor,
                  borderRightColor: darkColor,
                  borderTopWidth: isLowQuality ? 1 : 1.5,
                  borderLeftWidth: isLowQuality ? 1 : 1.5,
                  borderBottomWidth: isLowQuality ? 1 : 1.5,
                  borderRightWidth: isLowQuality ? 1 : 1.5,
                },
                !isLowQuality && {
                  shadowColor: baseColor,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: selected ? 0.6 : 0.3,
                  shadowRadius: selected ? 4 : 2,
                },
              ]}
            >
              {!isLowQuality && (
                <View
                  style={[
                    styles.highlight,
                    {
                      height: cellSize * 0.35,
                      borderTopLeftRadius: Math.max(1, radius - 2),
                      borderTopRightRadius: Math.max(1, radius - 2),
                      borderBottomLeftRadius: cellSize * 0.4,
                      borderBottomRightRadius: cellSize * 0.4,
                      backgroundColor: `${lightColor}35`,
                    },
                  ]}
                />
              )}
              {colorblindMode && <ColorblindPattern colorIndex={colorIdx} />}
            </View>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    position: 'absolute',
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 1,
    left: 1.5,
    right: 1.5,
  },
});
