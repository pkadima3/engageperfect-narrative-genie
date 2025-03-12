
import React from 'react';
import { WizardProvider, useWizard } from '@/contexts/WizardContext';
import PageLayout from '@/components/Layout/PageLayout';
import UploadMedia from '@/components/Wizard/Steps/UploadMedia';
import SelectNiche from '@/components/Wizard/Steps/SelectNiche';
import SelectPlatform from '@/components/Wizard/Steps/SelectPlatform';
import SelectGoal from '@/components/Wizard/Steps/SelectGoal';
import { Toaster } from 'sonner';

// Wizard Content Component
const WizardContent: React.FC = () => {
  const { currentStep, wizardData } = useWizard();
  
  // Validate step progress - users shouldn't be able to access next steps if previous aren't completed
  const validateStepAccess = (step: number): boolean => {
    switch (step) {
      case 1: 
        return true; // First step is always accessible
      case 2:
        return !!wizardData.mediaUrl && !!wizardData.mediaType; // Media must be uploaded
      case 3:
        return !!wizardData.niche; // Niche must be selected
      case 4:
        return !!wizardData.platform; // Platform must be selected for subsequent steps
      case 5:
        return !!wizardData.goal; // Goal must be selected
      case 6:
        return !!wizardData.tone; // Tone must be selected for final step
      default:
        return false;
    }
  };
  
  // If trying to access an invalid step, show the last valid step
  const getAccessibleStep = (): number => {
    let step = 1;
    for (let i = 1; i <= currentStep; i++) {
      if (validateStepAccess(i)) {
        step = i;
      } else {
        break;
      }
    }
    return step;
  };
  
  const accessibleStep = getAccessibleStep();
  
  switch (accessibleStep) {
    case 1:
      return <UploadMedia />;
    case 2:
      return <SelectNiche />;
    case 3:
      return <SelectPlatform />;
    case 4:
      return <SelectGoal />;
    // We'll add the tone step later
    default:
      return <UploadMedia />;
  }
};

// Main Wizard Page Component
const WizardPage: React.FC = () => {
  return (
    <PageLayout className="bg-[#0d1425] pt-8 pb-16">
      <Toaster 
        position="top-center"
        closeButton={true} // Ensure all toasts have a close button
        richColors={true}
        expand={true}
        duration={4000}
      />
      <WizardProvider>
        <WizardContent />
      </WizardProvider>
    </PageLayout>
  );
};

export default WizardPage;
