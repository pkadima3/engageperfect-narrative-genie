
import React from 'react';
import WizardLayout from '../WizardLayout';
import { useWizard } from '@/contexts/WizardContext';
import { UserPlus, DollarSign, Heart, BookOpen, Eye, Users } from 'lucide-react';
import { toast } from "sonner";

interface GoalOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const goalOptions: GoalOption[] = [
  { 
    id: 'grow-audience', 
    name: 'Grow Audience', 
    description: 'Expand your follower base and reach',
    icon: <UserPlus className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-green-400 to-green-500'
  },
  { 
    id: 'drive-sales', 
    name: 'Drive Sales', 
    description: 'Convert followers into customers',
    icon: <DollarSign className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-blue-400 to-blue-500'
  },
  { 
    id: 'boost-engagement', 
    name: 'Boost Engagement', 
    description: 'Increase likes, comments and shares',
    icon: <Heart className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-orange-400 to-orange-500'
  },
  { 
    id: 'share-knowledge', 
    name: 'Share Knowledge', 
    description: 'Educate and provide value',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-purple-400 to-purple-500'
  },
  { 
    id: 'brand-awareness', 
    name: 'Brand Awareness', 
    description: 'Increase visibility and recognition',
    icon: <Eye className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-pink-400 to-pink-500'
  },
  { 
    id: 'build-community', 
    name: 'Build Community', 
    description: 'Foster relationships with followers',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-gradient-to-br from-yellow-400 to-yellow-500'
  },
];

const SelectGoal: React.FC = () => {
  const { wizardData, updateWizardData } = useWizard();
  
  const handleGoalSelect = (option: GoalOption) => {
    updateWizardData({ goal: option.name });
    toast.success(`Goal set to ${option.name}`);
  };

  return (
    <WizardLayout 
      title="Select Your Goal" 
      subtitle="What do you want to achieve with this content?"
      isNextDisabled={!wizardData.goal}
    >
      <div className="py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goalOptions.map((option) => (
            <button
              key={option.id}
              className={`group relative flex flex-col items-center p-6 rounded-xl transition-all ${
                wizardData.goal === option.name
                  ? `${option.color} text-white ring-2 ring-white/30`
                  : "bg-[#0f1b33] hover:bg-[#1a2742] text-white"
              }`}
              onClick={() => handleGoalSelect(option)}
            >
              {wizardData.goal === option.name && (
                <div className="absolute top-2 right-2 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                  Selected
                </div>
              )}
              <div className={`rounded-full p-3 mb-3 ${
                wizardData.goal === option.name
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
          Select the primary goal for your content
        </p>
      </div>
    </WizardLayout>
  );
};

export default SelectGoal;
