export interface Employee {
  id: string;
  name: string;
  username: string;
  password: string;
  leavePackage?: {
    personalLeavesPerMonth: number;
    holidaysPerMonth: number;
    sickLeavesPerYear: number;
  };
}

export interface ColorTask {
  id?: string;
  name: string;
  label: string;
  hex: string;
}

export interface Holiday {
  id?: string;
  date: Date;
  employeeId: string;
  type: "vacation" | "sick" | "personal";
}

export interface Schedule {
  id?: string;
  employeeId: string;
  hour: number;
  color: string;
  date: string;
}
