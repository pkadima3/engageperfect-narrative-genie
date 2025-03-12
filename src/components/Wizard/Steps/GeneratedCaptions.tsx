
import React, { useState, useEffect } from 'react';
import WizardLayout from '../WizardLayout';
import { useWizard } from '@/contexts/WizardContext';
import { generateCaptions, type Caption } from '@/services/openaiService';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, Share2, Download, Image, MessageSquare } from 'lucide-react';
import { toast } from "sonner";
import PrimaryButton from '@/components/Buttons/PrimaryButton';

const GeneratedCaptions: React.FC = () => {
  const { wizardData } = useWizard();
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaption, setSelectedCaption] = useState<Caption | null>(null);
  const [showTextOverlay, setShowTextOverlay] = useState(false);

  const generateNewCaptions = async () => {
    setLoading(true);
    try {
      const newCaptions = await generateCaptions({
        tone: wizardData.tone || 'professional',
        platform: wizardData.platform || 'instagram',
        niche: wizardData.niche || 'general',
        goal: wizardData.goal || '',
        mediaType: wizardData.mediaType || 'image',
      });
      setCaptions(newCaptions);
      setSelectedCaption(newCaptions[0] || null);
    } catch (error) {
      toast.error('Failed to generate captions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateNewCaptions();
  }, []);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Caption copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy caption');
    }
  };

  const handleShare = async () => {
    if (!selectedCaption) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: selectedCaption.title,
          text: `${selectedCaption.content}\n\n${selectedCaption.callToAction}`,
          url: window.location.href,
        });
      } else {
        toast.info('Web Share API is not supported on this browser');
      }
    } catch (error) {
      toast.error('Failed to share caption');
    }
  };

  const handleDownload = () => {
    // Implement download functionality based on mediaType
    toast.info('Download functionality coming soon');
  };

  return (
    <WizardLayout
      title="Generated Captions"
      subtitle="Choose and customize your caption"
      isNextDisabled={!selectedCaption}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
        {/* Left side - Captions List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Choose Your Caption</h3>
            <PrimaryButton
              onClick={generateNewCaptions}
              icon={<RefreshCw className="w-4 h-4" />}
              loading={loading}
              variant="outline"
              size="sm"
            >
              Regenerate
            </PrimaryButton>
          </div>

          <div className="space-y-4">
            {captions.map((caption) => (
              <motion.div
                key={caption.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedCaption?.id === caption.id
                    ? 'bg-primary text-white ring-2 ring-primary'
                    : 'bg-[#0f1b33] hover:bg-[#1a2742] text-white'
                }`}
                onClick={() => setSelectedCaption(caption)}
                whileHover={{ scale: 1.01 }}
              >
                <h4 className="font-semibold mb-2">{caption.title}</h4>
                <p className="text-sm opacity-90 mb-2">{caption.content}</p>
                <p className="text-sm opacity-80 italic">{caption.callToAction}</p>
                <div className="flex justify-end mt-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(`${caption.content}\n\n${caption.callToAction}`);
                    }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side - Preview */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Preview</h3>
            <div className="flex gap-2">
              <PrimaryButton
                onClick={() => setShowTextOverlay(!showTextOverlay)}
                icon={<MessageSquare className="w-4 h-4" />}
                variant="outline"
                size="sm"
              >
                Toggle Text Overlay
              </PrimaryButton>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-[#0f1b33]">
            {wizardData.mediaUrl ? (
              <div className="relative">
                {wizardData.mediaType === 'image' ? (
                  <img
                    src={wizardData.mediaUrl}
                    alt="Preview"
                    className="w-full h-auto"
                  />
                ) : (
                  <video
                    src={wizardData.mediaUrl}
                    controls
                    className="w-full h-auto"
                  />
                )}
                {showTextOverlay && selectedCaption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60 text-white">
                    <p className="text-sm">{selectedCaption.content}</p>
                    <p className="text-xs mt-2 opacity-80">{selectedCaption.callToAction}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square flex items-center justify-center">
                <Image className="w-12 h-12 opacity-50" />
              </div>
            )}
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <PrimaryButton
              onClick={handleShare}
              icon={<Share2 className="w-4 h-4" />}
              disabled={!selectedCaption}
            >
              Share
            </PrimaryButton>
            <PrimaryButton
              onClick={handleDownload}
              icon={<Download className="w-4 h-4" />}
              variant="outline"
              disabled={!selectedCaption}
            >
              Download
            </PrimaryButton>
          </div>
        </div>
      </div>
    </WizardLayout>
  );
};

export default GeneratedCaptions;
