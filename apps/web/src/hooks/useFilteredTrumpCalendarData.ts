// useFilteredCalendarData.ts

import { useMemo } from "react";
import { isAfter, isBefore } from "date-fns";
import { getLocalNowInMinutes, parseTimeToMinutes } from "@/lib/time.utils"; // or wherever you store these
import { DateRange } from "react-day-picker";
import {
  PoolReportSchedule,
  PoolReportSchedules,
} from "@/types/trumpCalendar.types";

/** Utility to format "YYYY-MM-DD" -> Date. */
function parseEventDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`);
}

/** Utility for returning "YYYY-MM-DD" for a Date object. */
function formatYMD(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

type FilteredDataResult = {
  sortedDays: string[];
  sortedEventsByDay: Record<string, PoolReportSchedule[]>;
  highlightDay: string | null;
  highlightTime: number | null;
  minDate: Date;
  maxDate: Date;
  filteredData: PoolReportSchedules;
};

/**
 * Returns filtered, grouped, and sorted data, along with highlighting info and date bounds.
 */
export function useFilteredCalendarData(
  data: PoolReportSchedules | undefined,
  selectedRange: DateRange | undefined,
): FilteredDataResult {
  return useMemo(() => {
    if (!data || data.length === 0) {
      // Return empty placeholders if no data
      return {
        sortedDays: [],
        sortedEventsByDay: {},
        highlightDay: null,
        highlightTime: null,
        minDate: new Date(),
        maxDate: new Date(),
        filteredData: [],
      };
    }

    // 1) Filter by date range if we have from/to
    let filteredData = data;
    if (selectedRange?.from && selectedRange?.to) {
      filteredData = data.filter((event) => {
        const eventDate = parseEventDate(event.date);
        return (
          !isBefore(eventDate, selectedRange.from!) &&
          !isAfter(eventDate, selectedRange.to!)
        );
      });
    }

    // 2) Group data by date
    const groupedByDate = filteredData.reduce<
      Record<string, PoolReportSchedule[]>
    >(
      (acc, event) => {
        if (!acc[event.date]) {
          acc[event.date] = [];
        }
        acc[event.date].push(event);
        return acc;
      },
      {},
    );

    // 3) Sort the dates in descending order
    const sortedDays = Object.keys(groupedByDate).sort(
      (a, b) => +new Date(`${b}T00:00:00`) - +new Date(`${a}T00:00:00`),
    );

    // 4) For each day, sort events in descending order by time
    const sortedEventsByDay: Record<string, PoolReportSchedule[]> = {};
    for (const day of sortedDays) {
      const dayEvents = [...groupedByDate[day]].sort((a, b) => {
        if (!a.time && !b.time) return 0;
        if (!a.time) return 1; // no time => last
        if (!b.time) return -1;
        return b.time.localeCompare(a.time); // desc
      });
      sortedEventsByDay[day] = dayEvents;
    }

    // 5) Compute highlightDay & highlightTime
    let highlightDay: string | null = null;
    let highlightTime: number | null = null;

    const localToday = formatYMD(new Date());
    const localNowInMinutes = getLocalNowInMinutes();

    if (sortedDays.length > 0) {
      if (sortedDays.includes(localToday)) {
        // a) localToday is in sortedDays
        const dayEvents = sortedEventsByDay[localToday];
        // Find the largest event time <= localNowInMinutes
        let foundOne = false;
        for (const evt of dayEvents) {
          const evtMins = parseTimeToMinutes(evt.time);
          if (evtMins !== null && evtMins <= localNowInMinutes) {
            highlightDay = localToday;
            highlightTime = evtMins;
            foundOne = true;
            break;
          }
        }
        // If no event has started yet, fallback to previous day's last event
        if (!foundOne) {
          const idx = sortedDays.indexOf(localToday);
          if (idx > 0) {
            const prevDay = sortedDays[idx - 1];
            const prevEvents = sortedEventsByDay[prevDay];
            const lastEvent = prevEvents[0];
            highlightDay = prevDay;
            highlightTime = parseTimeToMinutes(lastEvent.time);
          }
        }
      } else {
        // b) localToday is not in sortedDays -> fallback to day < today
        let fallbackDay: string | null = null;
        for (let i = sortedDays.length - 1; i >= 0; i--) {
          const d = sortedDays[i];
          if (d < localToday) {
            fallbackDay = d;
            break;
          }
        }
        if (fallbackDay) {
          const fallbackEvents = sortedEventsByDay[fallbackDay];
          const lastEvent = fallbackEvents[0];
          highlightDay = fallbackDay;
          highlightTime = parseTimeToMinutes(lastEvent.time);
        }
      }
    }

    // 6) Find min/max dates across all data (to restrict date-picker)
    const allDates = data.map((event) => parseEventDate(event.date));
    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

    return {
      sortedDays,
      sortedEventsByDay,
      highlightDay,
      highlightTime,
      minDate,
      maxDate,
      filteredData,
    };
  }, [data, selectedRange]);
}
