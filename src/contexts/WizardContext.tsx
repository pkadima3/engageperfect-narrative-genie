
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  canProceedToNextStep: () => boolean;
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
  const [wizardData, setWizardData] = useState<WizardData>(() => {
    // Try to load saved data from localStorage
    const savedData = localStorage.getItem('wizardData');
    return savedData ? JSON.parse(savedData) : initialWizardData;
  });
  
  // Validate if the current step is completed
  const isCurrentStepCompleted = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!wizardData.mediaUrl && !!wizardData.mediaType;
      case 2:
        return !!wizardData.niche;
      case 3:
        return !!wizardData.platform;
      case 4:
        return !!wizardData.goal;
      case 5:
        return !!wizardData.tone;
      case 6:
        return !!wizardData.generatedCaptions;
      default:
        return false;
    }
  };
  
  // Check if we can proceed to the next step
  const canProceedToNextStep = (): boolean => {
    return isCurrentStepCompleted();
  };

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData((prev) => {
      const newData = { ...prev, ...data };
      // Save to localStorage for persistence
      localStorage.setItem('wizardData', JSON.stringify(newData));
      return newData;
    });
  };

  const goToNextStep = () => {
    if (currentStep < 6 && isCurrentStepCompleted()) {
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
    localStorage.removeItem('wizardData');
  };

  // Ensure we don't skip steps
  useEffect(() => {
    // If we try to access a step but previous steps aren't completed, go back to the last valid step
    let validStep = 1;
    for (let i = 1; i <= currentStep; i++) {
      if (i === 1 || (i === 2 && wizardData.mediaUrl) || 
          (i === 3 && wizardData.niche) || 
          (i === 4 && wizardData.platform) ||
          (i === 5 && wizardData.goal) ||
          (i === 6 && wizardData.tone)) {
        validStep = i;
      } else {
        break;
      }
    }
    
    if (validStep !== currentStep) {
      setCurrentStep(validStep as WizardStep);
    }
  }, [currentStep, wizardData]);

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
        canProceedToNextStep,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};
