import React, { createContext, useState } from 'react';

// Create the User Context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(2);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;