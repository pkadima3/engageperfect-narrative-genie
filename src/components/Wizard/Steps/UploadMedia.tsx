
import React, { useState, useRef, useCallback } from 'react';
import { useWizard, MediaType } from '@/contexts/WizardContext';
import WizardLayout from '../WizardLayout';
import { Upload, Camera, FileType } from 'lucide-react';
import PrimaryButton from '@/components/Buttons/PrimaryButton';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import MediaEditor from '../MediaEditor';
import { toast } from 'sonner';

const UploadMedia: React.FC = () => {
  const { wizardData, updateWizardData } = useWizard();
  const [dragActive, setDragActive] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
    const maxSizeMB = 50;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
      toast.error(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }
    
    const mediaType: MediaType = file.type.startsWith('image/') 
      ? 'image' 
      : file.type.startsWith('video/') 
        ? 'video' 
        : 'text-only';
    
    if (mediaType === 'text-only') {
      toast.error('Unsupported file type. Please upload an image or video.');
      return;
    }
        
    const url = URL.createObjectURL(file);
    updateWizardData({ mediaUrl: url, mediaType });
    setShowEditor(true);
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleCameraClick = async () => {
    try {
      if (isCapturing) {
        stopCamera();
        return;
      }
      
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      streamRef.current = stream;
      
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (!cameraRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = cameraRef.current.videoWidth;
    canvas.height = cameraRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(cameraRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          updateWizardData({ mediaUrl: url, mediaType: 'image' });
          stopCamera();
          setShowEditor(true);
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const handleTextOnlyClick = () => {
    updateWizardData({ mediaType: 'text-only', mediaUrl: null });
  };

  const handleEditorClose = () => {
    setShowEditor(false);
  };

  const handleEditorSave = (editedUrl: string) => {
    updateWizardData({ mediaUrl: editedUrl });
    setShowEditor(false);
    toast.success('Media updated successfully');
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
        {!isCapturing ? (
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
                onClick={handleCameraClick}
              >
                Use Camera
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <div className="relative border border-gray-700 rounded-lg overflow-hidden min-h-[240px] flex flex-col items-center justify-center">
            <video 
              ref={cameraRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3">
              <PrimaryButton onClick={capturePhoto}>
                Capture Photo
              </PrimaryButton>
              <PrimaryButton 
                variant="outline"
                onClick={handleCameraClick}
                className="border-gray-700"
              >
                Cancel
              </PrimaryButton>
            </div>
          </div>
        )}
        
        {/* Preview area */}
        <div className="flex flex-col items-center justify-center border border-gray-700 rounded-lg min-h-[240px] relative overflow-hidden">
          {wizardData.mediaUrl ? (
            <>
              {wizardData.mediaType === 'image' ? (
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
              ) : null}
              
              {wizardData.mediaType && (
                <div className="absolute bottom-2 right-2">
                  <PrimaryButton
                    onClick={() => setShowEditor(true)}
                    size="sm"
                    className="bg-black/70 hover:bg-black/90"
                  >
                    Edit
                  </PrimaryButton>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-400">
              <div className="w-12 h-12 bg-gray-800 rounded mx-auto mb-4 flex items-center justify-center">
                <FileType className="w-6 h-6" />
              </div>
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

      {showEditor && wizardData.mediaUrl && (
        <MediaEditor
          mediaUrl={wizardData.mediaUrl}
          mediaType={wizardData.mediaType || 'image'}
          onClose={handleEditorClose}
          onSave={handleEditorSave}
        />
      )}
    </WizardLayout>
  );
};

export default UploadMedia;
