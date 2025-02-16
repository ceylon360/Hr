import React, { useState, useEffect } from "react";
import LeaveStats from "./LeaveStats";
import { addHoliday, getHolidays } from "@/lib/db";
import { useFirebaseEmployees } from "@/hooks/useFirebaseEmployees";
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

interface HolidayCalendarProps {}

export default function HolidayCalendar() {
  const { employees } = useFirebaseEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    const loadHolidays = async () => {
      const data = await getHolidays();
      setHolidays(
        data.map((holiday) => ({
          ...holiday,
          employeeId: holiday.employeeId || "",
          type: holiday.type || "vacation",
        })),
      );
    };
    loadHolidays();
  }, []);
  const [leaveType, setLeaveType] = useState<"vacation" | "sick" | "personal">(
    "vacation",
  );

  const checkLeaveAvailability = (
    employeeId: string,
    type: string,
    dates: Date[],
  ) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee) return { available: false, message: "Employee not found" };

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get existing leaves for this month/year
    const existingLeaves = holidays.filter((h) => {
      const leaveDate = new Date(h.date);
      return (
        h.employeeId === employeeId &&
        h.type === type &&
        ((type === "sick" && leaveDate.getFullYear() === currentYear) ||
          (type !== "sick" &&
            leaveDate.getMonth() === currentMonth &&
            leaveDate.getFullYear() === currentYear))
      );
    });

    const existingCount = existingLeaves.length;
    const newLeavesCount = dates.length;
    const totalCount = existingCount + newLeavesCount;

    switch (type) {
      case "personal":
        if (totalCount > employee.leavePackage.personalLeavesPerMonth) {
          return {
            available: false,
            message: `Only ${employee.leavePackage.personalLeavesPerMonth - existingCount} personal leaves remaining this month`,
          };
        }
        break;
      case "vacation":
        if (totalCount > employee.leavePackage.holidaysPerMonth) {
          return {
            available: false,
            message: `Only ${employee.leavePackage.holidaysPerMonth - existingCount} holidays remaining this month`,
          };
        }
        break;
      case "sick":
        if (totalCount > employee.leavePackage.sickLeavesPerYear) {
          return {
            available: false,
            message: `Only ${employee.leavePackage.sickLeavesPerYear - existingCount} sick leaves remaining this year`,
          };
        }
        break;
    }

    return { available: true, message: "" };
  };

  const handleAddHoliday = async () => {
    if (!selectedEmployee || selectedDates.length === 0) return;

    const availability = checkLeaveAvailability(
      selectedEmployee,
      leaveType,
      selectedDates,
    );
    if (!availability.available) {
      alert(availability.message);
      return;
    }

    const newHolidays = selectedDates.map((date) => ({
      date,
      employeeId: selectedEmployee,
      type: leaveType,
    }));
    for (const holiday of newHolidays) {
      await addHoliday(holiday);
    }
    const data = await getHolidays();
    setHolidays(
      data.map((holiday) => ({
        ...holiday,
        employeeId: holiday.employeeId || "",
        type: holiday.type || "vacation",
      })),
    );
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
