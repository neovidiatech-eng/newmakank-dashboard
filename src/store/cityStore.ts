import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CityStore {
  selectedCityId: number | null;
  selectedCityName: string | null;
  setCity: (id: number | null, name: string | null) => void;
  clearCity: () => void;
}

export const useCityStore = create<CityStore>()(
  persist(
    (set) => ({
      selectedCityId: null,
      selectedCityName: null,
      setCity: (id, name) => set({ selectedCityId: id, selectedCityName: name }),
      clearCity: () => set({ selectedCityId: null, selectedCityName: null }),
    }),
    { name: 'makank-city-store' },
  ),
);
