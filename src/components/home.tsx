import React, { useState, useEffect } from "react";
import { useFirebaseSchedule } from "@/hooks/useFirebaseSchedule";
import { useFirebaseColors } from "@/hooks/useFirebaseColors";
import ColorPalette from "./ColorPalette";
import ScheduleGrid from "./ScheduleGrid";

const Home = () => {
  const [selectedColor, setSelectedColor] = useState("");
  const { colors: colorTasks } = useFirebaseColors();
  const [selectedDate] = useState(new Date());
  const { schedules, loading, error, updateCell } =
    useFirebaseSchedule(selectedDate);

  // Convert schedules to grid format
  const gridColors = Array(5)
    .fill([])
    .map(() => Array(9).fill(""));
  schedules.forEach((schedule) => {
    const employeeIndex = parseInt(schedule.employeeId) - 1;
    if (employeeIndex >= 0 && employeeIndex < 5) {
      gridColors[employeeIndex][schedule.hour] = schedule.color;
    }
  });
  const [colorCounts, setColorCounts] = useState<{ [key: string]: number }>({});

  // Initialize color counts when colorTasks change
  useEffect(() => {
    const initialCounts = {};
    colorTasks.forEach((task) => {
      initialCounts[task.name] = 0;
    });
    setColorCounts(initialCounts);
  }, [colorTasks]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleCellClick = async (
    employee: number,
    hour: number,
    _color: string,
  ) => {
    const selectedTask = colorTasks.find((task) => task.name === selectedColor);
    const newColor = selectedTask?.hex || "";

    await updateCell((employee + 1).toString(), hour, newColor);
  };

  // Update color counts whenever gridColors changes
  useEffect(() => {
    const counts = { ...colorCounts };
    // Reset all counts
    Object.keys(counts).forEach((key) => {
      counts[key] = 0;
    });

    gridColors.forEach((row) => {
      row.forEach((color) => {
        const task = colorTasks.find((t) => t.hex === color);
        if (task) {
          counts[task.name]++;
        }
      });
    });

    setColorCounts(counts);
    // Color counts are calculated on the fly, no need to save
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
