
import React from 'react';
import WizardLayout from '../WizardLayout';
import { useWizard } from '@/contexts/WizardContext';
import { 
  Smile,
  Heart,
  ThumbsUp,
  BookOpen,
  Zap,
  WandSparkles
} from 'lucide-react';
import { toast } from "sonner";

interface ToneOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const toneOptions: ToneOption[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Formal and business-oriented tone',
    icon: <ThumbsUp className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-blue-400 to-blue-500'
  },
  {
    id: 'friendly',
    name: 'Friendly',
    description: 'Warm and approachable tone',
    icon: <Smile className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-green-400 to-green-500'
  },
  {
    id: 'casual',
    name: 'Casual',
    description: 'Relaxed and conversational tone',
    icon: <Heart className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-pink-400 to-pink-500'
  },
  {
    id: 'educational',
    name: 'Educational',
    description: 'Informative and instructional tone',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-purple-400 to-purple-500'
  },
  {
    id: 'energetic',
    name: 'Energetic',
    description: 'Dynamic and exciting tone',
    icon: <Zap className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-yellow-400 to-yellow-500'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Imaginative and artistic tone',
    icon: <WandSparkles className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-orange-400 to-orange-500'
  }
];

const SelectTone: React.FC = () => {
  const { wizardData, updateWizardData } = useWizard();
  
  const handleToneSelect = (option: ToneOption) => {
    updateWizardData({ tone: option.name });
    toast.success(`Tone set to ${option.name}`);
  };

  return (
    <WizardLayout 
      title="Select Your Tone" 
      subtitle="Choose the tone that best matches your content style"
      isNextDisabled={!wizardData.tone}
    >
      <div className="py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {toneOptions.map((option) => (
            <button
              key={option.id}
              className={`group relative flex flex-col items-center p-6 rounded-xl transition-all ${
                wizardData.tone === option.name
                  ? `${option.color} text-white ring-2 ring-white/30`
                  : "bg-[#0f1b33] hover:bg-[#1a2742] text-white"
              }`}
              onClick={() => handleToneSelect(option)}
            >
              {wizardData.tone === option.name && (
                <div className="absolute top-2 right-2 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                  Selected
                </div>
              )}
              <div className={`rounded-full p-3 mb-3 ${
                wizardData.tone === option.name
                ? "bg-white/20" 
                : option.color
              }`}>
                {option.icon}
              </div>
              <h3 className="text-xl font-semibold mb-1">{option.name}</h3>
              <p className="text-sm opacity-80 text-center">{option.description}</p>
            </button>
          ))}
        </div>
        <p className="text-center text-gray-400 text-sm mt-4">
          Select a tone that aligns with your brand voice and target audience
        </p>
      </div>
    </WizardLayout>
  );
};

export default SelectTone;
