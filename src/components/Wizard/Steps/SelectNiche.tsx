
import React, { useState } from 'react';
import WizardLayout from '../WizardLayout';
import { useWizard } from '@/contexts/WizardContext';
import { Input } from '@/components/ui/input';
import { 
  Briefcase, 
  Monitor, 
  Palette, 
  Globe, 
  Dumbbell, 
  Utensils, 
  Plane, 
  GraduationCap,
  ShoppingBag,
  Gamepad,
  Camera,
  Film
} from 'lucide-react';
import { toast } from "sonner";

const MAX_CUSTOM_NICHE_LENGTH = 100;

interface NicheOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const nicheOptions: NicheOption[] = [
  { id: 'business', name: 'Business', icon: <Briefcase className="w-5 h-5" /> },
  { id: 'technology', name: 'Technology', icon: <Monitor className="w-5 h-5" /> },
  { id: 'art-design', name: 'Art & Design', icon: <Palette className="w-5 h-5" /> },
  { id: 'seo-marketing', name: 'SEO & Marketing', icon: <Globe className="w-5 h-5" /> },
  { id: 'fitness', name: 'Fitness', icon: <Dumbbell className="w-5 h-5" /> },
  { id: 'food-cooking', name: 'Food & Cooking', icon: <Utensils className="w-5 h-5" /> },
  { id: 'travel', name: 'Travel', icon: <Plane className="w-5 h-5" /> },
  { id: 'education', name: 'Education', icon: <GraduationCap className="w-5 h-5" /> },
  { id: 'fashion', name: 'Fashion', icon: <ShoppingBag className="w-5 h-5" /> },
  { id: 'gaming', name: 'Gaming', icon: <Gamepad className="w-5 h-5" /> },
  { id: 'photography', name: 'Photography', icon: <Camera className="w-5 h-5" /> },
  { id: 'entertainment', name: 'Entertainment', icon: <Film className="w-5 h-5" /> },
];

const SelectNiche: React.FC = () => {
  const { wizardData, updateWizardData, goToNextStep } = useWizard();
  const [customNiche, setCustomNiche] = useState(wizardData.niche || '');
  const [selectedNicheId, setSelectedNicheId] = useState<string | null>(
    wizardData.niche ? 
      nicheOptions.find(option => option.name === wizardData.niche)?.id || null 
      : null
  );

  const handleNicheSelect = (option: NicheOption) => {
    setSelectedNicheId(option.id);
    setCustomNiche(option.name);
    updateWizardData({ niche: option.name });
  };

  const handleCustomNicheChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value.length <= MAX_CUSTOM_NICHE_LENGTH) {
      setCustomNiche(value);
      setSelectedNicheId(null);
      updateWizardData({ niche: value });
    } else {
      toast.error(`Niche cannot exceed ${MAX_CUSTOM_NICHE_LENGTH} characters`);
    }
  };

  const handleNextStep = () => {
    if (!customNiche.trim()) {
      toast.error("Please enter or select a content niche");
      return;
    }
    
    updateWizardData({ niche: customNiche });
    goToNextStep();
  };

  return (
    <WizardLayout 
      title="Select Your Niche" 
      subtitle="Choose the category that best fits your content"
      onNext={handleNextStep}
      isNextDisabled={!customNiche.trim()}
    >
      <div className="py-6 space-y-6">
        <div>
          <label htmlFor="custom-niche" className="block text-gray-200 mb-2 text-lg">
            Enter your content niche:
          </label>
          <Input
            id="custom-niche"
            className="w-full bg-[#0f1b33] border-[#1e2b45] text-white"
            value={customNiche}
            onChange={handleCustomNicheChange}
            placeholder="e.g., Digital Marketing, Content Creation, Product Reviews"
            maxLength={MAX_CUSTOM_NICHE_LENGTH}
          />
        </div>

        <div>
          <p className="text-gray-300 mb-3">Or quickly select from common niches:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {nicheOptions.map((option) => (
              <button
                key={option.id}
                className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                  selectedNicheId === option.id
                    ? "bg-primary text-white"
                    : "bg-[#0f1b33] text-gray-200 hover:bg-[#1a2742]"
                }`}
                onClick={() => handleNicheSelect(option)}
              >
                <span className="text-primary-foreground">{option.icon}</span>
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </WizardLayout>
  );
};

export default SelectNiche;
