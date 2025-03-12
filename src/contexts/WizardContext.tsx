
import React, { createContext, useContext, useState } from 'react';

// Define the types of media that can be uploaded
export type MediaType = 'image' | 'video' | 'text-only';

// Wizard steps
export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

// Define the data structure for the wizard
export interface WizardData {
  mediaUrl: string | null;
  mediaType: MediaType | null;
  niche: string | null;
  platform: string | null;
  goal: string | null;
  tone: string | null;
  generatedCaptions: string[] | null;
}

interface WizardContextType {
  currentStep: WizardStep;
  wizardData: WizardData;
  setCurrentStep: (step: WizardStep) => void;
  updateWizardData: (data: Partial<WizardData>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  resetWizard: () => void;
}

const initialWizardData: WizardData = {
  mediaUrl: null,
  mediaType: null,
  niche: null,
  platform: null,
  goal: null,
  tone: null,
  generatedCaptions: null,
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...data }));
  };

  const goToNextStep = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setWizardData(initialWizardData);
  };

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        wizardData,
        setCurrentStep,
        updateWizardData,
        goToNextStep,
        goToPreviousStep,
        resetWizard,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};
