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

interface ImageUploadProps {
  onBoardExtracted: (board: SudokuBoard) => void;
  disabled?: boolean;
}

const ImageUpload = ({ onBoardExtracted, disabled }: ImageUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractSudokuFromImage = async (imageFile: File) => {
    setIsProcessing(true);
    
    try {
      toast({
        title: "📸 Processing Image",
        description: "Extracting sudoku puzzle from image...",
      });

      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(imageFile);
      await worker.terminate();

      // Extract digits from OCR text
      const digits = text.replace(/[^0-9]/g, '');
      
      if (digits.length < 20) {
        throw new Error('Could not extract enough numbers from image');
      }

      // Create board from extracted digits
      const board: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null));
      let digitIndex = 0;
      
      for (let i = 0; i < 9 && digitIndex < digits.length; i++) {
        for (let j = 0; j < 9 && digitIndex < digits.length; j++) {
          const digit = parseInt(digits[digitIndex]);
          if (digit >= 1 && digit <= 9) {
            board[i][j] = digit;
          }
          digitIndex++;
        }
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
