import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { ListTodo, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import DashboardCharts from "@/components/DashboardCharts";
import { isPast, isToday } from "date-fns";

export default function Dashboard() {
  const { profile, isAdmin } = useAuth();
  const { tasks, isLoading } = useTasks();

  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "pending").length;
  const inProgress = tasks.filter(t => t.status === "in_progress").length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const overdue = tasks.filter(t =>
    t.due_date && isPast(new Date(t.due_date)) && !isToday(new Date(t.due_date)) && t.status !== "completed"
  ).length;

  const stats = [
    { label: "Total Tasks", value: total, icon: ListTodo, className: "text-primary" },
    { label: "Pending", value: pending, icon: Clock, className: "text-status-pending" },
    { label: "In Progress", value: inProgress, icon: ListTodo, className: "text-status-in-progress" },
    { label: "Completed", value: completed, icon: CheckCircle2, className: "text-status-completed" },
    { label: "Overdue", value: overdue, icon: AlertTriangle, className: "text-status-overdue" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Welcome back, {profile?.full_name || "there"} 👋
        </h1>
        <p className="text-muted-foreground">
          {isAdmin ? "Here's an overview of all tasks across your team." : "Here's an overview of your tasks."}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map(stat => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${stat.className}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold font-heading text-foreground">{isLoading ? "–" : stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts tasks={tasks} />
    </div>
  );
}
