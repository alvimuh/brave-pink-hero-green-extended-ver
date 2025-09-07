import { useState, useRef, useEffect } from "react";
import { PhotoUpload } from "./PhotoUpload";
import { ColorPicker } from "./ColorPicker";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Palette, FileWarningIcon } from "lucide-react";
import { toast } from "sonner";

interface PhotoEditorProps {}

export const PhotoEditor = ({}: PhotoEditorProps) => {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(
    null
  );
  const [shadowColor, setShadowColor] = useState("#084f0e");
  const [highlightColor, setHighlightColor] = useState("#f782c3");
  const [intensity, setIntensity] = useState(90);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const applyDuotoneFilter = () => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = originalImage.naturalWidth;
    canvas.height = originalImage.naturalHeight;

    // Draw original image
    ctx.drawImage(originalImage, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Parse hex colors to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 };
    };

    const rgb1 = hexToRgb(shadowColor);
    const rgb2 = hexToRgb(highlightColor);

    // Apply improved duotone effect with intensity blending
    const intensityFactor = intensity / 100;

    for (let i = 0; i < data.length; i += 4) {
      const originalR = data[i];
      const originalG = data[i + 1];
      const originalB = data[i + 2];

      // Calculate luminance with improved weighting for skin tones
      const luminance =
        (originalR * 0.299 + originalG * 0.587 + originalB * 0.114) / 255;

      // Use a softer curve for more natural transitions
      const smoothLuminance = Math.pow(luminance, 0.8);

      // Interpolate between the two colors based on luminance
      const duotoneR = rgb1.r + (rgb2.r - rgb1.r) * smoothLuminance;
      const duotoneG = rgb1.g + (rgb2.g - rgb1.g) * smoothLuminance;
      const duotoneB = rgb1.b + (rgb2.b - rgb1.b) * smoothLuminance;

      // Blend duotone with original based on intensity
      data[i] = originalR + (duotoneR - originalR) * intensityFactor; // Red
      data[i + 1] = originalG + (duotoneG - originalG) * intensityFactor; // Green
      data[i + 2] = originalB + (duotoneB - originalB) * intensityFactor; // Blue
      // Alpha channel remains unchanged
    }

    // Put the modified image data back
    ctx.putImageData(imageData, 0, 0);
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (blob && downloadRef.current) {
        const url = URL.createObjectURL(blob);
        downloadRef.current.href = url;
        downloadRef.current.download = `duotone-filter-${Date.now()}.png`;
        downloadRef.current.click();
        URL.revokeObjectURL(url);
        toast.success("Image downloaded successfully!");
      }
    });
  };

  const resetImage = () => {
    setOriginalImage(null);
  };

  useEffect(() => {
    if (originalImage) {
      applyDuotoneFilter();
    }
  }, [originalImage, shadowColor, highlightColor, intensity]);

  return (
    <div className="min-h-screen bg-editor-bg px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Brave Pink Hero Green (Extended Version)
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Sayang banget, gerakan kreatif ujung-ujungnya konflik horizontal
            lagi.
          </p>
        </div>

        <div className="glass rounded-2xl p-6 h-fit max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Upload Photo
          </h2>
          {originalImage ? (
            <div className="bg-muted rounded-xl p-4 flex items-center justify-center min-h-[400px]">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[600px] rounded-lg shadow-2xl"
              />
            </div>
          ) : (
            <PhotoUpload onImageLoad={setOriginalImage} />
          )}

          {originalImage && (
            <>
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  Choose Colors
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Shadow Color
                    </label>
                    <ColorPicker
                      color={shadowColor}
                      onChange={setShadowColor}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Highlight Color
                    </label>
                    <ColorPicker
                      color={highlightColor}
                      onChange={setHighlightColor}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Effect Intensity: {intensity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue={intensity}
                    onMouseUp={(e) =>
                      setIntensity(Number((e.target as HTMLInputElement).value))
                    }
                    onTouchEnd={(e) =>
                      setIntensity(Number((e.target as HTMLInputElement).value))
                    }
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={downloadImage}
                  className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>

                <Button
                  onClick={resetImage}
                  variant="secondary"
                  className="glass-button"
                  size="lg"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Hidden download link */}
        <a ref={downloadRef} className="hidden" />
      </div>
    </div>
  );
};
