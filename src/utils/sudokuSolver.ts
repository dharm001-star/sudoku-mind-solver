/**
 * Sudoku Solver using Backtracking Algorithm
 * This file contains the core logic for solving sudoku puzzles
 */

export type SudokuBoard = (number | null)[][];
export type SolverCallback = (board: SudokuBoard, row: number, col: number) => void;

/**
 * Check if placing a number at given position is valid
 */
export const isValid = (board: SudokuBoard, row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

/**
 * Find next empty cell in the board
 */
const findEmpty = (board: SudokuBoard): [number, number] | null => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === null || board[i][j] === 0) {
        return [i, j];
      }
    }
  }
  return null;
};

/**
 * Solve the sudoku board using backtracking
 * @param board - The sudoku board to solve
 * @param onStep - Optional callback for visualization (called on each step)
 * @returns true if solved, false if no solution exists
 */
export const solveSudoku = async (
  board: SudokuBoard,
  onStep?: SolverCallback
): Promise<boolean> => {
  const empty = findEmpty(board);
  
  if (!empty) {
    return true; // Board is complete
  }

  const [row, col] = empty;

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      
      // Call visualization callback if provided
      if (onStep) {
        onStep([...board.map(r => [...r])], row, col);
        // Small delay for visualization
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      if (await solveSudoku(board, onStep)) {
        return true;
      }

      // Backtrack
      board[row][col] = null;
      
      if (onStep) {
        onStep([...board.map(r => [...r])], row, col);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
  }

  return false;
};

/**
 * Solve without visualization (instant)
 */
export const solveSudokuInstant = (board: SudokuBoard): boolean => {
  const empty = findEmpty(board);
  
  if (!empty) return true;

  const [row, col] = empty;

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;

      if (solveSudokuInstant(board)) {
        return true;
      }

      board[row][col] = null;
    }
  }

  return false;
};
