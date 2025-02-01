import { useMemo } from "react";
import { isAfter, isBefore } from "date-fns";
import { getLocalNowInMinutes, parseTimeToMinutes } from "@/lib/time.utils";
import { DateRange } from "react-day-picker";
import {
  PoolReportSchedule,
  PoolReportSchedules,
} from "@/types/trumpCalendar.types";
import { ExecutiveOrderType } from "./executive-orders";

/** Utility to format "YYYY-MM-DD" -> Date. */
function parseEventDate(dateString: string) {
  // If your data is already "YYYY-MM-DD", just do:
  // new Date(`${dateString}T00:00:00`)
  return new Date(`${dateString}T00:00:00`);
}

/** Utility for returning "YYYY-MM-DD" for a Date object. */
function formatYMD(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Safely parse the presidency_project_date (e.g. "Jan 20, 2025") into a Date.
 * If you need more robust parsing, use date-fns parse with a known format string.
 */
function parseOrderDate(dateString: string | null): Date {
  if (!dateString) return new Date("1900-01-01");
  const d = new Date(dateString);
  // If invalid, handle fallback as needed:
  if (isNaN(d.getTime())) {
    // fallback or throw an error
    return new Date("1900-01-01");
  }
  return d;
}

/** Example: ExecutiveOrderType is a bunch of fields, and `id` is a string (UUID). */
// export type ExecutiveOrderType = Pick<
//   Tables<"executive_orders">,
//   | "id"                 // <- string
//   | "citation"
//   | "document_number"
//   | "pdf_url"
//   | "signing_date"
//   | "publication_date"
//   | "title"
//   | "executive_order_number"
//   | "presidency_project_title"
//   | "presidency_project_date"
// >;

type FilteredDataResult = {
  sortedDays: string[];
  sortedEventsByDay: Record<string, PoolReportSchedule[]>;
  /** Add new field for the executive orders grouping: */
  sortedOrdersByDay: Record<string, ExecutiveOrderType[]>;
  highlightDay: string | null;
  highlightTime: number | null;
  minDate: Date;
  maxDate: Date;
  filteredData: PoolReportSchedules; // your filtered POOL data
};

export function useFilteredCalendarData(
  data: PoolReportSchedules | undefined,
  orderData: ExecutiveOrderType[] | undefined,
  selectedRange: DateRange | undefined,
): FilteredDataResult {
  return useMemo<FilteredDataResult>(() => {
    // If either data set is missing or empty, return defaults:
    if (!data || data.length === 0 || !orderData || orderData.length === 0) {
      const now = new Date();
      return {
        sortedDays: [],
        sortedEventsByDay: {},
        sortedOrdersByDay: {},
        highlightDay: null,
        highlightTime: null,
        minDate: now,
        maxDate: now,
        filteredData: [],
      };
    }

    /********************************
     * 1) Filter POOL data by range *
     ********************************/
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

    /*******************************
     * 2) Group POOL events by day *
     *******************************/
    const groupedByDate = filteredData.reduce<
      Record<string, PoolReportSchedule[]>
    >((acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = [];
      }
      acc[event.date].push(event);
      return acc;
    }, {});

    /********************************************
     * 3) Sort day keys in descending order     *
     ********************************************/
    const sortedDays = Object.keys(groupedByDate).sort(
      (a, b) => +new Date(`${b}T00:00:00`) - +new Date(`${a}T00:00:00`),
    );

    /***************************************************************
     * 4) Sort the POOL events within each day by time descending  *
     ***************************************************************/
    const sortedEventsByDay: Record<string, PoolReportSchedule[]> = {};
    for (const day of sortedDays) {
      const dayEvents = [...groupedByDate[day]].sort((a, b) => {
        if (!a.time && !b.time) return 0;
        if (!a.time) return 1; // "no time" -> sort last
        if (!b.time) return -1;
        // Compare times descending
        return b.time.localeCompare(a.time);
      });
      sortedEventsByDay[day] = dayEvents;
    }

    /***********************************************
     * 5) Handle Executive Orders ("orderData")    *
     ***********************************************/
    let filteredOrders = orderData;
    if (selectedRange?.from && selectedRange?.to) {
      filteredOrders = orderData.filter((order) => {
        const orderDate = parseOrderDate(order.presidency_project_date);
        return (
          !isBefore(orderDate, selectedRange.from!) &&
          !isAfter(orderDate, selectedRange.to!)
        );
      });
    }

    // Group orders by "YYYY-MM-DD"
    const groupedOrdersByDate = filteredOrders.reduce<
      Record<string, ExecutiveOrderType[]>
    >((acc, order) => {
      const d = parseOrderDate(order.presidency_project_date);
      const key = formatYMD(d);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(order);
      return acc;
    }, {});

    // Sort those date keys in descending order
    const sortedOrderDays = Object.keys(groupedOrdersByDate).sort(
      (a, b) => +new Date(`${b}T00:00:00`) - +new Date(`${a}T00:00:00`),
    );

    // Sort the orders within each day by UUID (string), descending:
    const sortedOrdersByDay: Record<string, ExecutiveOrderType[]> = {};
    for (const day of sortedOrderDays) {
      // Use localeCompare for string sorting. For descending:
      sortedOrdersByDay[day] = groupedOrdersByDate[day].sort(
        (a, b) => b.id.localeCompare(a.id),
      );
    }

    /********************************
     * 6) Compute highlight (POOL)   *
     ********************************/
    let highlightDay: string | null = null;
    let highlightTime: number | null = null;

    const localToday = formatYMD(new Date());
    // Example offset for PST vs. EST, if needed:
    const localNowInMinutes = getLocalNowInMinutes() + 180;

    if (sortedDays.length > 0) {
      // If today's date is among the sorted days
      if (sortedDays.includes(localToday)) {
        const dayEvents = sortedEventsByDay[localToday];
        let foundOne = false;

        // Find the most recent event that started <= current time
        for (const evt of dayEvents) {
          const evtMins = parseTimeToMinutes(evt.time);
          if (evtMins !== null && evtMins <= localNowInMinutes) {
            highlightDay = localToday;
            highlightTime = evtMins;
            foundOne = true;
            break;
          }
        }

        // If no event has started yet, fallback to last event of previous day
        if (!foundOne) {
          const idx = sortedDays.indexOf(localToday);
          if (idx > 0) {
            const prevDay = sortedDays[idx - 1];
            const prevEvents = sortedEventsByDay[prevDay];
            const lastEvent = prevEvents[0];
            highlightDay = prevDay;
            highlightTime = parseTimeToMinutes(lastEvent.time);
          } else if (idx === 0) {
            // fallback to the first day < today
            let fallbackDay: string | null = null;
            for (let i = 0; i < sortedDays.length; i++) {
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
      } else {
        // If today's date is not in sortedDays, fallback to the first day < today
        let fallbackDay: string | null = null;
        for (let i = 0; i < sortedDays.length; i++) {
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

    /*******************************************
     * 7) Determine minDate / maxDate overall  *
     *******************************************/
    const poolDates = data.map((event) => parseEventDate(event.date));
    const orderDates = orderData.map((order) =>
      parseOrderDate(order.presidency_project_date)
    );
    const allDates = [...poolDates, ...orderDates];
    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

    return {
      sortedDays,
      sortedEventsByDay,
      sortedOrdersByDay,
      highlightDay,
      highlightTime,
      minDate,
      maxDate,
      filteredData,
    };
  }, [data, orderData, selectedRange]);
}
