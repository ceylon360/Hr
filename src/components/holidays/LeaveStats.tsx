import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LeaveStatsProps {
  employeeId: string;
  holidays: Array<{
    date: Date;
    employeeId: string;
    type: "vacation" | "sick" | "personal";
  }>;
  employees: Array<{ id: string; name: string }>;
}

export default function LeaveStats({
  employeeId,
  holidays,
  employees,
}: LeaveStatsProps) {
  const employeeName = employees.find((emp) => emp.id === employeeId)?.name;

  const stats = holidays
    .filter((h) => h.employeeId === employeeId)
    .reduce(
      (acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Leave Statistics - {employeeName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Vacation Days</p>
            <p className="text-2xl font-bold">{stats.vacation || 0}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Sick Days</p>
            <p className="text-2xl font-bold">{stats.sick || 0}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Personal Days</p>
            <p className="text-2xl font-bold">{stats.personal || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
