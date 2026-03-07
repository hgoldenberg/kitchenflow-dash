import { useDemoGuide, stepLabels, type DemoStep } from "@/context/DemoGuideContext";
import { Check } from "lucide-react";

export default function StepIndicator() {
  const { isGuided, currentStep } = useDemoGuide();
  if (!isGuided) return null;

  const steps: DemoStep[] = [1, 2, 3, 4];

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-1 text-xs font-medium text-primary mb-3">
        <span>Demo guiada</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">Paso {currentStep} de 4</span>
      </div>
      <div className="flex items-center gap-2">
        {steps.map((step) => {
          const isActive = step === currentStep;
          const isDone = step < currentStep;
          return (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive ? "bg-primary text-primary-foreground" :
                isDone ? "bg-primary/20 text-primary" :
                "bg-muted text-muted-foreground"
              }`}>
                {isDone ? <Check className="h-3 w-3" /> : <span>{step}</span>}
                <span className="hidden sm:inline">{stepLabels[step]}</span>
              </div>
              {step < 4 && <div className={`flex-1 h-px ${isDone ? "bg-primary/40" : "bg-border"}`} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
