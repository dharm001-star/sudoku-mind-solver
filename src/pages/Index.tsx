/**
 * Sudoku Solver - Main Page
 * Professional sudoku solver with backtracking visualization
 */

import { useState, useCallback, useEffect } from 'react';
import SudokuGrid from '@/components/SudokuGrid';
import ControlPanel from '@/components/ControlPanel';
import { SudokuBoard, solveSudoku, solveSudokuInstant } from '@/utils/sudokuSolver';
import { createEmptyBoard, generateSudoku, examplePuzzle } from '@/utils/sudokuGenerator';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Index = () => {
  // Board state
  const [board, setBoard] = useState<SudokuBoard>(createEmptyBoard());
  const [fixedCells, setFixedCells] = useState<Set<string>>(new Set());
  const [isSolving, setIsSolving] = useState(false);
  const [solvingCell, setSolvingCell] = useState<{ row: number; col: number } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize with example puzzle
  useEffect(() => {
    loadPuzzle(examplePuzzle);
  }, []);

  // Theme toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  /**
   * Load a puzzle and mark cells as fixed
   */
  const loadPuzzle = useCallback((puzzle: SudokuBoard) => {
    const newBoard = puzzle.map(row => [...row]);
    const fixed = new Set<string>();
    
    puzzle.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell !== null) {
          fixed.add(`${i}-${j}`);
        }
      });
    });

    setBoard(newBoard);
    setFixedCells(fixed);
    setSolvingCell(null);
  }, []);

  /**
   * Handle cell value change
   */
  const handleCellChange = useCallback(
    (row: number, col: number, value: number | null) => {
      if (isSolving) return;

      setBoard(prevBoard => {
        const newBoard = prevBoard.map(r => [...r]);
        newBoard[row][col] = value;
        return newBoard;
      });
    },
    [isSolving]
  );

  /**
   * Solve with animation (backtracking visualization)
   */
  const handleSolve = useCallback(async () => {
    if (isSolving) return;

    setIsSolving(true);
    const boardCopy = board.map(row => [...row]);

    try {
      const solved = await solveSudoku(boardCopy, (newBoard, row, col) => {
        setBoard(newBoard);
        setSolvingCell({ row, col });
      });

      if (solved) {
        setBoard(boardCopy);
        setSolvingCell(null);
        toast({
          title: "✅ Puzzle Solved!",
          description: "The sudoku has been solved successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "❌ No Solution",
          description: "This puzzle cannot be solved. Check for errors.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while solving the puzzle.",
      });
    } finally {
      setIsSolving(false);
      setSolvingCell(null);
    }
  }, [board, isSolving]);

  /**
   * Solve instantly (no animation)
   */
  const handleSolveInstant = useCallback(() => {
    if (isSolving) return;

    const boardCopy = board.map(row => [...row]);
    const solved = solveSudokuInstant(boardCopy);

    if (solved) {
      setBoard(boardCopy);
      toast({
        title: "⚡ Solved Instantly!",
        description: "The sudoku has been solved.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "❌ No Solution",
        description: "This puzzle cannot be solved. Check for errors.",
      });
    }
  }, [board, isSolving]);

  /**
   * Clear the board
   */
  const handleClear = useCallback(() => {
    setBoard(createEmptyBoard());
    setFixedCells(new Set());
    setSolvingCell(null);
    toast({
      title: "🗑️ Board Cleared",
      description: "The board has been reset.",
    });
  }, []);

  /**
   * Generate a new puzzle
   */
  const handleGenerate = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    const newPuzzle = generateSudoku(difficulty);
    loadPuzzle(newPuzzle);
    
    toast({
      title: `🎲 New ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Puzzle`,
      description: "A new puzzle has been generated!",
    });
  }, [loadPuzzle]);

  /**
   * Toggle dark mode
   */
  const handleToggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="py-8 px-4 text-center border-b border-border">
        <h1 className={cn(
          "text-4xl md:text-5xl font-bold mb-2",
          "bg-gradient-hero bg-clip-text text-transparent"
        )}>
          Sudoku Solver
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Professional solver with backtracking visualization
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Sudoku Grid */}
          <div className="flex-shrink-0 mx-auto">
            <SudokuGrid
              board={board}
              fixedCells={fixedCells}
              onCellChange={handleCellChange}
              solvingCell={solvingCell}
            />
          </div>

          {/* Control Panel */}
          <div className="w-full lg:w-auto lg:min-w-[320px] mx-auto">
            <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
              <ControlPanel
                onSolve={handleSolve}
                onSolveInstant={handleSolveInstant}
                onClear={handleClear}
                onGenerate={handleGenerate}
                onToggleTheme={handleToggleTheme}
                isSolving={isSolving}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground space-y-2">
              <h3 className="font-semibold text-foreground mb-2">📖 How to use:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Click any cell to enter numbers (1-9)</li>
                <li>Invalid entries will be highlighted in red</li>
                <li>Use "Solve with Animation" to watch the algorithm work</li>
                <li>Generate puzzles at different difficulty levels</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border mt-12">
        <p>Built with React, TypeScript & Backtracking Algorithm</p>
      </footer>
    </div>
  );
};

export default Index;
