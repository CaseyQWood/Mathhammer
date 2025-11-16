import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router';
import { createRoot } from 'react-dom/client'
import { CssVarsProvider } from '@mui/joy';
import * as Sentry from "@sentry/react";
import './index.css'
import '@fontsource/inter';
import App from './App.tsx'

Sentry.init({
  dsn: "https://e1ac630cc279ced2d4f04d78deb8a2c8@o4510332903096320.ingest.us.sentry.io/4510332904210432",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: false, // 🔒 ensures no personal data like IPs is attached
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CssVarsProvider defaultMode="dark" disableNestedContext>
        <App />
      </CssVarsProvider>
    </BrowserRouter>
  </StrictMode>,
)
