import { useQuery } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { PoolReportSchedules } from "@/types/trumpCalendar.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useTrumpCalendarData() {
  return useQuery<PoolReportSchedules>({
    queryKey: ["trump_calendar"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("president_schedule")
        .select("*")
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
