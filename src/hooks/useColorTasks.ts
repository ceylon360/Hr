import { useState } from "react";
import { ColorTask } from "@/types/color";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/storage";
import { DEFAULT_COLORS } from "@/constants";

export const useColorTasks = () => {
  const [colors, setColors] = useState<ColorTask[]>(
    loadFromLocalStorage("colorTasks") || DEFAULT_COLORS,
  );

  const addColorTask = (colorTask: ColorTask) => {
    const updatedColors = [...colors, colorTask];
    setColors(updatedColors);
    saveToLocalStorage("colorTasks", updatedColors);
  };

  const removeColorTask = (index: number) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    setColors(updatedColors);
    saveToLocalStorage("colorTasks", updatedColors);
  };

  return {
    colors,
    addColorTask,
    removeColorTask,
  };
};
