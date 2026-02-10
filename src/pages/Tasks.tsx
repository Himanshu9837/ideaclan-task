import { useState } from "react";
import { useTasks, type Task, type TaskStatus } from "@/hooks/useTasks";
import TaskTable from "@/components/TaskTable";
import TaskDialog from "@/components/TaskDialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function Tasks() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks(statusFilter);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      if (editingTask) {
        await updateTask.mutateAsync({ id: editingTask.id, ...data });
        toast.success("Task updated");
      } else {
        await createTask.mutateAsync(data);
        toast.success("Task created");
      }
      setDialogOpen(false);
      setEditingTask(null);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask.mutateAsync(id);
      toast.success("Task deleted");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">My Tasks</h1>
          <p className="text-muted-foreground">Tasks assigned to you or created by you</p>
        </div>
        <Button onClick={() => { setEditingTask(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
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

      <TaskTable tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />

      <TaskDialog
        open={dialogOpen}
        onOpenChange={v => { setDialogOpen(v); if (!v) setEditingTask(null); }}
        task={editingTask}
        onSubmit={handleSubmit}
        isSubmitting={createTask.isPending || updateTask.isPending}
      />
    </div>
  );
}
