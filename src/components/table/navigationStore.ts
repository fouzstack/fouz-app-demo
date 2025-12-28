import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ViewMode = 'table' | 'card';

interface NavigationState {
  // Estado de navegación
  viewMode: ViewMode;
  scrollPosition: number;
  highlightedProductId: number | null;
  lastVisitTimestamp: number;

  // Acciones
  setViewMode: (mode: ViewMode) => void;
  setScrollPosition: (position: number) => void;
  setHighlightedProductId: (id: number | null) => void;
  clearNavigationState: () => void;
  isStateValid: () => boolean;
}

const EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutos en milisegundos

const initialNavigationState = {
  viewMode: 'table' as ViewMode,
  scrollPosition: 0,
  highlightedProductId: null,
  lastVisitTimestamp: Date.now(),
};

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set, get) => ({
      ...initialNavigationState,
      setViewMode: (mode: ViewMode) =>
        set({
          viewMode: mode,
          lastVisitTimestamp: Date.now(),
        }),
      setScrollPosition: (position: number) =>
        set({
          scrollPosition: position,
          lastVisitTimestamp: Date.now(),
        }),
      setHighlightedProductId: (id: number | null) =>
        set({
          highlightedProductId: id,
          lastVisitTimestamp: Date.now(),
        }),
      clearNavigationState: () =>
        set({
          ...initialNavigationState,
          lastVisitTimestamp: Date.now(),
        }),
      isStateValid: () => {
        const state = get();
        const timeDiff = Date.now() - state.lastVisitTimestamp;
        return timeDiff < EXPIRATION_TIME;
      },
    }),
    {
      name: 'product-table-navigation',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        viewMode: state.viewMode,
        scrollPosition: state.scrollPosition,
        highlightedProductId: state.highlightedProductId,
        lastVisitTimestamp: state.lastVisitTimestamp,
      }),
      // Middleware para validar expiración al cargar
      onRehydrateStorage: () => (state) => {
        if (state) {
          const timeDiff = Date.now() - state.lastVisitTimestamp;
          if (timeDiff >= EXPIRATION_TIME) {
            // Si el estado expiró, limpiarlo
            state.clearNavigationState();
          }
        }
      },
    },
  ),
);
