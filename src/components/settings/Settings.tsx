import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { useFirebaseEmployees } from "@/hooks/useFirebaseEmployees";
import { addColorTask, getColorTasks, deleteColorTask } from "@/lib/db";
import { Employee, ColorTask } from "@/types/schema";

export default function Settings() {
  const {
    employees,
    loading: employeesLoading,
    error: employeesError,
    addEmployee: addEmployeeToDb,
    updateEmployee: updateEmployeeInDb,
    removeEmployee: removeEmployeeFromDb,
  } = useFirebaseEmployees();

  const [colors, setColors] = useState<ColorTask[]>([]);

  useEffect(() => {
    const loadColors = async () => {
      const colorTasks = await getColorTasks();
      setColors(colorTasks as ColorTask[]);
    };
    loadColors();
  }, []);

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

  const [newColorTask, setNewColorTask] = useState({
    name: "",
    label: "",
    hex: "#000000",
  });

  const handleAddEmployee = async () => {
    if (newEmployee.name && newEmployee.username && newEmployee.password) {
      await addEmployeeToDb(newEmployee);
      setNewEmployee({
        name: "",
        username: "",
        password: "",
        leavePackage: {
          personalLeavesPerMonth: 0,
          holidaysPerMonth: 0,
          sickLeavesPerYear: 0,
        },
      });
    }
  };

  const handleRemoveEmployee = async (id: string) => {
    await removeEmployeeFromDb(id);
  };

  const handleUpdateEmployee = async (employee: Employee) => {
    await updateEmployeeInDb(employee);
    setEditingEmployee(null);
  };

  const handleAddColorTask = async () => {
    if (newColorTask.name && newColorTask.label && newColorTask.hex) {
      await addColorTask(newColorTask);
      const updatedColors = await getColorTasks();
      setColors(updatedColors as ColorTask[]);
      setNewColorTask({ name: "", label: "", hex: "#000000" });
    }
  };

  const handleRemoveColorTask = async (id: string) => {
    try {
      await deleteColorTask(id);
      const updatedColors = await getColorTasks();
      setColors(updatedColors as ColorTask[]);
    } catch (error) {
      console.error("Failed to remove color task:", error);
    }
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
              {colors.map((color) => (
                <div
                  key={color.id}
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
                    onClick={() => handleRemoveColorTask(color.id)}
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
