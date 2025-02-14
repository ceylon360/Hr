import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Employee } from "@/types";

export default function AdminPanel() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState("");

  const addEmployee = () => {
    if (!newEmployee) return;
    const newId = (
      Math.max(...employees.map((e) => parseInt(e.id)), 0) + 1
    ).toString();
    setEmployees([
      ...employees,
      {
        id: newId,
        name: newEmployee,
        username: newEmployee.toLowerCase(),
        password: "password123",
        leavePackage: {
          personalLeavesPerMonth: 4,
          holidaysPerMonth: 14,
          sickLeavesPerYear: 7,
        },
      },
    ]);
    setNewEmployee("");
  };

  const removeEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Manage Employees</h2>
        <div className="flex gap-2 mb-4">
          <Input
            value={newEmployee}
            onChange={(e) => setNewEmployee(e.target.value)}
            placeholder="New employee name"
          />
          <Button onClick={addEmployee}>Add</Button>
        </div>
        <div className="space-y-2">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <span>{employee.name}</span>
              <Button
                variant="destructive"
                onClick={() => removeEmployee(employee.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
