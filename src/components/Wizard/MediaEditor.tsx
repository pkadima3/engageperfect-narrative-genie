
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, RotateCw, RotateCcw, Crop, Type, RefreshCw, 
  Save, ChevronLeft, ChevronRight, Image
} from 'lucide-react';
import PrimaryButton from '@/components/Buttons/PrimaryButton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { MediaType } from '@/contexts/WizardContext';
import { toast } from 'sonner';

interface MediaEditorProps {
  mediaUrl: string;
  mediaType: MediaType;
  onClose: () => void;
  onSave: (editedUrl: string) => void;
}

type Filter = 'none' | 'grayscale' | 'sepia' | 'invert' | 'blur' | 'brightness' | 'contrast';

const MediaEditor: React.FC<MediaEditorProps> = ({ 
  mediaUrl, 
  mediaType, 
  onClose, 
  onSave 
}) => {
  const [currentFilter, setCurrentFilter] = useState<Filter>('none');
  const [rotation, setRotation] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (mediaType === 'image') {
      const img = new Image();
      img.onload = () => {
        drawImageToCanvas(img);
      };
      img.src = mediaUrl;
      if (imageRef.current) {
        imageRef.current.src = mediaUrl;
      }
    } else if (mediaType === 'video' && videoRef.current) {
      videoRef.current.src = mediaUrl;
    }
  }, [mediaUrl, mediaType]);

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

  const applyFilter = (imageData: ImageData, filter: Filter) => {
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

  const handleFilterChange = (filter: Filter) => {
    setCurrentFilter(filter);
    if (mediaType === 'image' && imageRef.current) {
      drawImageToCanvas(imageRef.current);
    }
  };

  const handleRotate = (direction: 'clockwise' | 'counterclockwise') => {
    const newRotation = direction === 'clockwise' 
      ? (rotation + 90) % 360 
      : (rotation - 90 + 360) % 360;
    
    setRotation(newRotation);
    
    if (mediaType === 'image' && imageRef.current) {
      setTimeout(() => drawImageToCanvas(imageRef.current!), 0);
    }
  };

  const handleReset = () => {
    setCurrentFilter('none');
    setRotation(0);
    if (mediaType === 'image' && imageRef.current) {
      drawImageToCanvas(imageRef.current);
    }
  };

  const handleSave = () => {
    if (mediaType === 'image') {
      if (!canvasRef.current) return;
      
      try {
        const editedImageUrl = canvasRef.current.toDataURL('image/jpeg');
        onSave(editedImageUrl);
      } catch (error) {
        console.error('Error saving edited image:', error);
        toast.error('Error saving edited image');
      }
    } else {
      // For video, we currently only support viewing, not editing
      onSave(mediaUrl);
    }
  };

  const filters: { name: Filter; label: string }[] = [
    { name: 'none', label: 'None' },
    { name: 'grayscale', label: 'Grayscale' },
    { name: 'sepia', label: 'Sepia' },
    { name: 'invert', label: 'Invert' },
    { name: 'blur', label: 'Blur' },
    { name: 'brightness', label: 'Brightness' },
    { name: 'contrast', label: 'Contrast' },
  ];

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="bg-[#0d1425] max-w-3xl w-[95vw] h-[90vh] p-0 border-gray-700 rounded-lg overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-3 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Edit Media</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Media display */}
            <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
              {mediaType === 'image' ? (
                <>
                  <img 
                    ref={imageRef}
                    src={mediaUrl}
                    alt="Edit preview"
                    className={cn(
                      "max-w-full max-h-full object-contain hidden",
                      {'grayscale': currentFilter === 'grayscale'},
                      {'sepia': currentFilter === 'sepia'},
                      {'invert': currentFilter === 'invert'},
                      {'blur': currentFilter === 'blur'},
                      {'brightness-125': currentFilter === 'brightness'},
                      {'contrast-125': currentFilter === 'contrast'}
                    )}
                    style={{ transform: `rotate(${rotation}deg)` }}
                  />
                  <canvas 
                    ref={canvasRef}
                    className="max-w-full max-h-full object-contain"
                  />
                </>
              ) : (
                <video 
                  ref={videoRef}
                  src={mediaUrl} 
                  controls
                  className="max-w-full max-h-full"
                />
              )}
            </div>
            
            {/* Filters */}
            <div className="p-4 border-t border-gray-700">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-200 mb-2">Filters:</h4>
                <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.name}
                      onClick={() => handleFilterChange(filter.name)}
                      className={cn(
                        "px-3 py-1.5 text-xs rounded-md transition-colors",
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
              
              {/* Controls */}
              <div className="flex justify-center gap-6">
                <button 
                  onClick={() => handleRotate('counterclockwise')}
                  className="flex flex-col items-center text-gray-300 hover:text-white"
                  disabled={mediaType === 'video'}
                >
                  <RotateCcw className="h-5 w-5 mb-1" />
                  <span className="text-xs">Counter</span>
                </button>
                
                <button 
                  onClick={() => handleRotate('clockwise')}
                  className="flex flex-col items-center text-gray-300 hover:text-white"
                  disabled={mediaType === 'video'}
                >
                  <RotateCw className="h-5 w-5 mb-1" />
                  <span className="text-xs">Rotate</span>
                </button>
                
                {false && ( // Disabled for now
                  <button className="flex flex-col items-center text-gray-300 hover:text-white">
                    <Crop className="h-5 w-5 mb-1" />
                    <span className="text-xs">Crop</span>
                  </button>
                )}
                
                {false && ( // Disabled for now
                  <button className="flex flex-col items-center text-gray-300 hover:text-white">
                    <Type className="h-5 w-5 mb-1" />
                    <span className="text-xs">Text</span>
                  </button>
                )}
                
                <button 
                  onClick={handleReset}
                  className="flex flex-col items-center text-gray-300 hover:text-white"
                >
                  <RefreshCw className="h-5 w-5 mb-1" />
                  <span className="text-xs">Reset</span>
                </button>
                
                <button 
                  onClick={handleSave}
                  className="flex flex-col items-center text-primary hover:text-primary-light"
                >
                  <Save className="h-5 w-5 mb-1" />
                  <span className="text-xs">Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaEditor;
