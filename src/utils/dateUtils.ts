import { isSameDay } from "date-fns";
import { Holiday } from "@/types/employee";

export const checkHoliday = (
  employeeId: string,
  date: Date,
  holidays: Holiday[],
) => {
  return holidays.some(
    (holiday) =>
      holiday.date &&
      isSameDay(new Date(holiday.date), date) &&
      holiday.employeeId === employeeId,
  );
};

export const formatHourLabel = (hour: number, isPM: boolean) => {
  return `${hour}${isPM ? "PM" : "AM"}`;
};
