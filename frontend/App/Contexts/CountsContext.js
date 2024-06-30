// CountsContext.js

import React, { createContext, useState } from 'react';

export const CountsContext = createContext();

export const CountsProvider = ({ children }) => {
    const [counts, setCounts] = useState({
        inspectedCount: 0,
        workIssuedCount: 0,
        workCompletedCount: 0,
        totalIssues: 0,
    });

    return (
        <CountsContext.Provider value={{ counts, setCounts }}>
            {children}
        </CountsContext.Provider>
    );
};
