
import React, { useState, useRef } from 'react';
import { useWizard, MediaType } from '@/contexts/WizardContext';
import WizardLayout from '../WizardLayout';
import { Upload, Camera } from 'lucide-react';
import PrimaryButton from '@/components/Buttons/PrimaryButton';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const UploadMedia: React.FC = () => {
  const { wizardData, updateWizardData } = useWizard();
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    const mediaType: MediaType = file.type.startsWith('image/') 
      ? 'image' 
      : file.type.startsWith('video/') 
        ? 'video' 
        : 'text-only';
        
    const url = URL.createObjectURL(file);
    updateWizardData({ mediaUrl: url, mediaType });
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleTextOnlyClick = () => {
    updateWizardData({ mediaType: 'text-only', mediaUrl: null });
  };

  const isNextDisabled = !wizardData.mediaType;

  return (
    <WizardLayout 
      title="Welcome, User" 
      subtitle="Upload your media or capture directly to get human-like AI-powered captions."
      isNextDisabled={isNextDisabled}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload area */}
        <div 
          className={cn(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[240px]",
            dragActive ? "border-primary border-solid bg-primary/10" : "border-gray-600"
          )}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <Input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleChange}
          />
          
          <Upload className="w-12 h-12 text-blue-500 mb-4" />
          
          <p className="text-center text-gray-300 mb-2">
            Drag & drop your media here, or click to select
          </p>
          <p className="text-center text-gray-500 text-sm mb-6">
            Supports images and videos up to 50MB
          </p>
          
          <div className="w-full max-w-xs space-y-3">
            <PrimaryButton 
              onClick={handleUploadClick}
              className="w-full"
              icon={<Upload className="w-4 h-4" />}
            >
              Upload Media
            </PrimaryButton>
            
            <PrimaryButton
              variant="outline"
              className="w-full border-gray-700"
              icon={<Camera className="w-4 h-4" />}
            >
              Use Camera
            </PrimaryButton>
          </div>
        </div>
        
        {/* Preview area */}
        <div className="flex flex-col items-center justify-center border border-gray-700 rounded-lg min-h-[240px]">
          {wizardData.mediaUrl ? (
            wizardData.mediaType === 'image' ? (
              <img 
                src={wizardData.mediaUrl} 
                alt="Preview" 
                className="max-w-full max-h-full object-contain rounded"
              />
            ) : wizardData.mediaType === 'video' ? (
              <video 
                src={wizardData.mediaUrl} 
                controls 
                className="max-w-full max-h-full rounded"
              />
            ) : null
          ) : (
            <div className="text-center text-gray-400">
              <div className="w-12 h-12 bg-gray-800 rounded mx-auto mb-4"></div>
              <p>Media preview will appear here</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Text-only option */}
      <div className="mt-6 flex justify-center items-center">
        <span className="text-gray-400 px-3">or</span>
      </div>
      
      <div className="flex justify-center mt-3">
        <button 
          onClick={handleTextOnlyClick}
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
        >
          Create text-only caption
        </button>
      </div>
    </WizardLayout>
  );
};

export default UploadMedia;
