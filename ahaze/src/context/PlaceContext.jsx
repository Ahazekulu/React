import React, { createContext, useState, useContext } from 'react';

const PlaceContext = createContext();

export const PlaceProvider = ({ children }) => {
    const [selectedPlace, setSelectedPlace] = useState(null);

    return (
        <PlaceContext.Provider value={{ selectedPlace, setSelectedPlace }}>
            {children}
        </PlaceContext.Provider>
    );
};

export const usePlace = () => {
    const context = useContext(PlaceContext);
    if (!context) {
        throw new Error('usePlace must be used within a PlaceProvider');
    }
    return context;
};
