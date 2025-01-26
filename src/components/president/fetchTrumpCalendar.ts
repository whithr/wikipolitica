import { PoolReportSchedules } from "@/types/trumpCalendar.types";

export const fetchTrumpCalendar = async (): Promise<PoolReportSchedules> => {
  const response = await fetch(
    "https://media-cdn.factba.se/rss/json/trump/calendar-full.json",
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
