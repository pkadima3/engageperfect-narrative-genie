
import React from 'react';
import { motion } from 'framer-motion';
import { useWizard, WizardStep } from '@/contexts/WizardContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PrimaryButton from '@/components/Buttons/PrimaryButton';
import { cn } from '@/lib/utils';

interface WizardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  isNextDisabled?: boolean;
  onNext?: () => void;
  isPrevDisabled?: boolean;
}

const stepLabels = {
  1: 'Upload Media',
  2: 'Select Niche',
  3: 'Platform',
  4: 'Goal',
  5: 'Tone',
  6: 'Generated Captions',
};

const WizardLayout: React.FC<WizardLayoutProps> = ({
  children,
  title,
  subtitle,
  isNextDisabled = false,
  onNext,
  isPrevDisabled = false,
}) => {
  const { currentStep, goToNextStep, goToPreviousStep } = useWizard();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      goToNextStep();
    }
  };

  return (
    <div className="max-w-5xl mx-auto rounded-xl overflow-hidden">
      {/* Progress Steps */}
      <div className="bg-[#0d1425] text-white p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6">Caption Generator</h1>
        <p className="text-center text-gray-300 mb-8">
          Create engaging captions for your social media posts with AI assistance
        </p>
        
        <div className="flex items-center justify-between gap-2 px-4">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className="flex-1 flex flex-col items-center">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                  step === currentStep ? "bg-primary text-white" : 
                  step < currentStep ? "bg-primary/60 text-white" : "bg-gray-800 text-gray-400"
                )}
              >
                {step}
              </div>
              <div className={cn(
                "text-xs text-center",
                step === currentStep ? "text-primary-foreground" : 
                step < currentStep ? "text-gray-300" : "text-gray-500"
              )}>
                {stepLabels[step as WizardStep]}
              </div>
              {step < 6 && (
                <div className={cn(
                  "h-[1px] w-full mt-5",
                  step < currentStep ? "bg-primary" : "bg-gray-700"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-[#0d1425] text-white min-h-[500px] p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          {subtitle && <p className="text-gray-300">{subtitle}</p>}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {children}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <PrimaryButton
            onClick={goToPreviousStep}
            variant="outline"
            icon={<ArrowLeft className="w-4 h-4" />}
            disabled={currentStep === 1 || isPrevDisabled}
            className="border-gray-700 hover:bg-gray-800"
          >
            Previous
          </PrimaryButton>

          <PrimaryButton
            onClick={handleNext}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            disabled={isNextDisabled || currentStep === 6}
            className={currentStep === 6 ? "opacity-0 pointer-events-none" : ""}
          >
            Next
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;
