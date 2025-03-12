
import React, { useState } from 'react';
import WizardLayout from '../WizardLayout';
import { useWizard } from '@/contexts/WizardContext';
import { 
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";

// Custom TikTok icon since it's not in lucide-react
const TikTok = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

interface PlatformOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  directShareSupported: boolean;
}

const platformOptions: PlatformOption[] = [
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-6 h-6" />, directShareSupported: true },
  { id: 'twitter', name: 'Twitter', icon: <Twitter className="w-6 h-6" />, directShareSupported: true },
  { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-6 h-6" />, directShareSupported: true },
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-6 h-6" />, directShareSupported: false },
  { id: 'tiktok', name: 'TikTok', icon: <TikTok />, directShareSupported: false },
  { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-6 h-6" />, directShareSupported: false },
];

const SelectPlatform: React.FC = () => {
  const { wizardData, updateWizardData, goToNextStep } = useWizard();
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(wizardData.platform || null);

  const handlePlatformSelect = (option: PlatformOption) => {
    setSelectedPlatformId(option.id);
    updateWizardData({ platform: option.id });

    // Show info toast for platforms that don't support direct sharing
    if (!option.directShareSupported) {
      toast.info(
        `${option.name} doesn't allow direct sharing. You'll be able to share using the Web API or download the post to share manually.`,
        {
          duration: 5000,
          icon: <Info className="w-4 h-4" />,
          dismissible: true // Make the toast dismissible
        }
      );
    }
  };

  const handleNextStep = () => {
    if (!selectedPlatformId) {
      toast.error("Please select a social media platform", {
        dismissible: true
      });
      return;
    }
    
    goToNextStep();
  };

  return (
    <WizardLayout 
      title="Select Social Media Platform" 
      subtitle="Choose where you want to share your content"
      onNext={handleNextStep}
      isNextDisabled={!selectedPlatformId}
    >
      <div className="py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {platformOptions.map((option) => (
            <button
              key={option.id}
              className={cn(
                "flex flex-col items-center justify-center gap-3 p-6 rounded-lg transition-all border",
                selectedPlatformId === option.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-[#0f1b33] text-gray-200 hover:bg-[#1a2742] border-[#1e2b45]"
              )}
              onClick={() => handlePlatformSelect(option)}
            >
              <span className={cn(
                "text-4xl",
                selectedPlatformId === option.id ? "text-primary-foreground" : "text-gray-300"
              )}>
                {option.icon}
              </span>
              <span className="font-medium">{option.name}</span>
              {!option.directShareSupported && (
                <span className="text-xs bg-amber-600/20 text-amber-400 px-2 py-0.5 rounded">
                  Limited sharing
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-950/30 border border-blue-900/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-blue-300 font-medium">Platform Tips</h4>
              <p className="text-sm text-blue-200 mt-1">
                Choose the platform where you want to share your content. The caption generator will optimize your content based on the platform's best practices and character limits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </WizardLayout>
  );
};

export default SelectPlatform;
