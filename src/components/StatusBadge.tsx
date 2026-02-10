import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/hooks/useTasks";

const config: Record<TaskStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-status-pending-bg text-status-pending" },
  in_progress: { label: "In Progress", className: "bg-status-in-progress-bg text-status-in-progress" },
  completed: { label: "Completed", className: "bg-status-completed-bg text-status-completed" },
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, className } = config[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", className)}>
      {label}
    </span>
  );
}
