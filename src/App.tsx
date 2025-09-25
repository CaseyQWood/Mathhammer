import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router';
import { AnimatePresence } from 'motion/react';
import './App.css'
import LoginScreen from './components/Login'
import ResultsBarChart from './components/resultsBarChart';
import UnitForm from './components/unitForm/UnitForm';
import Header from './components/header';
import { motion } from "motion/react"


type WoundTallies = Record<number, number>;


function App() {
  const [simData, setSimData] = useState<WoundTallies>()
  // const [openAside, setOpenAside] = useState<boolean>(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const navigate = useNavigate();
  const location = useLocation()


  const page = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    // exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
  };

  return (
    <div key="test" id='main'>
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}            // or: location.key
          variants={page}
          initial="initial"
          animate="animate"
        // exit="exit"
        >
          <Routes location={location}>
            <Route path="/home" element={
              <motion.article
                // initial={{ opacity: 0, x: 100 }}
                // animate={{ opacity: 1, x: 0 }}
                // exit={{ opacity: 0, x: -100 }}
                // transition={{ duration: 0.5 }}
                key="home"
              >
                <UnitForm setSimData={setSimData} />
                {simData ?
                  <ResultsBarChart results={simData} />
                  : null
                }
              </motion.article>
            } />
            <Route path="/" element={<LoginScreen key="login-screen" loggedIn={loggedIn} setLoggedIn={() => navigate("/home")} />} />
          </Routes>

          {/* {loggedIn ?
          // <article>
          //   <UnitForm setSimData={setSimData} />
          //   {simData ?
          //     <ResultsBarChart results={simData} />
          //     : null
          //   }
          // </article>
          null :
          
        } */}
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