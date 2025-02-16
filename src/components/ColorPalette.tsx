import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useFirebaseColors } from "@/hooks/useFirebaseColors";

interface ColorPaletteProps {
  onColorSelect?: (color: string) => void;
  selectedColor?: string;
  colorCounts?: { [key: string]: number };
}

const ColorPalette = ({
  onColorSelect = () => {},
  selectedColor = "",
  colorCounts = {},
}: ColorPaletteProps) => {
  const { colors, loading } = useFirebaseColors();
  const [activeColor, setActiveColor] = useState(selectedColor);

  if (loading) {
    return <div>Loading colors...</div>;
  }

  const handleColorClick = (color: string) => {
    setActiveColor(color);
    onColorSelect(color);
  };

  return (
    <div className="flex gap-4">
      {colors.map((color) => (
        <button
          key={color.name}
          onClick={() => handleColorClick(color.name)}
          className={cn(
            "px-4 py-2 rounded-lg text-white transition-transform",
            activeColor === color.name && "ring-2 ring-offset-2 ring-gray-400",
          )}
          style={{ backgroundColor: color.hex }}
        >
          {color.label} ({colorCounts[color.name] || 0})
        </button>
      ))}
    </div>
  );
};

export default ColorPalette;
