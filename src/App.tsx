// import { useState } from 'react';
import './App.css'
// import ResultsBarChart from './components/resultsBarChart';
// import UnitForm from './components/unitForm/UnitForm';
// import Header from './components/header';
// type WoundTallies = Record<number, number>;


function App() {
  // const [simData, setSimData] = useState<WoundTallies>()
  // const [openAside, setOpenAside] = useState<boolean>(false)

  return (
    <div id='main'>

      <section className="login-section">
        <div className='logo-wrapper'>
          <img src="src/assets/react.svg" alt="Mathhammer Logo" />
        </div>
        <form>
          <button>Login</button>
          <button>Sign Up</button>
          <button>Guest</button>
        </form>


        {/* <form>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
          <button type="submit">Login</button>
        </form> */}
      </section>
      {/* <Header openAside={openAside} setOpenAside={setOpenAside} />
      <div id="main">
        {openAside ? <aside>aside</aside> : null}
        <article>
          <UnitForm setSimData={setSimData} />
          {simData ?
            <ResultsBarChart results={simData} />
            : null
          }
        </article>

      </div>
      <footer>Footer</footer> */}
    </div>
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