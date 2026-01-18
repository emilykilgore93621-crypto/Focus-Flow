import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateDailyFocusRequest } from "@shared/routes";

export function useDailyFocus() {
  return useQuery({
    queryKey: [api.dailyFocus.getToday.path],
    queryFn: async () => {
      const res = await fetch(api.dailyFocus.getToday.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch daily focus");
      
      const data = await res.json();
      // Handle nullable response properly
      if (data === null) return null;
      
      return api.dailyFocus.getToday.responses[200].parse(data);
    },
  });
}

export function useUpsertDailyFocus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateDailyFocusRequest) => {
      const validated = api.dailyFocus.upsert.input.parse(data);
      const res = await fetch(api.dailyFocus.upsert.path, {
        method: api.dailyFocus.upsert.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to save daily focus");
      return api.dailyFocus.upsert.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.dailyFocus.getToday.path] }),
  });
}
