import { useQuery } from "@tanstack/react-query";
import { PoolReportSchedules } from "@/types/trumpCalendar.types";
import { supabase } from "@/main";

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
