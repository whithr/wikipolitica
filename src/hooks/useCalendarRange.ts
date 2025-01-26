import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

export function useCalendarRange() {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    // Default: last 7 days up to "tomorrow"
    from: addDays(new Date(), -6),
    to: addDays(new Date(), 1),
  });

  return {
    selectedRange,
    setSelectedRange,
  };
}
