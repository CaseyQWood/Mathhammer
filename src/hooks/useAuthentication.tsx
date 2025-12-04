import { useState, useEffect } from "react";
import { createClient, type Session } from "@supabase/supabase-js";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

export default function useAuthentication() {
    // Check URL params on initial render
    const params = new URLSearchParams(window.location.search);
    const hasTokenHash = params.get("token_hash");
    const [verifying, setVerifying] = useState(!!hasTokenHash);
    const [authError, setAuthError] = useState<string | null>(null);
    const [authSuccess, setAuthSuccess] = useState<boolean>(false);
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        // Check if we have token_hash in URL (magic link callback)
        const params = new URLSearchParams(window.location.search);

        const token_hash = params.get("token_hash");

        const type = params.get("type");
        if (token_hash) {
            // Verify the OTP token
            supabase.auth.verifyOtp({
                token_hash,
                type: type || "email",
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
            console.log("Get Session:  ", session)
            setSession(session);
        });
        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
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
        console.log("Sign up new user:  ", email, "  : ", password)
        setAuthError(null)
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            // options: {
            //     emailRedirectTo: 'https://example.com/welcome',
            // },
        })

        if (error) {
            setAuthError(error.message)
            console.log("error: ", error.message)
            return { data: null, error }
        }

        console.log("Sign up: ", data)

        return { data, error: null }
    }

    async function signInWithEmail(email: string, password: string) {
        console.log("User Logging in:  ", email, "  : ", password)

        setAuthError(null)
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (error) {
            setAuthError(error.message)
            console.log("error: ", error.message)
            return { data: null, error }
        }

        console.log("Sign In: ", data)

        return { data, error: null }

    }

    return { signInWithEmail, signUpNewUser, logout, session, authSuccess, authError, verifying }

}