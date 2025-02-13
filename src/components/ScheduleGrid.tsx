import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Clock, CalendarIcon, Calendar as CalendarIcon2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import { loadFromLocalStorage } from "@/lib/storage";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ScheduleGridProps {
  onCellClick?: (employee: number, hour: number, color: string) => void;
  gridColors?: string[][];
}

const ScheduleGrid = ({
  onCellClick = () => {},
  gridColors = [],
}: ScheduleGridProps) => {
  const navigate = useNavigate();
  const [employees] = useState<string[]>(
    loadFromLocalStorage("employees") || [
      "Haridu",
      "Sudhara",
      "Chamara",
      "Shehani",
      "Sandipani",
    ],
  );
  const [hours, setHours] = useState([
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM",
  ]);

  const [date, setDate] = useState<Date>(new Date());

  const checkHoliday = (employeeId: string) => {
    const holidays = loadFromLocalStorage("holidays") || [];
    return holidays.some(
      (holiday: any) =>
        holiday.date &&
        isSameDay(new Date(holiday.date), date) &&
        holiday.employeeId === employeeId,
    );
  };

  const handleCellClick = (
    employeeIndex: number,
    hourIndex: number,
    color: string,
  ) => {
    const employeeId = (employeeIndex + 1).toString();
    if (checkHoliday(employeeId)) return;
    onCellClick(employeeIndex, hourIndex, color);
  };

  const addHourStart = () => {
    const firstHour = parseInt(hours[0]);
    const newHour = `${firstHour - 1}${hours[0].includes("AM") ? "AM" : "PM"}`;
    setHours([newHour, ...hours]);
  };

  const addHourEnd = () => {
    const lastHour = parseInt(hours[hours.length - 1]);
    const isLastPM = hours[hours.length - 1].includes("PM");
    const newHour = `${lastHour === 12 ? 1 : lastHour + 1}${isLastPM ? "PM" : "AM"}`;
    setHours([...hours, newHour]);
  };

  return (
    <div className="w-full overflow-x-auto bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="z-50">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-[240px] justify-start text-left font-normal")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/holidays")}
            variant="outline"
            size="sm"
            className="whitespace-nowrap"
          >
            <CalendarIcon2 className="w-4 h-4 mr-1" />
            Manage Holidays
          </Button>
          <Button
            onClick={addHourStart}
            variant="outline"
            size="sm"
            className="whitespace-nowrap"
          >
            <Clock className="w-4 h-4 mr-1" />
            Add Earlier Hour
          </Button>
          <Button
            onClick={addHourEnd}
            variant="outline"
            size="sm"
            className="whitespace-nowrap"
          >
            <Clock className="w-4 h-4 mr-1" />
            Add Later Hour
          </Button>
        </div>
      </div>

      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr>
            <th className="p-2 border border-gray-200 bg-gray-100">Employee</th>
            {hours.map((hour) => (
              <th
                key={hour}
                className="p-2 border border-gray-200 bg-gray-100 text-sm md:text-base"
              >
                {hour}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, employeeIndex) => {
            const employeeId = (employeeIndex + 1).toString();
            const hasHoliday = checkHoliday(employeeId);

            return (
              <tr key={employee}>
                <td className="p-2 border border-gray-200 font-medium text-sm md:text-base">
                  {employee}
                </td>
                {hours.map((_, hourIndex) => (
                  <td
                    key={hourIndex}
                    className={cn(
                      "p-2 border border-gray-200 cursor-pointer transition-colors duration-200 hover:bg-gray-50",
                      !gridColors[employeeIndex]?.[hourIndex] && "bg-gray-200",
                    )}
                    style={{
                      backgroundColor: hasHoliday
                        ? "#6b7280"
                        : gridColors[employeeIndex]?.[hourIndex] || "",
                    }}
                    onClick={() =>
                      handleCellClick(
                        employeeIndex,
                        hourIndex,
                        gridColors[employeeIndex]?.[hourIndex] || "",
                      )
                    }
                  >
                    &nbsp;
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleGrid;
