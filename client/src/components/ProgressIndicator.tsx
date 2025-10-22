import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function ProgressIndicator({ currentStep, totalSteps, steps }: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-8">
      {/* Progress bar */}
      <div className="relative">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((stepName, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          
          return (
            <div key={stepNumber} className="flex items-center gap-3">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  isCompleted
                    ? "bg-primary text-black dark:text-black"
                    : isCurrent
                    ? "bg-primary text-black dark:text-black ring-4 ring-primary/20"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    isCurrent || isCompleted
                      ? "text-heading"
                      : "text-muted-foreground"
                  }`}
                >
                  {stepName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Step {stepNumber} dari {totalSteps}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
