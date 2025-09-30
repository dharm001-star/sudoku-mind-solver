/**
 * SudokuCell Component
 * Individual cell in the sudoku grid with validation and highlighting
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';

interface SudokuCellProps {
  value: number | null;
  row: number;
  col: number;
  isFixed: boolean;
  isActive: boolean;
  isRelated: boolean;
  hasError: boolean;
  isSolving: boolean;
  onChange: (row: number, col: number, value: number | null) => void;
  onClick: (row: number, col: number) => void;
}

const SudokuCell = memo(({
  value,
  row,
  col,
  isFixed,
  isActive,
  isRelated,
  hasError,
  isSolving,
  onChange,
  onClick,
}: SudokuCellProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (val === '') {
      onChange(row, col, null);
      return;
    }

    const num = parseInt(val);
    if (!isNaN(num) && num >= 1 && num <= 9) {
      onChange(row, col, num);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, and arrow keys
    if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      return;
    }

    // Only allow numbers 1-9
    if (!/^[1-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Determine border classes for 3x3 boxes
  const getBorderClasses = () => {
    const classes = [];
    
    // Top border for first row of each 3x3 box
    if (row % 3 === 0) classes.push('border-t-[2px] border-t-sudoku-grid-border');
    else classes.push('border-t border-t-sudoku-grid-borderLight');
    
    // Left border for first column of each 3x3 box
    if (col % 3 === 0) classes.push('border-l-[2px] border-l-sudoku-grid-border');
    else classes.push('border-l border-l-sudoku-grid-borderLight');
    
    // Bottom border for last row
    if (row === 8) classes.push('border-b-[2px] border-b-sudoku-grid-border');
    
    // Right border for last column
    if (col === 8) classes.push('border-r-[2px] border-r-sudoku-grid-border');
    
    return classes.join(' ');
  };

  return (
    <input
      type="text"
      maxLength={1}
      value={value ?? ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onClick={() => onClick(row, col)}
      disabled={isFixed}
      className={cn(
        // Base styles
        'w-full h-full aspect-square text-center font-semibold text-lg',
        'transition-all duration-150 outline-none',
        'focus:ring-2 focus:ring-primary focus:z-10',
        
        // Border classes for grid structure
        getBorderClasses(),
        
        // Background states
        isFixed && 'bg-sudoku-cell-fixed cursor-not-allowed',
        !isFixed && !hasError && !isActive && !isRelated && 'bg-sudoku-cell hover:bg-sudoku-cell-hover',
        !isFixed && isActive && 'bg-sudoku-cell-active',
        !isFixed && !isActive && isRelated && 'bg-sudoku-cell-hover',
        isSolving && 'bg-sudoku-cell-solving animate-pulse',
        hasError && 'bg-sudoku-cell-error text-destructive',
        
        // Text styles
        isFixed ? 'text-foreground font-bold' : 'text-primary',
      )}
    />
  );
});

SudokuCell.displayName = 'SudokuCell';

export default SudokuCell;
