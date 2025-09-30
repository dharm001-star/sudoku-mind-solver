/**
 * Sudoku Validation Utilities
 * Functions for validating user input and board state
 */

import { SudokuBoard } from './sudokuSolver';

export interface ValidationError {
  row: number;
  col: number;
  type: 'row' | 'column' | 'box' | 'invalid';
  message: string;
}

/**
 * Check if a number input is valid (1-9)
 */
export const isValidNumber = (value: string | number): boolean => {
  const num = typeof value === 'string' ? parseInt(value) : value;
  return !isNaN(num) && num >= 1 && num <= 9;
};

/**
 * Find all validation errors in the current board state
 */
export const validateBoard = (board: SudokuBoard): ValidationError[] => {
  const errors: ValidationError[] = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];
      if (value === null || value === 0) continue;

      // Check for duplicates in row
      for (let c = 0; c < 9; c++) {
        if (c !== col && board[row][c] === value) {
          errors.push({
            row,
            col,
            type: 'row',
            message: `Duplicate ${value} in row`,
          });
          break;
        }
      }

      // Check for duplicates in column
      for (let r = 0; r < 9; r++) {
        if (r !== row && board[r][col] === value) {
          errors.push({
            row,
            col,
            type: 'column',
            message: `Duplicate ${value} in column`,
          });
          break;
        }
      }

      // Check for duplicates in 3x3 box
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if ((r !== row || c !== col) && board[r][c] === value) {
            errors.push({
              row,
              col,
              type: 'box',
              message: `Duplicate ${value} in 3×3 box`,
            });
            break;
          }
        }
      }
    }
  }

  return errors;
};

/**
 * Check if a specific cell has validation errors
 */
export const hasError = (row: number, col: number, errors: ValidationError[]): boolean => {
  return errors.some(error => error.row === row && error.col === col);
};

/**
 * Get cells in the same row, column, or box as the active cell
 */
export const getRelatedCells = (row: number, col: number): Set<string> => {
  const related = new Set<string>();

  // Add all cells in the same row
  for (let c = 0; c < 9; c++) {
    related.add(`${row}-${c}`);
  }

  // Add all cells in the same column
  for (let r = 0; r < 9; r++) {
    related.add(`${r}-${col}`);
  }

  // Add all cells in the same 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      related.add(`${r}-${c}`);
    }
  }

  return related;
};
