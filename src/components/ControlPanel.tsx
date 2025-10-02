/**
 * ControlPanel Component
 * Contains all action buttons for the sudoku solver
 */

import { Button } from '@/components/ui/button';
import { Loader2, Play, RotateCcw, Zap, Sparkles, Moon, Sun, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  onSolve: () => void;
  onSolveInstant: () => void;
  onClear: () => void;
  onGenerate: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onStepByStep: () => void;
  onToggleTheme: () => void;
  isSolving: boolean;
  isDarkMode: boolean;
  disabled?: boolean;
}

const ControlPanel = ({
  onSolve,
  onSolveInstant,
  onClear,
  onGenerate,
  onStepByStep,
  onToggleTheme,
  isSolving,
  isDarkMode,
  disabled = false,
}: ControlPanelProps) => {
  return (
    <div className="space-y-6">
      {/* Primary Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={onSolve}
          disabled={isSolving || disabled}
          size="lg"
          className={cn(
            "bg-gradient-primary hover:opacity-90 shadow-md transition-all",
            "font-semibold px-6"
          )}
        >
          {isSolving ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Solving via SAT...
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Solve (SAT)
            </>
          )}
        </Button>

        <Button
          onClick={onSolveInstant}
          disabled={isSolving || disabled}
          size="lg"
          variant="outline"
          className="font-semibold px-6 shadow-sm hover:shadow-md transition-all"
        >
          <Zap className="mr-2 h-5 w-5" />
          Solve Instantly
        </Button>
        
        <Button
          onClick={onStepByStep}
          disabled={isSolving || disabled}
          size="lg"
          variant="outline"
          className="font-semibold px-6 shadow-sm hover:shadow-md transition-all"
        >
          <GitBranch className="mr-2 h-5 w-5" />
          Step by Step
        </Button>

        <Button
          onClick={onClear}
          disabled={isSolving || disabled}
          size="lg"
          variant="outline"
          className="font-semibold px-6 shadow-sm hover:shadow-md transition-all"
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Clear Board
        </Button>
      </div>

      {/* Generate Puzzle Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span>Generate New Puzzle</span>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={() => onGenerate('easy')}
            disabled={isSolving || disabled}
            variant="secondary"
            className="font-medium"
          >
            Easy
          </Button>
          
          <Button
            onClick={() => onGenerate('medium')}
            disabled={isSolving || disabled}
            variant="secondary"
            className="font-medium"
          >
            Medium
          </Button>
          
          <Button
            onClick={() => onGenerate('hard')}
            disabled={isSolving || disabled}
            variant="secondary"
            className="font-medium"
          >
            Hard
          </Button>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="flex justify-center pt-2">
        <Button
          onClick={onToggleTheme}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          {isDarkMode ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              Dark Mode
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ControlPanel;
