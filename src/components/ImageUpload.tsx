/**
 * ImageUpload Component
 * Upload sudoku puzzle image and extract grid using OCR
 */

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { toast } from '@/hooks/use-toast';
import { SudokuBoard } from '@/utils/sudokuSolver';
import { validateBoard } from '@/utils/sudokuValidation';

interface ImageUploadProps {
  onBoardExtracted: (board: SudokuBoard) => void;
  disabled?: boolean;
}

const ImageUpload = ({ onBoardExtracted, disabled }: ImageUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Load an image file into an HTMLImageElement
   */
  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      // Improve OCR by avoiding smoothing artifacts
      img.crossOrigin = 'anonymous';
      img.src = url;
    });
  };

  /**
   * Convert uploaded image into a 9x9 board by running OCR per cell.
   * Assumes the puzzle roughly fills the image. We center-crop to a square,
   * upscale to a fixed canvas, then read each cell with a numeric whitelist.
   */
  const extractSudokuFromImage = async (imageFile: File) => {
    setIsProcessing(true);
    
    try {
      toast({
        title: "📸 Processing Image",
        description: "Extracting sudoku puzzle from image...",
      });

      // Prepare OCR worker with numeric whitelist for better accuracy
      const worker = await createWorker('eng', 1, {
        logger: () => {},
      });
      await worker.setParameters({
        tessedit_char_whitelist: '123456789',
        classify_bln_numeric_mode: '1',
      } as any);

      // Draw the image onto a square canvas
      const img = await loadImage(imageFile);
      const squareSize = 900; // normalize for consistent OCR
      const canvas = document.createElement('canvas');
      canvas.width = squareSize;
      canvas.height = squareSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Center-crop to square from the original image
      const minSide = Math.min(img.width, img.height);
      const sx = (img.width - minSide) / 2;
      const sy = (img.height - minSide) / 2;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, squareSize, squareSize);

      // Optional: add slight thresholding to improve contrast
      const imageData = ctx.getImageData(0, 0, squareSize, squareSize);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = (r + g + b) / 3;
        const v = gray > 200 ? 255 : gray < 60 ? 0 : gray; // light denoise
        data[i] = data[i + 1] = data[i + 2] = v;
      }
      ctx.putImageData(imageData, 0, 0);

      // Split into 9x9 grid and OCR each cell
      const board: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null));
      const cell = document.createElement('canvas');
      const cellPadding = 10; // ignore grid lines
      const cellSize = Math.floor(squareSize / 9);
      cell.width = cell.height = cellSize - cellPadding * 2;
      const cellCtx = cell.getContext('2d');
      if (!cellCtx) throw new Error('Cell canvas context not available');

      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const x = col * cellSize + cellPadding;
          const y = row * cellSize + cellPadding;
          cellCtx.clearRect(0, 0, cell.width, cell.height);
          cellCtx.drawImage(
            canvas,
            x,
            y,
            cell.width,
            cell.height,
            0,
            0,
            cell.width,
            cell.height
          );
          const blob: Blob = await new Promise((resolve) => cell.toBlob((b) => resolve(b as Blob), 'image/png'));
          const { data: { text } } = await worker.recognize(blob);
          const match = text.replace(/[^1-9]/g, '').trim();
          if (match.length === 1) {
            const value = parseInt(match, 10);
            if (value >= 1 && value <= 9) {
              board[row][col] = value;
            }
          }
        }
      }

      await worker.terminate();

      // Basic sanity checks before accepting the board
      const filled = board.flat().filter(v => typeof v === 'number' && v !== 0).length;
      if (filled < 17) { // below typical minimal clues for a valid Sudoku
        toast({
          variant: "destructive",
          title: "⚠️ Unrecognized puzzle",
          description: "Not enough digits detected. Please upload a clearer, well-cropped Sudoku image.",
        });
        return;
      }

      const errors = validateBoard(board);
      if (errors.length > 0) {
        toast({
          variant: "destructive",
          title: "❌ Invalid puzzle detected",
          description: `${errors.length} validation error(s) found. Please ensure the photo is straight and the puzzle has no conflicts.`,
        });
        return;
      }

      onBoardExtracted(board);
      
      toast({
        title: "✅ Puzzle Extracted!",
        description: "Sudoku puzzle loaded from image.",
      });
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        variant: "destructive",
        title: "❌ Processing Failed",
        description: "Could not extract puzzle from image. Try a clearer photo.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      extractSudokuFromImage(file);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isProcessing}
        variant="outline"
        size="lg"
        className="font-semibold px-6 shadow-sm hover:shadow-md transition-all"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-5 w-5" />
            Upload Image
          </>
        )}
      </Button>
    </>
  );
};

export default ImageUpload;
