import { useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import './App.css'
import { Stack, Divider, Button, Select, Option } from '@mui/joy';
import InputField from "./components/inputField"
import { runSimulation } from './utils/runSimulation';
// import { calculateAttack } from './utils/caclulateAttack';
// import { findDistribution } from './utils/findDistribution'

import type { AttackStats, DefenseStats } from './types/unitStats';
import ResultsBarChart from './components/resultsBarChart';
type WoundTallies = Record<number, number>;


function App() {
  const [simData, setSimData] = useState<WoundTallies>()

  const [defenseStats, setdefenseStats] = useState<DefenseStats>({
    toughness: 4,
    save: 3,
    invulnerable: 0,
    feelNoPain: 0,
  })

  const [attackStats, setAttackStats] = useState<AttackStats>({
    models: 1,
    attacks: 10,
    weaponSkill: 3,
    strength: 4,
    armourPiercing: 1,
    variableDamage: 0,
    damage: 1
  })

  const handleDefenseChange = (stat: keyof DefenseStats, value: number) => {
    setdefenseStats(prevStats => ({
      ...prevStats,
      [stat]: value
    }));
  };

  const handleAttackChange = (stat: keyof AttackStats, value: number) => {
    setAttackStats(prevStats => ({
      ...prevStats,
      [stat]: value
    }));
  };


  return (
    <CssVarsProvider defaultMode="dark">
      <section className="page">
        <div className='defensiveStats__wrapper'>
          <InputField title="Toughness" value={defenseStats.toughness} setValue={(value) => handleDefenseChange('toughness', value)} min={1} max={20} />
          <InputField title="Save" value={defenseStats.save} setValue={(value) => handleDefenseChange('save', value)} min={0} max={6} />
          <InputField title="Invuln" value={defenseStats.invulnerable} setValue={(value) => handleDefenseChange('invulnerable', value)} min={0} max={6} />
          <InputField title="Fnp" value={defenseStats.feelNoPain} setValue={(value) => handleDefenseChange('feelNoPain', value)} min={0} max={6} />
        </div>
        <Divider />
        <div className='attackingStats__wrapper'>
          <InputField title="Models" value={attackStats.models} setValue={(value) => handleAttackChange('models', value)} min={1} max={20} />
          <InputField title="Attacks" value={attackStats.attacks} setValue={(value) => handleAttackChange('attacks', value)} min={0} max={150} />
          <InputField title="WS/BS" value={attackStats.weaponSkill} setValue={(value) => handleAttackChange('weaponSkill', value)} min={2} max={6} />
          <InputField title="Strength" value={attackStats.strength} setValue={(value) => handleAttackChange('strength', value)} min={1} max={20} />
          <InputField title="Armour piercing" value={attackStats.armourPiercing} setValue={(value) => handleAttackChange('armourPiercing', value)} min={0} max={6} />
          <Stack
            direction="row"
          >
            <InputField title="" value={attackStats.variableDamage} setValue={(value) => handleAttackChange('variableDamage', value)} min={0} max={6} damageDecorator={true} />
            {/* <Select placeholder="Choose one…">
              <Option>...</Option>
            </Select> */}
            <div>
              +
            </div>
            <InputField title="" value={attackStats.damage} setValue={(value) => handleAttackChange('damage', value)} min={0} max={10} />
          </Stack>
        </div>
        <Button
          fullWidth={false}
          onClick={() => {
            runSimulation(25000, attackStats, defenseStats).then((results) => {
              // console.log("simulation state: ", results)
              setSimData(results)
            })
          }}
        >
          Submit</Button>
        {simData ?

          <ResultsBarChart results={simData} />

          : null
        }
      </section>

    </CssVarsProvider>
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