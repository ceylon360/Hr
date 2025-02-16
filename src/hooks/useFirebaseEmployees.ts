import { useState, useEffect } from "react";
import { Employee } from "@/types/employee";
import {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
} from "@/lib/db";

export const useFirebaseEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data as Employee[]);
      } catch (err) {
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const add = async (employee: Omit<Employee, "id">) => {
    try {
      await addEmployee(employee);
      const updatedEmployees = await getEmployees();
      setEmployees(updatedEmployees as Employee[]);
    } catch (err) {
      setError("Failed to add employee");
    }
  };

  const update = async (employee: Employee) => {
    try {
      await updateEmployee(employee.id, employee);
      const updatedEmployees = await getEmployees();
      setEmployees(updatedEmployees as Employee[]);
    } catch (err) {
      setError("Failed to update employee");
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteEmployee(id);
      const updatedEmployees = await getEmployees();
      setEmployees(updatedEmployees as Employee[]);
    } catch (err) {
      setError("Failed to delete employee");
    }
  };

  return {
    employees,
    loading,
    error,
    addEmployee: add,
    updateEmployee: update,
    removeEmployee: remove,
  };
};
