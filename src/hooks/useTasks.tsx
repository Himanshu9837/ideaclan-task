import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  due_date: string | null;
  assigned_by: string;
  assigned_to: string;
  created_at: string;
  updated_at: string;
  assigned_by_name?: string;
  assigned_to_name?: string;
}

export function useTasks(statusFilter?: TaskStatus | "all") {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks", statusFilter, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data: tasks, error } = await query;
      if (error) throw error;

      // Fetch profile names for all referenced users
      const userIds = [...new Set(tasks.flatMap(t => [t.assigned_by, t.assigned_to]))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.full_name || p.email]) ?? []);

      return tasks.map(t => ({
        ...t,
        description: t.description ?? "",
        due_date: t.due_date ?? null,
        assigned_by_name: profileMap.get(t.assigned_by) || "Unknown",
        assigned_to_name: profileMap.get(t.assigned_to) || "Unknown",
      })) as Task[];
    },
    enabled: !!user,
  });

  const createTask = useMutation({
    mutationFn: async (task: {
      title: string;
      description?: string;
      status?: TaskStatus;
      due_date?: string | null;
      assigned_to: string;
    }) => {
      const { data, error } = await supabase.from("tasks").insert({
        ...task,
        assigned_by: user!.id,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<{
      title: string;
      description: string;
      status: TaskStatus;
      due_date: string | null;
      assigned_to: string;
    }>) => {
      const { data, error } = await supabase.from("tasks").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return { tasks: tasksQuery.data ?? [], isLoading: tasksQuery.isLoading, error: tasksQuery.error, createTask, updateTask, deleteTask };
}

export function useProfiles() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, full_name, email");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}
