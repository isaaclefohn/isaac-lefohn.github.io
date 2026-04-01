/**
 * Board renderer for Color Block Blast.
 * Uses standard React Native Views (Expo Go compatible).
 */

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Grid } from '../engine/Board';
import { COLORS, CELL_SIZE, CELL_GAP, CELL_RADIUS } from '../../utils/constants';

interface BoardRendererProps {
  grid: Grid;
  gridSize: number;
  ghostCells?: { row: number; col: number; colorIndex: number }[];
  clearedCells?: { row: number; col: number }[];
  showGridLines?: boolean;
}

const BLOCK_COLORS = COLORS.blocks;

export const BoardRenderer: React.FC<BoardRendererProps> = ({
  grid,
  gridSize,
  ghostCells = [],
  showGridLines = true,
}) => {
  const totalSize = gridSize * (CELL_SIZE + CELL_GAP) + CELL_GAP;

  const ghostLookup = useMemo(() => {
    const lookup = new Map<string, number>();
    for (const cell of ghostCells) {
      lookup.set(`${cell.row},${cell.col}`, cell.colorIndex);
    }
    return lookup;
  }, [ghostCells]);

  return (
    <View style={[styles.board, { width: totalSize, height: totalSize }]}>
      {Array.from({ length: gridSize }, (_, row) =>
        Array.from({ length: gridSize }, (_, col) => {
          const cellValue = grid[row][col];
          const ghostColor = ghostLookup.get(`${row},${col}`);

          let backgroundColor: string;
          let opacity = 1;

          if (cellValue !== 0) {
            backgroundColor = BLOCK_COLORS[cellValue - 1] || BLOCK_COLORS[0];
          } else if (ghostColor !== undefined) {
            backgroundColor = BLOCK_COLORS[ghostColor - 1] || BLOCK_COLORS[0];
            opacity = 0.25;
          } else {
            backgroundColor = showGridLines ? COLORS.gridEmpty : COLORS.surface;
          }

          return (
            <View
              key={`${row}-${col}`}
              style={[
                styles.cell,
                {
                  left: CELL_GAP + col * (CELL_SIZE + CELL_GAP),
                  top: CELL_GAP + row * (CELL_SIZE + CELL_GAP),
                  backgroundColor,
                  opacity,
                },
              ]}
            >
              {cellValue !== 0 && <View style={styles.highlight} />}
            </View>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    position: 'relative',
  },
  cell: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: CELL_RADIUS,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    height: CELL_SIZE / 3,
    borderRadius: CELL_RADIUS - 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});
