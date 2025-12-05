import { useState, useEffect } from "react";
import { createClient, type EmailOtpType, type Session } from "@supabase/supabase-js";
import { type AuthContextType } from "@/types/auth";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);


export default function useAuthentication(): AuthContextType {
    const params = new URLSearchParams(window.location.search);
    const hasTokenHash = params.get("token_hash");
    const [verifying, setVerifying] = useState(!!hasTokenHash);
    const [authError, setAuthError] = useState<string | null>(null);
    const [authSuccess, setAuthSuccess] = useState<boolean>(false);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        // Check if we have token_hash in URL (magic link callback)
        const params = new URLSearchParams(window.location.search);

        const token_hash = params.get("token_hash");

        const type = params.get("type");
        if (token_hash) {
            // Verify the OTP token
            supabase.auth.verifyOtp({
                token_hash,
                type: (type as EmailOtpType) || "email",
            }).then(({ error }) => {
                if (error) {
                    setAuthError(error.message);
                } else {
                    setAuthSuccess(true);
                    // Clear URL params
                    window.history.replaceState({}, document.title, "/");
                }
                setVerifying(false);
            });
        }
        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });
        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);


    const logout = async () => {
        setAuthError(null)
        const { error } = await supabase.auth.signOut()
        setSession(null);

        if (error) {
            return { result: "failed", error: error }
        }

        return { result: "success", error: null }
    };


    async function signUpNewUser(email: string, password: string) {
        setAuthError(null)
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) {
            setAuthError(error.message)
        }

        return { data, error }
    }


    async function signInWithEmail(email: string, password: string) {
        setAuthError(null)
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (error) {
            setAuthError(error.message)
        }

        return { data, error }
    }

    return { signInWithEmail, signUpNewUser, logout, session, authSuccess, authError, verifying, loading }

}