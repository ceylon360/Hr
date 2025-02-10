import React, { useState } from "react";
import LeaveStats from "./LeaveStats";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/storage";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Holiday {
  date: Date;
  employeeId: string;
  type: "vacation" | "sick" | "personal";
}

interface HolidayCalendarProps {
  employees: { id: string; name: string }[];
}

export default function HolidayCalendar({
  employees = [],
}: HolidayCalendarProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    const savedHolidays = loadFromLocalStorage("holidays") || [];
    return savedHolidays.map((h) => ({
      ...h,
      date: new Date(h.date),
    }));
  });
  const [leaveType, setLeaveType] = useState<"vacation" | "sick" | "personal">(
    "vacation",
  );

  const handleAddHoliday = () => {
    if (!selectedEmployee || selectedDates.length === 0) return;
    const newHolidays = selectedDates.map((date) => ({
      date,
      employeeId: selectedEmployee,
      type: leaveType,
    }));
    const updatedHolidays = [...holidays, ...newHolidays];
    setHolidays(updatedHolidays);
    saveToLocalStorage("holidays", updatedHolidays);
    setSelectedDates([]);
  };

  const getEmployeeHolidays = (employeeId: string) => {
    return holidays.filter((h) => h.employeeId === employeeId);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Employee Holiday Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Select
              value={selectedEmployee}
              onValueChange={setSelectedEmployee}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={leaveType}
              onValueChange={(value: "vacation" | "sick" | "personal") =>
                setLeaveType(value)
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedEmployee && (
            <LeaveStats
              employeeId={selectedEmployee}
              holidays={holidays}
              employees={employees}
            />
          )}

          <div className="flex gap-6 mt-4">
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={setSelectedDates}
              className="rounded-md border"
            />

            <div className="space-y-4">
              <Button
                onClick={handleAddHoliday}
                disabled={!selectedEmployee || selectedDates.length === 0}
              >
                Add Holiday
              </Button>

              {selectedEmployee && (
                <div className="space-y-2">
                  <h3 className="font-medium">Scheduled Holidays</h3>
                  {getEmployeeHolidays(selectedEmployee).map((holiday, idx) => (
                    <div key={idx} className="flex gap-2 items-center text-sm">
                      <span>{holiday.date.toLocaleDateString()}</span>
                      <span className="text-muted-foreground">
                        ({holiday.type})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
