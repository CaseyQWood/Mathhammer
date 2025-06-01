import { useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import './App.css'
import { Stack, Divider, Button } from '@mui/joy';
import InputField from "./components/inputField"
import { calculateAttack } from './utils/caclulateAttack';
import { findDistribution } from './utils/findDistribution'

import type { AttackStats, DefenseStats } from './types/unitStats';
import ResultsBarChart from './components/resultsBarChart';

function App() {
  const [simData, setSimData] = useState(null)

  const [defenseStats, setdefenseStats] = useState<DefenseStats>({
    toughness: 4,
    save: 3,
    invulnerable: 0,
    feelNoPain: 0,
  })

  const [attackStats, setAttackStats] = useState<AttackStats>({
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


  const runSimulation = async (iterations = 50000) => {
    const results: number[][] = []
    for (let i = 0; i < iterations; i++) {
      const newAttacks = Array.from(
        { length: attackStats.attacks },
        () => calculateAttack(attackStats, defenseStats)
      );
      await Promise.all(newAttacks)
        .then((values) => {
          // console.log(values)
          const filterResults = values.filter((wound) => wound === 1)
          results.push(filterResults)
        })
    }

    setSimData(findDistribution(results))
  }

  return (
    <CssVarsProvider>
      <section className="page">
        <Stack
          direction="row"
          spacing={2}
          sx={{
            padding: '2rem',
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <InputField title="Toughness" value={defenseStats.toughness} setValue={(value) => handleDefenseChange('toughness', value)} min={1} max={20} />
          <InputField title="Save" value={defenseStats.save} setValue={(value) => handleDefenseChange('save', value)} min={0} max={6} />
          <InputField title="Invulnerable" value={defenseStats.invulnerable} setValue={(value) => handleDefenseChange('invulnerable', value)} min={0} max={6} />
          <InputField title="Feel no pain" value={defenseStats.feelNoPain} setValue={(value) => handleDefenseChange('feelNoPain', value)} min={0} max={6} />
        </Stack>
        <Divider />
        <Stack
          direction="row"
          spacing={2}
          sx={{
            padding: '2rem',
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <InputField title="Attacks" value={attackStats.attacks} setValue={(value) => handleAttackChange('attacks', value)} min={1} max={150} />
          <Divider orientation="vertical" />
          <InputField title="WS/BS" value={attackStats.weaponSkill} setValue={(value) => handleAttackChange('weaponSkill', value)} min={2} max={6} />
          <InputField title="Strength" value={attackStats.strength} setValue={(value) => handleAttackChange('strength', value)} min={1} max={20} />
          <InputField title="Armour piercing" value={attackStats.armourPiercing} setValue={(value) => handleAttackChange('armourPiercing', value)} min={0} max={6} />
          <Stack
            direction="row"
          >
            <InputField title="" value={attackStats.variableDamage} setValue={(value) => handleAttackChange('variableDamage', value)} min={0} max={6} damageDecorator={true} />
            <div>
              +
            </div>
            <InputField title="" value={attackStats.damage} setValue={(value) => handleAttackChange('damage', value)} min={0} max={10} />
          </Stack>
        </Stack>
        <Button
          fullWidth={false}
          onClick={() => {
            runSimulation()
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
