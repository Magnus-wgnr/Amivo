import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { clearState, loadState, saveState } from '../services/storage';
import type { AppState } from '../types';
import { reducer, type Action } from './reducer';

interface Store {
  state: AppState;
  dispatch: (action: Action) => void;
}

const StoreContext = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Einstellungen zur Barrierefreiheit global anwenden
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.font = state.a11y.fontScale;
    root.dataset.contrast = state.a11y.highContrast ? 'hoch' : 'normal';
    root.dataset.motion = state.a11y.reduceMotion ? 'reduziert' : 'normal';
  }, [state.a11y]);

  const value = useMemo<Store>(
    () => ({
      state,
      dispatch: (action) => {
        if (action.type === 'deleteAccount') clearState();
        dispatch(action);
      },
    }),
    [state],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore muss innerhalb von AppStoreProvider verwendet werden');
  return ctx;
}
