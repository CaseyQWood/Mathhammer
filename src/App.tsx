import { Routes, Route, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from "motion/react"
import './App.css'
import LoginScreen from '@/features/auth/components/LoginScreen'
import HomePage from '@/routes/HomePage'
import useAuthentication from "@/hooks/useAuthentication";
import { ProtectedRoute } from "./routes/ProtectedRoute";

function App() {
  const navigate = useNavigate();
  const location = useLocation()

  const { session, signInWithEmail, signUpNewUser, logout } = useAuthentication()

  const handleGuestLogin = async () => {
    navigate('/home')
  };

  const handleSignIn = async (email: string, password: string) => {
    if (session) {
      navigate("/home")
    }
    const { data, error } = await signInWithEmail(email, password)

    if (error) {
      console.log(error.message)
      return
    }

    if (data) {
      navigate("/home")
    }

  }


  return (
    <div key="test" id='main'>
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
        >
          <Routes location={location}>
            <Route path="/" element={<LoginScreen key="login-screen" handleGuestLogin={() => handleGuestLogin()} signIn={handleSignIn} signUp={signUpNewUser} />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage logout={logout} />} />
            </Route>
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div >
  )
}

export default App



