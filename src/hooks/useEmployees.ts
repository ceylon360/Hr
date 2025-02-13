import { useState, useEffect } from "react";
import { Employee } from "@/types/employee";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/storage";
import { DEFAULT_EMPLOYEES } from "@/constants";

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>(
    loadFromLocalStorage("employees") || DEFAULT_EMPLOYEES,
  );

  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newId = (
      Math.max(...employees.map((e) => parseInt(e.id)), 0) + 1
    ).toString();
    const updatedEmployees = [...employees, { ...employee, id: newId }];
    setEmployees(updatedEmployees);
    saveToLocalStorage("employees", updatedEmployees);
  };

  const updateEmployee = (employee: Employee) => {
    const updatedEmployees = employees.map((emp) =>
      emp.id === employee.id ? employee : emp,
    );
    setEmployees(updatedEmployees);
    saveToLocalStorage("employees", updatedEmployees);
  };

  const removeEmployee = (id: string) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== id);
    setEmployees(updatedEmployees);
    saveToLocalStorage("employees", updatedEmployees);
  };

  return {
    employees,
    addEmployee,
    updateEmployee,
    removeEmployee,
  };
};
