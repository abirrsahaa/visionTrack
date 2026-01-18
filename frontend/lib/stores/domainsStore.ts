import { create } from "zustand";
import type { Domain } from "@/lib/types";

interface DomainsState {
  domains: Domain[];
  activeDomainId: string | null;
  setDomains: (domains: Domain[]) => void;
  setActiveDomain: (id: string | null) => void;
  addDomain: (domain: Domain) => void;
  updateDomain: (id: string, updates: Partial<Domain>) => void;
  removeDomain: (id: string) => void;
}

export const useDomainsStore = create<DomainsState>((set) => ({
  domains: [],
  activeDomainId: null,
  setDomains: (domains) => set({ domains }),
  setActiveDomain: (id) => set({ activeDomainId: id }),
  addDomain: (domain) =>
    set((state) => ({
      domains: [...state.domains, domain],
    })),
  updateDomain: (id, updates) =>
    set((state) => ({
      domains: state.domains.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),
  removeDomain: (id) =>
    set((state) => ({
      domains: state.domains.filter((d) => d.id !== id),
      activeDomainId: state.activeDomainId === id ? null : state.activeDomainId,
    })),
}));