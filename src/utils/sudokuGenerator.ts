/**
 * Sudoku Puzzle Generator
 * Generates valid sudoku puzzles with varying difficulty levels
 */

import { isValid, solveSudokuInstant, SudokuBoard } from './sudokuSolver';

/**
 * Create an empty sudoku board
 */
export const createEmptyBoard = (): SudokuBoard => {
  return Array(9).fill(null).map(() => Array(9).fill(null));
};

/**
 * Shuffle an array (Fisher-Yates algorithm)
 */
const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Fill the board with a valid complete solution
 */
const fillBoard = (board: SudokuBoard): boolean => {
  const empty = board.flatMap((row, i) => 
    row.map((cell, j) => cell === null ? [i, j] : null)
  ).filter((pos): pos is [number, number] => pos !== null)[0];

  if (!empty) return true;

  const [row, col] = empty;
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (const num of numbers) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;

      if (fillBoard(board)) {
        return true;
      }

      board[row][col] = null;
    }
  }

  return false;
};

/**
 * Count the number of solutions for a board (used to ensure unique solution)
 */
const countSolutions = (board: SudokuBoard, limit = 2): number => {
  const empty = board.flatMap((row, i) => 
    row.map((cell, j) => cell === null ? [i, j] : null)
  ).filter((pos): pos is [number, number] => pos !== null)[0];

  if (!empty) return 1;

  const [row, col] = empty;
  let count = 0;

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      count += countSolutions(board, limit);
      board[row][col] = null;

      if (count >= limit) return count;
    }
  }

  return count;
};

/**
 * Remove numbers from a complete board to create a puzzle
 */
const removeNumbers = (board: SudokuBoard, cellsToRemove: number): void => {
  let removed = 0;
  const cells = Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9] as [number, number]);
  const shuffledCells = shuffle(cells);

  for (const [row, col] of shuffledCells) {
    if (removed >= cellsToRemove) break;

    const backup = board[row][col];
    board[row][col] = null;

    // Create a copy for testing
    const testBoard = board.map(r => [...r]);
    
    // If removing this number leads to multiple solutions, put it back
    if (countSolutions(testBoard) !== 1) {
      board[row][col] = backup;
    } else {
      removed++;
    }
  }
};

/**
 * Generate a new sudoku puzzle
 * @param difficulty - 'easy' (40-45 clues), 'medium' (32-38 clues), 'hard' (25-30 clues)
 */
export const generateSudoku = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): SudokuBoard => {
  const board = createEmptyBoard();
  
  // Fill the board with a complete valid solution
  fillBoard(board);

  // Determine how many cells to remove based on difficulty
  const cellsToRemove = {
    easy: 40,    // 41 clues remaining
    medium: 50,  // 31 clues remaining
    hard: 57,    // 24 clues remaining
  }[difficulty];

  // Remove numbers while ensuring unique solution
  removeNumbers(board, cellsToRemove);

  return board;
};

/**
 * Example puzzle for testing
 */
export const examplePuzzle: SudokuBoard = [
  [5, 3, null, null, 7, null, null, null, null],
  [6, null, null, 1, 9, 5, null, null, null],
  [null, 9, 8, null, null, null, null, 6, null],
  [8, null, null, null, 6, null, null, null, 3],
  [4, null, null, 8, null, 3, null, null, 1],
  [7, null, null, null, 2, null, null, null, 6],
  [null, 6, null, null, null, null, 2, 8, null],
  [null, null, null, 4, 1, 9, null, null, 5],
  [null, null, null, null, 8, null, null, 7, 9],
];
