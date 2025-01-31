// hooks/useExecutiveOrderDetails.ts
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { Tables } from "@/lib/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
