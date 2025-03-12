
import React from 'react';
import WizardLayout from '../WizardLayout';
import { useWizard } from '@/contexts/WizardContext';

// This is a placeholder for the second step
const SelectNiche: React.FC = () => {
  const { wizardData, updateWizardData } = useWizard();
  
  return (
    <WizardLayout 
      title="Select Your Niche" 
      subtitle="Choose the category that best fits your content"
    >
      <div className="py-8 text-center text-gray-300">
        <p>Coming in the next implementation phase...</p>
      </div>
    </WizardLayout>
  );
};

export default SelectNiche;
