import { useState, useEffect } from "react";
import { addEmployee, deleteEmployee, getEmployees } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Employee } from "@/types/schema";

interface TimeSlot {
  id: string;
  hour: string;
}

export default function AdminPanel() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [newEmployee, setNewEmployee] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("");

  useEffect(() => {
    fetchEmployees();
    fetchTimeSlots();
  }, []);

  const fetchEmployees = async () => {
    const data = await getEmployees();
    setEmployees(data);
  };

  const fetchTimeSlots = async () => {
    const { data } = await supabase.from("time_slots").select("*");
    if (data) setTimeSlots(data);
  };

  const handleAddEmployee = async () => {
    if (!newEmployee) return;
    await addEmployee({
      name: newEmployee,
      username: newEmployee.toLowerCase(),
      password: "default123",
      leavePackage: {
        personalLeavesPerMonth: 2,
        holidaysPerMonth: 1,
        sickLeavesPerYear: 5,
      },
    });
    setNewEmployee("");
    fetchEmployees();
  };

  const removeEmployee = async (id: string) => {
    await deleteEmployee(id);
    fetchEmployees();
  };

  const addTimeSlot = async () => {
    if (!newTimeSlot) return;
    await supabase.from("time_slots").insert([{ hour: newTimeSlot }]);
    setNewTimeSlot("");
    fetchTimeSlots();
  };

  const removeTimeSlot = async (id: string) => {
    await supabase.from("time_slots").delete().eq("id", id);
    fetchTimeSlots();
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
          <Button onClick={handleAddEmployee}>Add</Button>
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

      <div>
        <h2 className="text-2xl font-bold mb-4">Manage Time Slots</h2>
        <div className="flex gap-2 mb-4">
          <Input
            value={newTimeSlot}
            onChange={(e) => setNewTimeSlot(e.target.value)}
            placeholder="New time slot (e.g., 9AM)"
          />
          <Button onClick={addTimeSlot}>Add</Button>
        </div>
        <div className="space-y-2">
          {timeSlots.map((slot) => (
            <div
              key={slot.id}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <span>{slot.hour}</span>
              <Button
                variant="destructive"
                onClick={() => removeTimeSlot(slot.id)}
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
