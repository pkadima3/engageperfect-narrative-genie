
import React from 'react';
import { WizardProvider, useWizard } from '@/contexts/WizardContext';
import PageLayout from '@/components/Layout/PageLayout';
import UploadMedia from '@/components/Wizard/Steps/UploadMedia';
import SelectNiche from '@/components/Wizard/Steps/SelectNiche';

// Wizard Content Component
const WizardContent: React.FC = () => {
  const { currentStep } = useWizard();
  
  switch (currentStep) {
    case 1:
      return <UploadMedia />;
    case 2:
      return <SelectNiche />;
    // We'll add the other steps later
    default:
      return <UploadMedia />;
  }
};

// Main Wizard Page Component
const WizardPage: React.FC = () => {
  return (
    <PageLayout className="bg-[#0d1425] pt-8 pb-16">
      <WizardProvider>
        <WizardContent />
      </WizardProvider>
    </PageLayout>
  );
};

export default WizardPage;
