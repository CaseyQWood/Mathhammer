import { useState, useEffect, use } from "react";
import { Routes, Route, useLocation, useNavigate } from 'react-router';
import { AnimatePresence } from 'motion/react';
import './App.css'
import * as Sentry from "@sentry/react";
import LoginScreen from '@/features/auth/components/LoginScreen'
import HomePage from '@/routes/HomePage'
// import Header from './components/header';
import { motion } from "motion/react"
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

function getAnonymousId() {
  const key = "sentry_anon_id";
  let anonId = localStorage.getItem(key);

  // Generate if missing
  if (!anonId) {
    anonId = uuidv4();
    localStorage.setItem(key, anonId);

  }

  return anonId;
}


function App() {
  // const [openAside, setOpenAside] = useState<boolean>(false)
  const navigate = useNavigate();
  const location = useLocation()
  const anonId = getAnonymousId();
  Sentry.setTag("anon_user_id", anonId);
  Sentry.setUser({ id: anonId })


  const [email, setEmail] = useState("");
  const [session, setSession] = useState(null);

  // Check URL params on initial render
  const params = new URLSearchParams(window.location.search);
  const hasTokenHash = params.get("token_hash");
  const [verifying, setVerifying] = useState(!!hasTokenHash);
  const [authError, setAuthError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(false);

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





  // -------------------------
  const userKey = import.meta.env.VITE_SUPABASE_USER_userKEY;
  const [loading, setLoading] = useState(false);

  useEffect(() => { console.log("app load") }, [])


  async function handleLogin() {
    setLoading(true)

    //ToDo: manage guest accounts some how


    navigate("/home")

    setLoading(false)

  }



  return (
    <div key="test" id='main'>
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
        >
          <Routes location={location}>
            <Route path="/" element={<LoginScreen key="login-screen" login={() => handleLogin()} />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div >
  )
}

export default App



