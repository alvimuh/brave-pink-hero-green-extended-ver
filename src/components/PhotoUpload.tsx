import { useState, useCallback, useRef } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PhotoUploadProps {
  onImageLoad: (image: HTMLImageElement) => void;
}

export const PhotoUpload = ({ onImageLoad }: PhotoUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageLoad = useCallback(
    (file: File) => {
      setIsLoading(true);

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        setIsLoading(false);
        return;
      }

      const img = new Image();
      img.onload = () => {
        onImageLoad(img);
        setIsLoading(false);
        toast.success("Wuidih, gantengnya oyy!");
      };
      img.onerror = () => {
        toast.error("Failed to load image");
        setIsLoading(false);
      };
      img.src = URL.createObjectURL(file);
    },
    [onImageLoad]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleImageLoad(files[0]);
      }
    },
    [handleImageLoad]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleImageLoad(files[0]);
      }
    },
    [handleImageLoad]
  );

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center transition-all
        ${
          isDragging
            ? "border-primary bg-primary/10 scale-105"
            : "border-glass-border hover:border-primary/50"
        }
        ${isLoading ? "opacity-50 pointer-events-none" : ""}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isLoading}
        style={{ display: "none" }}
      />

      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-gradient-primary rounded-full">
          {isLoading ? (
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-white" />
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {isLoading ? "Loading..." : "Drop your image here"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse files
          </p>

          <Button
            variant="secondary"
            className="glass-button"
            disabled={isLoading}
            onClick={() => inputRef.current?.click()}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Choose File
          </Button>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        Supports: JPG, PNG, GIF, WebP
      </div>
    </div>
  );
};
