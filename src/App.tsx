import { Routes, Route, useLocation } from 'react-router';
import { AnimatePresence } from 'motion/react';
import './App.css'
import * as Sentry from "@sentry/react";
// import LoginScreen from '@/features/auth/components/LoginScreen'
import HomePage from '@/routes/HomePage'
// import Header from './components/header';
import { motion } from "motion/react"
import { v4 as uuidv4 } from "uuid";


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
  // const navigate = useNavigate();
  const location = useLocation()
  const anonId = getAnonymousId();
  Sentry.setTag("anon_user_id", anonId);
  Sentry.setUser({ id: anonId })

  return (
    <div key="test" id='main'>
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/" element={<LoginScreen key="login-screen" login={() => navigate("/home")} />} /> */}
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div >
  )
}

export default App



