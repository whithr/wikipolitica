import { useQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { PoolReportSchedules } from "@/types/trumpCalendar.types";

// 1) Initialize Supabase client with your public anon or other key
// Make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Hook that fetches all schedule rows from your "president_schedule" table.
 * Make sure your RLS policy allows read access (if enabled).
 */
export function useTrumpCalendarData() {
  return useQuery<PoolReportSchedules>({
    queryKey: ["trumpCalendar"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("president_schedule")
        .select("*")
        // Sort by date desc, then by time desc (or adjust as you like)
        .order("date", { ascending: false })
        .order("time", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return [];
      }

      return data as PoolReportSchedules;
    },
  });
}
