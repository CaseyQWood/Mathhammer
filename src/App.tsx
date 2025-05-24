import { useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import './App.css'
import { Stack } from '@mui/joy';
import InputField from "./components/inputField"



function App() {
  const [toughness, setToughness] = useState<number>(4)
  const [save, setSave] = useState<number>(3);
  const [invulnerable, setInvulnerable] = useState<number>(0)
  const [feelNoPain, setFeelNoPain] = useState<number>(0)


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
          <InputField title="Toughness" value={toughness} setValue={setToughness} min={1} max={20} />
          <InputField title="save" value={save} setValue={setSave} min={0} max={6} />
          <InputField title="Invulnerable" value={invulnerable} setValue={setInvulnerable} min={0} max={6} />
          <InputField title="Feel No Pain" value={feelNoPain} setValue={setFeelNoPain} min={0} max={6} />
        </Stack>
      </section>


    </CssVarsProvider>
  )
}

export default App

// needed stats for defence
/*
Toughness
Save
invuln
Feel no pain

*/