import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router';
import { createRoot } from 'react-dom/client'
import { CssVarsProvider } from '@mui/joy';
import * as Sentry from "@sentry/react";
import './index.css'
import '@fontsource/inter';
import App from './App.tsx'
import { AuthProvider } from './context/AuthProvider.tsx';

Sentry.init({
  dsn: import.meta.env.SENTRY_DSN,
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  // integrations: [
  //   Sentry.browserTracingIntegration(),
  //   Sentry.replayIntegration(),
  // ],
  tracesSampleRate: 1.0,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CssVarsProvider defaultMode="dark" disableNestedContext>
        <AuthProvider>
          <App />
        </AuthProvider>
      </CssVarsProvider>
    </BrowserRouter>
  </StrictMode>,
)
