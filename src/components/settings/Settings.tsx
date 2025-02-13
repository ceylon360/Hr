import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/storage";
import { Trash2, Plus } from "lucide-react";

import { Employee, ColorTask } from "@/types/schema";

export default function Settings() {
  const [employees, setEmployees] = useState<Employee[]>(
    loadFromLocalStorage("employees") || [
      {
        id: "1",
        name: "Haridu",
        username: "haridu",
        password: "password123",
        leavePackage: {
          personalLeavesPerMonth: 4,
          holidaysPerMonth: 14,
          sickLeavesPerYear: 7,
        },
      },
      {
        id: "2",
        name: "Sudhara",
        username: "sudhara",
        password: "password123",
      },
      {
        id: "3",
        name: "Chamara",
        username: "chamara",
        password: "password123",
      },
      {
        id: "4",
        name: "Shehani",
        username: "shehani",
        password: "password123",
      },
      {
        id: "5",
        name: "Sandipani",
        username: "sandipani",
        password: "password123",
      },
    ],
  );

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    username: "",
    password: "",
    leavePackage: {
      personalLeavesPerMonth: 0,
      holidaysPerMonth: 0,
      sickLeavesPerYear: 0,
    },
  });

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [colors, setColors] = useState<ColorTask[]>(
    loadFromLocalStorage("colorTasks") || [
      { name: "green", label: "Customer", hex: "#22c55e" },
      { name: "blue", label: "Delivery", hex: "#3b82f6" },
      { name: "red", label: "Bakery", hex: "#ef4444" },
      { name: "yellow", label: "New", hex: "#eab308" },
      { name: "purple", label: "Operation", hex: "#a855f7" },
      { name: "gray", label: "Leave", hex: "#6b7280" },
    ],
  );
  const [newColorTask, setNewColorTask] = useState({
    name: "",
    label: "",
    hex: "#000000",
  });

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.username && newEmployee.password) {
      const newId = (
        Math.max(...employees.map((e) => parseInt(e.id)), 0) + 1
      ).toString();
      const updatedEmployees = [...employees, { ...newEmployee, id: newId }];
      setEmployees(updatedEmployees);
      saveToLocalStorage("employees", updatedEmployees);
      setNewEmployee({ name: "", username: "", password: "" });
    }
  };

  const handleRemoveEmployee = (id: string) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== id);
    setEmployees(updatedEmployees);
    saveToLocalStorage("employees", updatedEmployees);
  };

  const handleUpdateEmployee = (employee: Employee) => {
    const updatedEmployees = employees.map((emp) =>
      emp.id === employee.id ? employee : emp,
    );
    setEmployees(updatedEmployees);
    saveToLocalStorage("employees", updatedEmployees);
    setEditingEmployee(null);
  };

  const handleAddColorTask = () => {
    if (newColorTask.name && newColorTask.label && newColorTask.hex) {
      const updatedColors = [...colors, newColorTask];
      setColors(updatedColors);
      saveToLocalStorage("colorTasks", updatedColors);
      setNewColorTask({ name: "", label: "", hex: "#000000" });
    }
  };

  const handleRemoveColorTask = (index: number) => {
    const updatedColors = colors.filter((_, i) => i !== index);
    setColors(updatedColors);
    saveToLocalStorage("colorTasks", updatedColors);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Employee Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 mb-4">
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Name"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Username"
                  value={newEmployee.username}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, username: e.target.value })
                  }
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={newEmployee.password}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, password: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAddEmployee} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </div>
            <div className="space-y-2">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-md"
                >
                  {editingEmployee?.id === employee.id ? (
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <Input
                        value={editingEmployee.name}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            name: e.target.value,
                          })
                        }
                      />
                      <Input
                        value={editingEmployee.username}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            username: e.target.value,
                          })
                        }
                      />
                      <Input
                        type="password"
                        value={editingEmployee.password}
                        onChange={(e) =>
                          setEditingEmployee({
                            ...editingEmployee,
                            password: e.target.value,
                          })
                        }
                      />
                      <div className="col-span-3 grid grid-cols-3 gap-2 mt-4">
                        <div>
                          <label className="text-sm font-medium">
                            Personal Leaves/Month
                          </label>
                          <Input
                            type="number"
                            value={
                              editingEmployee.leavePackage
                                .personalLeavesPerMonth
                            }
                            onChange={(e) =>
                              setEditingEmployee({
                                ...editingEmployee,
                                leavePackage: {
                                  ...editingEmployee.leavePackage,
                                  personalLeavesPerMonth:
                                    parseInt(e.target.value) || 0,
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Holidays/Month
                          </label>
                          <Input
                            type="number"
                            value={
                              editingEmployee.leavePackage.holidaysPerMonth
                            }
                            onChange={(e) =>
                              setEditingEmployee({
                                ...editingEmployee,
                                leavePackage: {
                                  ...editingEmployee.leavePackage,
                                  holidaysPerMonth:
                                    parseInt(e.target.value) || 0,
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">
                            Sick Leaves/Year
                          </label>
                          <Input
                            type="number"
                            value={
                              editingEmployee.leavePackage.sickLeavesPerYear
                            }
                            onChange={(e) =>
                              setEditingEmployee({
                                ...editingEmployee,
                                leavePackage: {
                                  ...editingEmployee.leavePackage,
                                  sickLeavesPerYear:
                                    parseInt(e.target.value) || 0,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-span-3 flex gap-2 mt-2">
                        <Button
                          onClick={() => handleUpdateEmployee(editingEmployee)}
                          className="flex-1"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingEmployee(null)}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-gray-500">
                          Username: {employee.username}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingEmployee(employee)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEmployee(employee.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Color name (e.g., blue)"
                value={newColorTask.name}
                onChange={(e) =>
                  setNewColorTask({ ...newColorTask, name: e.target.value })
                }
              />
              <Input
                placeholder="Label (e.g., Delivery)"
                value={newColorTask.label}
                onChange={(e) =>
                  setNewColorTask({ ...newColorTask, label: e.target.value })
                }
              />
              <Input
                type="color"
                value={newColorTask.hex}
                onChange={(e) =>
                  setNewColorTask({ ...newColorTask, hex: e.target.value })
                }
                className="w-20"
              />
              <Button onClick={handleAddColorTask}>
                <Plus className="w-4 h-4 mr-2" />
                Add Color
              </Button>
            </div>
            <div className="space-y-2">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>
                      {color.label} ({color.name})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveColorTask(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
