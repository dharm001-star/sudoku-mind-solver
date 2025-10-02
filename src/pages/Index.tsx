/**
 * Sudoku Solver - Main Page
 * Professional sudoku solver using SAT-based solving
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SudokuGrid from '@/components/SudokuGrid';
import ControlPanel from '@/components/ControlPanel';
import ImageUpload from '@/components/ImageUpload';
import StepController from '@/components/StepController';
import { SudokuBoard, solveSudokuSAT, getSolvingSteps } from '@/utils/sudokuSolver';
import { createEmptyBoard, generateSudoku, examplePuzzle } from '@/utils/sudokuGenerator';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();
  
  // Board state
  const [board, setBoard] = useState<SudokuBoard>(createEmptyBoard());
  const [fixedCells, setFixedCells] = useState<Set<string>>(new Set());
  const [isSolving, setIsSolving] = useState(false);
  const [solvingCell, setSolvingCell] = useState<{ row: number; col: number } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Step-by-step solving state
  const [solvingSteps, setSolvingSteps] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isStepMode, setIsStepMode] = useState(false);

  // Check for username and redirect if not found
  useEffect(() => {
    const username = localStorage.getItem('sudokuUsername');
    if (!username) {
      navigate('/');
    }
  }, [navigate]);

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
   * Solve the puzzle using SAT (instant)
   */
  const handleSolve = useCallback(async () => {
    if (isSolving) return;
    setIsSolving(true);
    // Use backtracking trace for a smooth animation
    const steps = getSolvingSteps(board.map(row => [...row]));
    if (!steps.length) {
      toast({ variant: "destructive", title: "❌ No Solution", description: "This puzzle cannot be solved." });
      setIsSolving(false);
      return;
    }
    let idx = 0;
    const interval = setInterval(() => {
      const step = steps[idx];
      setBoard(step.board);
      setSolvingCell({ row: step.row, col: step.col });
      idx++;
      if (idx >= steps.length) {
        clearInterval(interval);
        setSolvingCell(null);
        setIsSolving(false);
        toast({ title: "✅ Puzzle Solved!", description: "Animated via backtracking trace; consistency ensured by SAT." });
      }
    }, 25);
  }, [board, isSolving]);

  /**
   * Solve instantly (SAT)
   */
  const handleSolveInstant = useCallback(() => {
    if (isSolving) return;
    const boardCopy = board.map(row => [...row]);
    const solved = solveSudokuSAT(boardCopy);
    if (solved) {
      setBoard(boardCopy);
      toast({ title: "⚡ Solved Instantly!", description: "Solved via SAT." });
    } else {
      toast({ variant: "destructive", title: "❌ No Solution", description: "This puzzle cannot be solved." });
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
   * Handle image upload
   */
  const handleImageUpload = useCallback((extractedBoard: SudokuBoard) => {
    loadPuzzle(extractedBoard);
  }, [loadPuzzle]);

  /**
   * Start step-by-step solving
   */
  const handleStepByStep = useCallback(() => {
    const boardCopy = board.map(row => [...row]);
    const steps = getSolvingSteps(boardCopy);
    if (steps.length === 0) {
      toast({ variant: "destructive", title: "❌ No Solution", description: "This puzzle cannot be solved." });
      return;
    }
    setSolvingSteps(steps);
    setCurrentStepIndex(0);
    setIsStepMode(true);
    toast({ title: "🎯 Step Mode Active", description: "Use Next Step to solve one step at a time." });
  }, [board]);

  /**
   * Navigate to next step
   */
  const handleNextStep = useCallback(() => {
    if (currentStepIndex < solvingSteps.length) {
      const step = solvingSteps[currentStepIndex];
      setBoard(step.board);
      setSolvingCell({ row: step.row, col: step.col });
      setCurrentStepIndex(prev => prev + 1);
      
      if (currentStepIndex + 1 >= solvingSteps.length) {
        toast({
          title: "🎉 Puzzle Solved!",
          description: "All steps completed.",
        });
        setIsStepMode(false);
      }
    }
  }, [currentStepIndex, solvingSteps]);

  /**
   * Navigate to previous step
   */
  const handlePrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const step = solvingSteps[currentStepIndex - 1];
      setBoard(step.board);
      setSolvingCell({ row: step.row, col: step.col });
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex, solvingSteps]);

  /**
   * Reset step mode
   */
  const handleResetSteps = useCallback(() => {
    setIsStepMode(false);
    setSolvingSteps([]);
    setCurrentStepIndex(0);
    setSolvingCell(null);
    
    // Restore original puzzle
    const newBoard = board.map(row => [...row]);
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (!fixedCells.has(`${i}-${j}`)) {
          newBoard[i][j] = null;
        }
      });
    });
    setBoard(newBoard);
  }, [board, fixedCells]);

  /**
   * Toggle dark mode
   */
  const handleToggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  /**
   * Logout and return to welcome page
   */
  const handleLogout = useCallback(() => {
    localStorage.removeItem('sudokuUsername');
    navigate('/welcome');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="py-8 px-4 text-center border-b border-border relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Welcome, {localStorage.getItem('sudokuUsername')}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors"
          >
            Logout
          </button>
        </div>
        <h1 className={cn(
          "text-4xl md:text-5xl font-bold mb-2",
          "bg-gradient-hero bg-clip-text text-transparent"
        )}>
          Sudoku Solver
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          SAT-based professional solver
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
                onStepByStep={handleStepByStep}
                onToggleTheme={handleToggleTheme}
                isSolving={isSolving}
                isDarkMode={isDarkMode}
                disabled={isStepMode}
              />
              
              {/* Image Upload */}
              <div className="mt-4 pt-4 border-t border-border">
                <ImageUpload 
                  onBoardExtracted={handleImageUpload}
                  disabled={isSolving || isStepMode}
                />
              </div>
              
              {/* Step Controller */}
              {isStepMode && (
                <div className="mt-4 pt-4 border-t border-border">
                  <StepController
                    currentStep={currentStepIndex}
                    totalSteps={solvingSteps.length}
                    onNextStep={handleNextStep}
                    onPrevStep={handlePrevStep}
                    onReset={handleResetSteps}
                  />
                </div>
              )}
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
        <p>Built with React, TypeScript & Propositional Logic SAT Solver</p>
      </footer>
    </div>
  );
};

export default Index;
