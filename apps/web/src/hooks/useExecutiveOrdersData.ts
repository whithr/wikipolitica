import { useQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { Tables } from "@/lib/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useExecutiveOrdersData = () => {
  return useQuery<Tables<"executive_actions">[]>({
    queryKey: ["executive_actions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("executive_actions")
        .select("*")
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
