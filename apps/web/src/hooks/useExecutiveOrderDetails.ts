// hooks/useExecutiveOrderDetails.ts
import { queryOptions, useQuery } from "@tanstack/react-query";
import { Tables } from "@/lib/database.types";
import { supabase } from "@/main";

export const useExecutiveOrderDetails = (id?: number) => {
  return useQuery<Pick<Tables<"executive_actions">, "full_html">, Error>({
    queryKey: ["executive_actions", id],
    enabled: !!id && id !== -1, // Only run the query if 'id' is truthy
    queryFn: async () => {
      if (!id) throw new Error("No ID provided");

      const { data, error } = await supabase
        .from("executive_actions")
        .select("full_html")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Pick<Tables<"executive_actions">, "full_html">;
    },
  });
};

export const executiveActionDetailsQueryOptions = (id?: number) =>
  queryOptions<Pick<Tables<"executive_actions">, "full_html">>({
    queryKey: ["executive_actions", id],
    enabled: !!id && id !== -1, // Only run the query if 'id' is truthy
    queryFn: async () => {
      if (!id) throw new Error("No ID provided");

      const { data, error } = await supabase
        .from("executive_actions")
        .select("full_html")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Pick<Tables<"executive_actions">, "full_html">;
    },
  });
