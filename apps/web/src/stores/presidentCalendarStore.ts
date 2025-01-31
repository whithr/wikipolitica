// src/store/presidentCalendarStore.ts

import { create } from "zustand";
import { DateRange } from "react-day-picker";

interface PresidentCalendarState {
  selectedRange: DateRange;
  setSelectedRange: (range: DateRange) => void;
  selectedDayId: number;
  setSelectedDayId: (id: number) => void;
}

export const usePresidentCalendarStore = create<PresidentCalendarState>((
  set,
) => ({
  selectedRange: {
    from: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days before today
    to: new Date(new Date().setDate(new Date().getDate() + 1)), // Today + 1
  },
  setSelectedRange: (range: DateRange) => set({ selectedRange: range }),

  selectedDayId: -1,
  setSelectedDayId: (id: number) => set({ selectedDayId: id }),
}));
