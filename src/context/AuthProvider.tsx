import React, { createContext, useContext } from 'react';
import { type AuthContextType } from "@/types/auth";
import useAuthentication from '../hooks/useAuthentication'; // Import your existing hook


const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode
}

// 2. Create the Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
    // Call your hook ONE time here
    const auth = useAuthentication();

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

// 3. Create a helper hook to use the context easily
export function useAuth() {
    return useContext(AuthContext);
}


