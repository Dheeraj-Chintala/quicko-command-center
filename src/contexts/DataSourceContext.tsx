import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type DataSourceMode = 'live' | 'demo';

const STORAGE_KEY = 'quicko-data-source';

type DataSourceContextValue = {
  mode: DataSourceMode;
  setMode: (mode: DataSourceMode) => void;
  isLive: boolean;
};

const DataSourceContext = createContext<DataSourceContextValue | null>(null);

function readStoredMode(): DataSourceMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'demo' || v === 'live') return v;
  } catch {
    /* ignore */
  }
  return 'live';
}

export const DataSourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<DataSourceMode>(() =>
    typeof window !== 'undefined' ? readStoredMode() : 'live',
  );

  const setMode = useCallback((next: DataSourceMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      isLive: mode === 'live',
    }),
    [mode, setMode],
  );

  return <DataSourceContext.Provider value={value}>{children}</DataSourceContext.Provider>;
};

// Hook colocated with provider for this small feature.
// eslint-disable-next-line react-refresh/only-export-components -- useDataSource is tied to DataSourceProvider
export function useDataSource(): DataSourceContextValue {
  const ctx = useContext(DataSourceContext);
  if (!ctx) {
    throw new Error('useDataSource must be used within DataSourceProvider');
  }
  return ctx;
}
