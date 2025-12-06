import { motion } from "motion/react"
import { createClient } from '@supabase/supabase-js'

// Initialize client (usually done in a separate file like supabaseClient.js)
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

function GoogleLoginButton() {

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        })

        if (error) console.log("Error logging in:", error)
    }
    return (
        <motion.button
            exit={{ opacity: 0 }}
            type="button"
            onClick={handleLogin}
            style={{
                padding: '10px 20px',
                backgroundColor: 'white',
                color: "#001524",
                border: '1px solid #ddd',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}
        >
            <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                style={{ width: '20px' }}
            />
            Sign in with Google
        </motion.button>
    )
}

export default GoogleLoginButton