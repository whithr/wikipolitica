import { queryOptions, useQuery } from "@tanstack/react-query";
import { Tables } from "@/lib/database.types";
import { supabase } from "@/main";

export const useExecutiveOrdersData = () => {
  return useQuery<Tables<"executive_actions">[]>({
    queryKey: ["executive_actions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("executive_actions")
        .select(
          "id, categories, description_html, guid, inserted_at, link, pub_date, title",
        ) // Exclude 'full_html'
        .order("pub_date", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return [];
      }

      return data as Tables<"executive_actions">[];
    },
  });
};

export const executiveActionsQueryOptions = queryOptions<
  Tables<"executive_actions">[]
>({
  queryKey: ["executive_actions"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("executive_actions")
      .select(
        "id, categories, description_html, guid, inserted_at, link, pub_date, title",
      ) // Exclude 'full_html'
      .order("pub_date", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return [];
    }

    return data as Tables<"executive_actions">[];
  },
});
