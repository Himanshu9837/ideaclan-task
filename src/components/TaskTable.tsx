import { format, formatDistanceToNow, isPast, isToday } from "date-fns";
import type { Task, TaskStatus } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";
import StatusBadge from "./StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskTableProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

function formatDueDate(dateStr: string | null) {
  if (!dateStr) return { text: "No date", isOverdue: false };
  const date = new Date(dateStr);
  const overdue = isPast(date) && !isToday(date);
  const distance = formatDistanceToNow(date, { addSuffix: true });
  const formatted = format(date, "MMM dd, yyyy");
  return { text: `${formatted} (${distance})`, isOverdue: overdue };
}

export default function TaskTable({ tasks, onEdit, onDelete }: TaskTableProps) {
  const { user } = useAuth();

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No tasks found</p>
        <p className="text-sm">Create a new task to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-heading font-semibold">Task Name</TableHead>
            <TableHead className="font-heading font-semibold">Status</TableHead>
            <TableHead className="font-heading font-semibold">By When</TableHead>
            <TableHead className="font-heading font-semibold">Assigned By</TableHead>
            <TableHead className="font-heading font-semibold">Assigned To</TableHead>
            <TableHead className="font-heading font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map(task => {
            const due = formatDueDate(task.due_date);
            const isSelfAssigned = task.assigned_by === task.assigned_to;
            const assignedByName = task.assigned_by === user?.id
              ? (isSelfAssigned ? "Self" : "You")
              : (task.assigned_by_name || "Unknown");
            const assignedToName = task.assigned_to === user?.id
              ? "You"
              : (task.assigned_to_name || "Unknown");

            return (
              <TableRow key={task.id} className="group">
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{task.title}</p>
                    {task.description && (
                      <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={task.status} />
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "text-sm",
                    due.isOverdue && task.status !== "completed"
                      ? "font-semibold text-status-overdue"
                      : "text-muted-foreground"
                  )}>
                    {due.text}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{assignedByName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{assignedToName}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(task)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (task.assigned_by === user?.id) && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
