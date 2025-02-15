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

export interface EmployeeBase {
  id: string;
  name: string;
  username: string;
  password: string;
}
