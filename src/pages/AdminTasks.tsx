import { useState } from "react";
import { useTasks, type TaskStatus } from "@/hooks/useTasks";
import TaskTable from "@/components/TaskTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminTasks() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const { tasks } = useTasks(statusFilter);

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">All Tasks (Admin)</h1>
        <p className="text-muted-foreground">View all tasks across the team</p>
      </div>

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TaskTable tasks={tasks} />
    </div>
  );
}
