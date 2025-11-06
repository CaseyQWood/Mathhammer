import { Routes, Route, useLocation } from 'react-router';
import { AnimatePresence } from 'motion/react';
import './App.css'
// import LoginScreen from './components/routes/Login'
import HomePage from './components/routes/HomePage'

// import Header from './components/header';
import { motion } from "motion/react"




function App() {
  // const [openAside, setOpenAside] = useState<boolean>(false)
  // const navigate = useNavigate();
  const location = useLocation()

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



