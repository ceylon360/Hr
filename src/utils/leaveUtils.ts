import { Employee, Holiday, LeaveType } from "@/types/employee";

export const checkLeaveAvailability = (
  employeeId: string,
  type: LeaveType,
  dates: Date[],
  holidays: Holiday[],
  employees: Employee[],
) => {
  const employee = employees.find((emp) => emp.id === employeeId);
  if (!employee?.leavePackage)
    return {
      available: false,
      message: "Employee not found or no leave package",
    };

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

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

  const { personalLeavesPerMonth, holidaysPerMonth, sickLeavesPerYear } =
    employee.leavePackage;

  switch (type) {
    case "personal":
      if (totalCount > personalLeavesPerMonth) {
        return {
          available: false,
          message: `Only ${personalLeavesPerMonth - existingCount} personal leaves remaining this month`,
        };
      }
      break;
    case "vacation":
      if (totalCount > holidaysPerMonth) {
        return {
          available: false,
          message: `Only ${holidaysPerMonth - existingCount} holidays remaining this month`,
        };
      }
      break;
    case "sick":
      if (totalCount > sickLeavesPerYear) {
        return {
          available: false,
          message: `Only ${sickLeavesPerYear - existingCount} sick leaves remaining this year`,
        };
      }
      break;
  }

  return { available: true, message: "" };
};
