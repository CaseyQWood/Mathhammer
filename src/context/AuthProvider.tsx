import React, { createContext, useContext } from 'react';
import { type AuthContextType } from "@/types/auth";
import useAuthentication from '../hooks/useAuthentication';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const auth = useAuthentication();

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}


