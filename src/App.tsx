import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router';
import { AnimatePresence } from 'motion/react';
import './App.css'
import LoginScreen from './components/Login'
import HomePage from './components/routes/HomePage'

// import Header from './components/header';
import { motion } from "motion/react"




function App() {
  // const [openAside, setOpenAside] = useState<boolean>(false)
  const navigate = useNavigate();
  const location = useLocation()


  // const page = {
  //   initial: { opacity: 0, y: 16 },
  //   animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  // };

  return (
    <div key="test" id='main'>
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
        // variants={page}
        // initial="initial"
        // animate="animate"
        >
          <Routes location={location}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<LoginScreen key="login-screen" login={() => navigate("/home")} />} />
          </Routes>

          {/* <Header openAside={openAside} setOpenAside={setOpenAside} />
      <div id="main">
         {openAside ? <aside>aside</aside> : null}


      </div>
      <footer>Footer</footer> */}
        </motion.main>
      </AnimatePresence>
    </div >
  )
}

export default App



/*
right now I have run simulation feeding directly into state that is named sim resulst 
- I dont like this as I am using findDistribution to massage the data first before the state is set
  the naming isnt cohesive in this case and I would prefer to have run sim to just return a value and 
  for me to then use the distribution function after that and set state from there. 
  also the data I am returning from run sim is dubious at best, pretty sure its just
  a matrix and could be boiled down to just an array of the would results

*/