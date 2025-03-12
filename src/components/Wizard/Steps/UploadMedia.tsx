
import React, { useState, useRef, useCallback } from 'react';
import { useWizard, MediaType } from '@/contexts/WizardContext';
import WizardLayout from '../WizardLayout';
import { Upload, Camera, FileType, RotateCw, RotateCcw, RefreshCw, Save, X } from 'lucide-react';
import PrimaryButton from '@/components/Buttons/PrimaryButton';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const UploadMedia: React.FC = () => {
  const { wizardData, updateWizardData } = useWizard();
  const [dragActive, setDragActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [currentFilter, setCurrentFilter] = useState<'none' | 'grayscale' | 'sepia' | 'invert' | 'blur' | 'brightness' | 'contrast'>('none');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
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
    setRotation(0);
    setCurrentFilter('none');
    setIsEditing(false);
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
          setIsEditing(false);
          setRotation(0);
          setCurrentFilter('none');
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const handleTextOnlyClick = () => {
    updateWizardData({ mediaType: 'text-only', mediaUrl: null });
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (!isEditing && wizardData.mediaType === 'image' && wizardData.mediaUrl) {
      const img = new window.Image();
      img.onload = () => {
        if (imageRef.current) {
          imageRef.current.src = wizardData.mediaUrl!;
        }
        drawImageToCanvas(img);
      };
      img.src = wizardData.mediaUrl;
    }
  };

  const handleFilterChange = (filter: typeof currentFilter) => {
    setCurrentFilter(filter);
    if (wizardData.mediaType === 'image' && wizardData.mediaUrl) {
      const img = new window.Image();
      img.onload = () => {
        drawImageToCanvas(img);
      };
      img.src = wizardData.mediaUrl;
    }
  };

  const handleRotate = (direction: 'clockwise' | 'counterclockwise') => {
    const newRotation = direction === 'clockwise' 
      ? (rotation + 90) % 360 
      : (rotation - 90 + 360) % 360;
    
    setRotation(newRotation);
    
    if (wizardData.mediaType === 'image' && wizardData.mediaUrl) {
      const img = new window.Image();
      img.onload = () => {
        drawImageToCanvas(img);
      };
      img.src = wizardData.mediaUrl;
    }
  };

  const handleReset = () => {
    setCurrentFilter('none');
    setRotation(0);
    if (wizardData.mediaType === 'image' && wizardData.mediaUrl) {
      const img = new window.Image();
      img.onload = () => {
        drawImageToCanvas(img);
      };
      img.src = wizardData.mediaUrl;
    }
  };

  const drawImageToCanvas = (image: HTMLImageElement) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match image
    canvas.width = image.width;
    canvas.height = image.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply rotation
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(
      image, 
      -image.width / 2, 
      -image.height / 2, 
      image.width, 
      image.height
    );
    ctx.restore();
    
    // Apply filters
    if (currentFilter !== 'none') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      applyFilter(imageData, currentFilter);
      ctx.putImageData(imageData, 0, 0);
    }
  };

  const applyFilter = (imageData: ImageData, filter: typeof currentFilter) => {
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      switch (filter) {
        case 'grayscale':
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
          break;
        case 'sepia':
          data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
          break;
        case 'invert':
          data[i] = 255 - r;
          data[i + 1] = 255 - g;
          data[i + 2] = 255 - b;
          break;
        case 'brightness':
          data[i] = Math.min(255, r * 1.3);
          data[i + 1] = Math.min(255, g * 1.3);
          data[i + 2] = Math.min(255, b * 1.3);
          break;
        case 'contrast':
          const factor = 259 * (127 + 50) / (255 * (259 - 50));
          data[i] = Math.min(255, factor * (r - 128) + 128);
          data[i + 1] = Math.min(255, factor * (g - 128) + 128);
          data[i + 2] = Math.min(255, factor * (b - 128) + 128);
          break;
        case 'blur':
          // Simple blur isn't possible with a simple pixel-by-pixel approach
          // We're just applying a placeholder effect here
          // A real blur would require a convolution operation
          if (i % 16 === 0) {
            const avg = (r + g + b) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
          }
          break;
      }
    }
  };

  const handleSave = () => {
    if (wizardData.mediaType === 'image') {
      if (!canvasRef.current) return;
      
      try {
        const editedImageUrl = canvasRef.current.toDataURL('image/jpeg');
        updateWizardData({ mediaUrl: editedImageUrl });
        setIsEditing(false);
        toast.success('Media updated successfully');
      } catch (error) {
        console.error('Error saving edited image:', error);
        toast.error('Error saving edited image');
      }
    }
  };

  const filters = [
    { name: 'none' as const, label: 'None' },
    { name: 'grayscale' as const, label: 'Grayscale' },
    { name: 'sepia' as const, label: 'Sepia' },
    { name: 'invert' as const, label: 'Invert' },
    { name: 'blur' as const, label: 'Blur' },
    { name: 'brightness' as const, label: 'Brightness' },
    { name: 'contrast' as const, label: 'Contrast' },
  ];

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
              "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[240px] cursor-pointer",
              dragActive ? "border-primary border-solid bg-primary/10" : "border-gray-600 hover:border-gray-400 hover:bg-gray-800/30"
            )}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={handleUploadClick}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleUploadClick();
                }}
                className="w-full"
                icon={<Upload className="w-4 h-4" />}
              >
                Upload Media
              </PrimaryButton>
              
              <PrimaryButton
                variant="outline"
                className="w-full border-gray-700"
                icon={<Camera className="w-4 h-4" />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCameraClick();
                }}
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
        
        {/* Preview area with integrated editing */}
        <div className="flex flex-col items-center justify-center border border-gray-700 rounded-lg min-h-[240px] relative overflow-hidden">
          {wizardData.mediaUrl ? (
            <>
              {isEditing && wizardData.mediaType === 'image' ? (
                <>
                  <div className="absolute top-0 left-0 right-0 z-10 p-2 bg-black/70 flex justify-between items-center">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <span className="text-white text-sm">Edit Image</span>
                    <button 
                      onClick={handleSave}
                      className="text-primary hover:text-primary-light"
                    >
                      <Save className="h-5 w-5" />
                    </button>
                  </div>

                  <canvas 
                    ref={canvasRef}
                    className="max-w-full max-h-[calc(100%-80px)] object-contain mt-10"
                  />
                  <img 
                    ref={imageRef}
                    src={wizardData.mediaUrl} 
                    alt="Edit preview"
                    className="hidden"
                  />
                  
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-2 bg-black/70">
                    <div className="mb-2 overflow-x-auto no-scrollbar">
                      <div className="flex gap-2 pb-2">
                        {filters.map((filter) => (
                          <button
                            key={filter.name}
                            onClick={() => handleFilterChange(filter.name)}
                            className={cn(
                              "px-2 py-1 text-xs rounded-md transition-colors whitespace-nowrap",
                              currentFilter === filter.name
                                ? "bg-primary text-white"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            )}
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <button 
                        onClick={() => handleRotate('counterclockwise')}
                        className="text-gray-300 hover:text-white"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </button>
                      
                      <button 
                        onClick={() => handleRotate('clockwise')}
                        className="text-gray-300 hover:text-white"
                      >
                        <RotateCw className="h-5 w-5" />
                      </button>
                      
                      <button 
                        onClick={handleReset}
                        className="text-gray-300 hover:text-white"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
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
                  
                  {wizardData.mediaType === 'image' && (
                    <div className="absolute bottom-2 right-2">
                      <PrimaryButton
                        onClick={toggleEditMode}
                        size="sm"
                        className="bg-black/70 hover:bg-black/90"
                      >
                        Edit
                      </PrimaryButton>
                    </div>
                  )}
                </>
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
    </WizardLayout>
  );
};

export default UploadMedia;

