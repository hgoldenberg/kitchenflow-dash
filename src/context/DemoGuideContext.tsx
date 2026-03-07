import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type DemoStep = 1 | 2 | 3 | 4;

interface DemoGuideContextType {
  isGuided: boolean;
  currentStep: DemoStep;
  startGuide: () => void;
  nextStep: () => void;
  stopGuide: () => void;
}

const DemoGuideContext = createContext<DemoGuideContextType | null>(null);

export function useDemoGuide() {
  const ctx = useContext(DemoGuideContext);
  if (!ctx) throw new Error("useDemoGuide must be used within DemoGuideProvider");
  return ctx;
}

const stepRoutes: Record<DemoStep, string> = {
  1: "/ventas",
  2: "/stock",
  3: "/compras",
  4: "/facturas",
};

const stepLabels: Record<DemoStep, string> = {
  1: "Simular ventas del turno",
  2: "Revisar stock y alertas",
  3: "Generar orden de compra",
  4: "Ver factura pendiente",
};

export { stepLabels, stepRoutes };

export function DemoGuideProvider({ children }: { children: ReactNode }) {
  const [isGuided, setIsGuided] = useState(false);
  const [currentStep, setCurrentStep] = useState<DemoStep>(1);
  const navigate = useNavigate();

  const startGuide = useCallback(() => {
    setIsGuided(true);
    setCurrentStep(1);
    navigate("/ventas");
  }, [navigate]);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, 4) as DemoStep;
      navigate(stepRoutes[next]);
      return next;
    });
  }, [navigate]);

  const stopGuide = useCallback(() => {
    setIsGuided(false);
    setCurrentStep(1);
  }, []);

  return (
    <DemoGuideContext.Provider value={{ isGuided, currentStep, startGuide, nextStep, stopGuide }}>
      {children}
    </DemoGuideContext.Provider>
  );
}
