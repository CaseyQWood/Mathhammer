import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router';
import { createRoot } from 'react-dom/client'
import { CssVarsProvider } from '@mui/joy';
import './index.css'
import '@fontsource/inter';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CssVarsProvider defaultMode="dark" disableNestedContext>
        <App />
      </CssVarsProvider>
    </BrowserRouter>
  </StrictMode>,
)
