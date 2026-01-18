import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateGoalRequest, type UpdateGoalRequest } from "@shared/routes";

export function useGoals(filters?: { category?: string; isCompleted?: 'true' | 'false' }) {
  const queryKey = [api.goals.list.path, filters];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Construct URL with query params
      const url = new URL(api.goals.list.path, window.location.origin);
      if (filters?.category) url.searchParams.append('category', filters.category);
      if (filters?.isCompleted) url.searchParams.append('isCompleted', filters.isCompleted);

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch goals");
      return api.goals.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateGoalRequest) => {
      const validated = api.goals.create.input.parse(data);
      const res = await fetch(api.goals.create.path, {
        method: api.goals.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create goal");
      return api.goals.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.goals.list.path] }),
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateGoalRequest) => {
      const validated = api.goals.update.input.parse(updates);
      const url = buildUrl(api.goals.update.path, { id });
      const res = await fetch(url, {
        method: api.goals.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update goal");
      return api.goals.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.goals.list.path] }),
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.goals.delete.path, { id });
      const res = await fetch(url, { 
        method: api.goals.delete.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to delete goal");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.goals.list.path] }),
  });
}
