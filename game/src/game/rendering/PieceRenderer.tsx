/**
 * Renders a single piece in the piece tray.
 * Uses standard React Native Views (Expo Go compatible).
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Piece, getPieceSize } from '../engine/Piece';
import { COLORS, CELL_RADIUS } from '../../utils/constants';

interface PieceRendererProps {
  piece: Piece | null;
  cellSize?: number;
  gap?: number;
  selected?: boolean;
  disabled?: boolean;
}

const BLOCK_COLORS = COLORS.blocks;
const TRAY_CELL_SIZE = 28;
const TRAY_GAP = 2;

export const PieceRenderer: React.FC<PieceRendererProps> = ({
  piece,
  cellSize = TRAY_CELL_SIZE,
  gap = TRAY_GAP,
  selected = false,
  disabled = false,
}) => {
  if (!piece) {
    return null;
  }

  const { width, height } = getPieceSize(piece);
  const totalWidth = width * (cellSize + gap) + gap;
  const totalHeight = height * (cellSize + gap) + gap;
  const baseColor = BLOCK_COLORS[piece.colorIndex - 1] || BLOCK_COLORS[0];
  const radius = CELL_RADIUS * (cellSize / 40);

  return (
    <View
      style={{
        width: totalWidth,
        height: totalHeight,
        opacity: disabled ? 0.3 : selected ? 1 : 0.85,
        position: 'relative',
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
                },
              ]}
            >
              <View
                style={[
                  styles.highlight,
                  {
                    height: cellSize / 3,
                    borderRadius: Math.max(1, radius - 1),
                  },
                ]}
              />
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
    top: 1.5,
    left: 1.5,
    right: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
