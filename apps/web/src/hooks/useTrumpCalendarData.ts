import { fetchTrumpCalendar } from "@/components/president/fetchTrumpCalendar";
import { PoolReportSchedules } from "@/types/trumpCalendar.types";
import { useQuery } from "@tanstack/react-query";

export function useTrumpCalendarData() {
  return useQuery<PoolReportSchedules>({
    queryKey: ["trumpCalendar"],
    queryFn: fetchTrumpCalendar,
  });
}
