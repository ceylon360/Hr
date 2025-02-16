import { useState, useEffect } from "react";
import {
  updateSchedule,
  getScheduleForDate,
  subscribeToSchedule,
  ScheduleEntry,
} from "@/lib/db";

export const useFirebaseSchedule = (date: Date) => {
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToSchedule(date, (data) => {
      setSchedules(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [date]);

  const updateCell = async (
    employeeId: string,
    hour: number,
    color: string,
  ) => {
    try {
      await updateSchedule({
        employeeId,
        hour,
        color,
        date,
      });
    } catch (err) {
      setError("Failed to update schedule");
    }
  };

  return {
    schedules,
    loading,
    error,
    updateCell,
  };
};
