import { createContext, useContext, useState } from 'react';

const SankeyAndDonutSyncContext = createContext();

export const SankeyAndDonutSyncProvider = ({ children }) => {
    const [hoveredCollege, setHoveredCollege] = useState(null);
    return (
        <SankeyAndDonutSyncContext.Provider value={{ hoveredCollege, setHoveredCollege }}>
            {children}
        </SankeyAndDonutSyncContext.Provider>
    );
};

export const useSankeyAndDonutSync = () => useContext(SankeyAndDonutSyncContext)