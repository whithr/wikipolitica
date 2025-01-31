import { create } from "zustand";

interface ExecutiveActionsState {
  selectedOrderId: number;
  setSelectedOrderId: (id: number) => void;

  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useExecutiveOrdersStore = create<ExecutiveActionsState>((set) => ({
  selectedOrderId: -1,
  setSelectedOrderId: (id: number) => set({ selectedOrderId: id }),

  searchTerm: "",
  setSearchTerm: (term: string) => set({ searchTerm: term }),
}));
