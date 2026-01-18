import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useResources(filters?: { category?: string; type?: string; search?: string }) {
  const queryKey = [api.resources.list.path, filters];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const url = new URL(api.resources.list.path, window.location.origin);
      if (filters?.category) url.searchParams.append('category', filters.category);
      if (filters?.type) url.searchParams.append('type', filters.type);
      if (filters?.search) url.searchParams.append('search', filters.search);

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch resources");
      return api.resources.list.responses[200].parse(await res.json());
    },
  });
}

export function useResource(id: number) {
  return useQuery({
    queryKey: [api.resources.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.resources.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch resource");
      return api.resources.get.responses[200].parse(await res.json());
    },
  });
}
