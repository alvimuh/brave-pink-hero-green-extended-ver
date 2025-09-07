import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Palette } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const [inputValue, setInputValue] = useState(color);

  // Preset colors with labels
  const presetColors = [
    { color: "#f782c3", label: "Brave" },
    { color: "#4ecdc4", label: "Teal" },
    { color: "#45b7d1", label: "Blue" },
    { color: "#96ceb4", label: "Green" },
  ];

  const handleColorChange = (newColor: string) => {
    setInputValue(newColor);
    onChange(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      onChange(value);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-3 glass-button h-12"
        >
          <div
            className="w-6 h-6 rounded-md border-2 border-white/20 shadow-md"
            style={{ backgroundColor: color }}
          />
          <span className="font-medium">{color.toUpperCase()}</span>
          <Palette className="w-4 h-4 ml-auto opacity-60" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 glass border-glass-border">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Custom Color
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="#000000"
                className="font-mono"
              />
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-12 h-10 rounded-md border border-input cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Preset Colors
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor.color}
                  onClick={() => handleColorChange(presetColor.color)}
                  className={`
                    w-full h-12 rounded-lg border-2 transition-all hover:scale-110
                    ${
                      color === presetColor.color
                        ? "border-white shadow-lg ring-2 ring-primary"
                        : "border-white/20 hover:border-white/40"
                    }
                  `}
                  style={{ backgroundColor: presetColor.color }}
                  aria-label={`Select color ${presetColor.label}`}
                >
                  {presetColor.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
