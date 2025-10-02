import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const Welcome = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Theme toggle functionality
  const handleToggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      alert('Please enter a username to continue.');
      return;
    }

    setIsLoading(true);

    // Store username in localStorage
    localStorage.setItem('sudokuUsername', username.trim());

    // Simulate a brief delay for better UX
    setTimeout(() => {
      navigate('/game');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col items-center justify-center p-4 space-y-8">

      {/* Theme Toggle Button */}
      <button
        onClick={handleToggleTheme}
        className={cn(
          "fixed top-4 right-4 w-12 h-12 rounded-full border border-border",
          "bg-card text-foreground cursor-pointer flex items-center justify-center",
          "transition-all duration-300 hover:shadow-md hover:scale-105",
          "active:scale-95 shadow-sm z-10"
        )}
        aria-label="Toggle dark mode"
      >
        <span className="text-lg">
          {isDarkMode ? '☀' : '🌙'}
        </span>
      </button>

      {/* Welcome Container */}
      <div className="w-full max-w-md animate-in slide-in-from-bottom-4 duration-600">
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="text-center space-y-2">
            <CardTitle className={cn(
              "text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent",
              "leading-tight"
            )}>
              Welcome to Sudoku
            </CardTitle>
            <CardDescription className="text-base">
              Enter your username to start playing
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="transition-all duration-200"
                  autoComplete="username"
                  required
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                className={cn(
                  "w-full bg-gradient-hero hover:opacity-90",
                  "transition-all duration-300 hover:-translate-y-0.5",
                  "active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed",
                  isLoading && "animate-pulse"
                )}
                disabled={isLoading}
              >
                {isLoading ? 'Starting...' : 'Start Game'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Concepts Section */}
      <div className="w-full max-w-4xl animate-in fade-in duration-700">
        <Card className="shadow-xl border border-primary/30 bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Mathematical & CS Concepts in Sudoku
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Key Discrete Mathematics & Algorithmic principles used to solve Sudoku
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             
              <div className="p-4 rounded-xl bg-card shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h3 className="font-semibold text-lg">🎯 Constraint Satisfaction Problem</h3>
                <p className="text-sm text-muted-foreground">
                  Sudoku is modeled as variables with domains (1–9) and rules across rows, columns, and subgrids. Solvers prune impossible values to efficiently reduce the search space.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h3 className="font-semibold text-lg">📊 Graph Theory</h3>
                <p className="text-sm text-muted-foreground">
                  Each cell is a node; edges connect cells with shared constraints. Solving Sudoku is similar to a graph coloring problem where numbers (colors) must not repeat along edges.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h3 className="font-semibold text-lg">🔗 Propositional Logic & SAT</h3>
                <p className="text-sm text-muted-foreground">
                  Sudoku rules can be encoded as Boolean formulas and solved using SAT solvers, which systematically explore possibilities to find valid solutions.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h3 className="font-semibold text-lg">🔍 Set Theory & Candidate Elimination</h3>
                <p className="text-sm text-muted-foreground">
                  Each cell has a set of possible numbers (candidates). By intersecting sets from rows, columns, and subgrids, invalid candidates are eliminated. Techniques like 'naked singles' and 'hidden pairs' rely on this to logically reduce possibilities.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <h3 className="font-semibold text-lg">⚖ Combinatorics & Heuristics</h3>
                <p className="text-sm text-muted-foreground">
                  Counting possible solutions and applying heuristics such as candidate elimination or pattern recognition reduces trial-and-error and improves solving speed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;