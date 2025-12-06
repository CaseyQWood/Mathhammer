import { Routes, Route, useLocation } from 'react-router';
import { motion, AnimatePresence } from "motion/react"
import './App.css'
import LoginScreen from '@/routes/LoginScreen'
import HomePage from '@/routes/HomePage'
import { ProtectedRoute } from "./routes/ProtectedRoute";

function App() {
  const location = useLocation()

  return (
    <div key="test" id='main'>
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
        >
          <Routes location={location}>
            <Route path="/" element={<LoginScreen key="login-screen" />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />} />
            </Route>
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div >
  )
}

export default App



