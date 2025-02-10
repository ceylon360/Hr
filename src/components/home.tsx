import React, { useState, useEffect } from "react";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/storage";
import ColorPalette from "./ColorPalette";
import ScheduleGrid from "./ScheduleGrid";

const Home = () => {
  const [selectedColor, setSelectedColor] = useState("green");
  const [gridColors, setGridColors] = useState<string[][]>(
    loadFromLocalStorage("gridColors") ||
      Array(5)
        .fill([])
        .map(() => Array(9).fill("")),
  );
  const [colorCounts, setColorCounts] = useState<{ [key: string]: number }>(
    loadFromLocalStorage("colorCounts") || {
      green: 0,
      blue: 0,
      red: 0,
      yellow: 0,
      purple: 0,
      gray: 0,
    },
  );

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleCellClick = (employee: number, hour: number, _color: string) => {
    const newColor =
      selectedColor === "green"
        ? "#22c55e"
        : selectedColor === "blue"
          ? "#3b82f6"
          : selectedColor === "red"
            ? "#ef4444"
            : selectedColor === "yellow"
              ? "#eab308"
              : selectedColor === "purple"
                ? "#a855f7"
                : selectedColor === "gray"
                  ? "#6b7280"
                  : "";

    setGridColors((prev) => {
      const newGrid = prev.map((row) => [...row]);
      if (!newGrid[employee]) newGrid[employee] = [];
      newGrid[employee][hour] = newColor;
      saveToLocalStorage("gridColors", newGrid);
      return newGrid;
    });
  };

  // Update color counts whenever gridColors changes
  useEffect(() => {
    const counts = {
      green: 0,
      blue: 0,
      red: 0,
      yellow: 0,
      purple: 0,
      gray: 0,
    };

    gridColors.forEach((row) => {
      row.forEach((color) => {
        if (color === "#22c55e") counts.green++;
        else if (color === "#3b82f6") counts.blue++;
        else if (color === "#ef4444") counts.red++;
        else if (color === "#eab308") counts.yellow++;
        else if (color === "#a855f7") counts.purple++;
        else if (color === "#6b7280") counts.gray++;
      });
    });

    setColorCounts(counts);
    saveToLocalStorage("colorCounts", counts);
  }, [gridColors]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Employee Schedule Color Mapper
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a color from the palette below and click on the grid cells to
            assign time slots for each employee.
          </p>
        </div>

        <div className="flex justify-center">
          <ColorPalette
            onColorSelect={handleColorSelect}
            selectedColor={selectedColor}
            colorCounts={colorCounts}
          />
        </div>

        <div className="mt-8">
          <ScheduleGrid
            onCellClick={(employee, hour) =>
              handleCellClick(employee, hour, selectedColor)
            }
            gridColors={gridColors}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
