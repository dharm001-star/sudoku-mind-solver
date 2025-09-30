/**
 * SudokuGrid Component
 * Main 9x9 sudoku grid with cell management and validation
 */

import { useState, useCallback, useMemo } from 'react';
import SudokuCell from './SudokuCell';
import { validateBoard, getRelatedCells } from '@/utils/sudokuValidation';
import { SudokuBoard } from '@/utils/sudokuSolver';
import { cn } from '@/lib/utils';

interface SudokuGridProps {
  board: SudokuBoard;
  fixedCells: Set<string>;
  onCellChange: (row: number, col: number, value: number | null) => void;
  solvingCell?: { row: number; col: number } | null;
}

const SudokuGrid = ({ board, fixedCells, onCellChange, solvingCell }: SudokuGridProps) => {
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);

  // Validate the current board state
  const errors = useMemo(() => validateBoard(board), [board]);

  // Get cells related to the active cell (same row, column, or box)
  const relatedCells = useMemo(() => {
    if (!activeCell) return new Set<string>();
    return getRelatedCells(activeCell.row, activeCell.col);
  }, [activeCell]);

  const handleCellClick = useCallback((row: number, col: number) => {
    setActiveCell({ row, col });
  }, []);

  const hasError = useCallback(
    (row: number, col: number) => {
      return errors.some(error => error.row === row && error.col === col);
    },
    [errors]
  );

  return (
    <div className="relative">
      {/* Grid container with shadow and rounded corners */}
      <div className={cn(
        "inline-block bg-card rounded-lg shadow-lg overflow-hidden",
        "border-2 border-sudoku-grid-border"
      )}>
        {/* 9x9 Grid */}
        <div className="grid grid-cols-9 gap-0">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const cellKey = `${rowIndex}-${colIndex}`;
              const isFixed = fixedCells.has(cellKey);
              const isActive = activeCell?.row === rowIndex && activeCell?.col === colIndex;
              const isRelated = relatedCells.has(cellKey);
              const isSolving = solvingCell?.row === rowIndex && solvingCell?.col === colIndex;

              return (
                <div key={cellKey} className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14">
                  <SudokuCell
                    value={cell}
                    row={rowIndex}
                    col={colIndex}
                    isFixed={isFixed}
                    isActive={isActive}
                    isRelated={isRelated}
                    hasError={hasError(rowIndex, colIndex)}
                    isSolving={isSolving}
                    onChange={onCellChange}
                    onClick={handleCellClick}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Error message display */}
      {errors.length > 0 && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
          <p className="text-sm text-destructive font-medium">
            ⚠️ {errors.length} validation error{errors.length > 1 ? 's' : ''} found
          </p>
        </div>
      )}
    </div>
  );
};

export default SudokuGrid;
