import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { Task } from "@/hooks/useTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isPast, isToday, startOfDay, format, subDays } from "date-fns";

const STATUS_COLORS = {
  pending: "hsl(38, 92%, 50%)",
  in_progress: "hsl(217, 91%, 60%)",
  completed: "hsl(142, 71%, 45%)",
};

export default function DashboardCharts({ tasks }: { tasks: Task[] }) {
  // Status distribution
  const statusData = [
    { name: "Pending", value: tasks.filter(t => t.status === "pending").length, color: STATUS_COLORS.pending },
    { name: "In Progress", value: tasks.filter(t => t.status === "in_progress").length, color: STATUS_COLORS.in_progress },
    { name: "Completed", value: tasks.filter(t => t.status === "completed").length, color: STATUS_COLORS.completed },
  ].filter(d => d.value > 0);

  // Tasks created per day (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const day = subDays(new Date(), 6 - i);
    const dayStr = format(startOfDay(day), "yyyy-MM-dd");
    const label = format(day, "EEE");
    const count = tasks.filter(t => format(new Date(t.created_at), "yyyy-MM-dd") === dayStr).length;
    return { name: label, tasks: count };
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Task Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {statusData.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No tasks yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-base">Tasks Created (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220, 14%, 90%)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis axisLine={false} tickLine={false} fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="tasks" fill="hsl(250, 60%, 52%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
