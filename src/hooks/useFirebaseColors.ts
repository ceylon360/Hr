import { useState, useEffect } from "react";
import { ColorTask } from "@/types/schema";
import { getColorTasks } from "@/lib/db";

export const useFirebaseColors = () => {
  const [colors, setColors] = useState<ColorTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadColors = async () => {
      try {
        const colorTasks = await getColorTasks();
        setColors(colorTasks as ColorTask[]);
      } catch (err) {
        setError("Failed to load colors");
      } finally {
        setLoading(false);
      }
    };
    loadColors();
  }, []);

  return { colors, loading, error };
};
