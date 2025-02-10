import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface ColorPaletteProps {
  onColorSelect?: (color: string) => void;
  selectedColor?: string;
  colorCounts?: { [key: string]: number };
}

const colors = [
  { name: "green", label: "Customer", hex: "#22c55e" },
  { name: "blue", label: "Delivery", hex: "#3b82f6" },
  { name: "red", label: "Bakery", hex: "#ef4444" },
  { name: "yellow", label: "New", hex: "#eab308" },
  { name: "purple", label: "Oparation", hex: "#a855f7" },
  { name: "gray", label: "Leave", hex: "#6b7280" },
];

const ColorPalette = ({
  onColorSelect = () => {},
  selectedColor = "green",
  colorCounts = {},
}: ColorPaletteProps) => {
  const [activeColor, setActiveColor] = useState(selectedColor);

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
