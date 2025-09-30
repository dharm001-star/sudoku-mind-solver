/**
 * StepController Component
 * Controls for step-by-step solving
 */

import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';

interface StepControllerProps {
  currentStep: number;
  totalSteps: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  disabled?: boolean;
}

const StepController = ({
  currentStep,
  totalSteps,
  onNextStep,
  onPrevStep,
  onReset,
  disabled
}: StepControllerProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          Step {currentStep} of {totalSteps}
        </p>
        <div className="flex gap-2 justify-center">
          <Button
            onClick={onPrevStep}
            disabled={disabled || currentStep === 0}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={onNextStep}
            disabled={disabled || currentStep >= totalSteps}
            variant="default"
            size="sm"
            className="px-6"
          >
            {currentStep >= totalSteps ? 'Complete' : 'Next Step'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          
          <Button
            onClick={onReset}
            disabled={disabled}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepController;
