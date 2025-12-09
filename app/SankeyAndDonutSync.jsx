import { createContext, useContext, useState, useEffect } from 'react';

// interface SankeyAndDonutSyncProviderProps {
//     children: React.ReactNode;
//     campus: string;
// }

const SankeyAndDonutSyncContext = createContext();

export const SankeyAndDonutSyncProvider = ({ children, campus }) => {
    const [hoveredCollege, setHoveredCollege] = useState(null);
    const [selectedSlice, setSelectedSlice] = useState(null);

    // RESET ON CAMPUS CHANGE
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedSlice(null);
    }, [campus]);

    return (
         <SankeyAndDonutSyncContext.Provider
            value={{
                hoveredCollege,
                setHoveredCollege,
                selectedSlice,
                setSelectedSlice
            }}
        >
            {children}
        </SankeyAndDonutSyncContext.Provider>
    );
};

export const useSankeyAndDonutSync = () => useContext(SankeyAndDonutSyncContext)