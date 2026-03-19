import React, { createContext, useContext, useState } from 'react';

interface DataModeContextType {
  isRealData: boolean;
  toggleDataMode: () => void;
}

const DataModeContext = createContext<DataModeContextType | undefined>(undefined);

export const DataModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRealData, setIsRealData] = useState(false);

  return (
    <DataModeContext.Provider value={{ isRealData, toggleDataMode: () => setIsRealData(prev => !prev) }}>
      {children}
    </DataModeContext.Provider>
  );
};

export const useDataMode = () => {
  const context = useContext(DataModeContext);
  if (!context) throw new Error('useDataMode must be used within DataModeProvider');
  return context;
};
