export interface LeavePackage {
  personalLeavesPerMonth: number;
  holidaysPerMonth: number;
  sickLeavesPerYear: number;
}

export interface Employee {
  id: string;
  name: string;
  username: string;
  password: string;
  leavePackage?: LeavePackage;
}

export type LeaveType = "vacation" | "sick" | "personal";

export interface Holiday {
  date: Date;
  employeeId: string;
  type: LeaveType;
}
