import { useEffect } from 'react'
import { QuoteProvider } from './context/QuoteContext'
import { QuoteWizard } from './QuoteWizard'
import { initGlobalTracking } from "./analytics/interactions.ts";

function App() {
  useEffect(() => {
    // Initialize global listeners on mount and get the cleanup function back
    const cleanup = initGlobalTracking();

    // Clean up listeners when the App unmounts
    return cleanup;
  }, []);

  return (
    <QuoteProvider>
      <QuoteWizard />
    </QuoteProvider>
  )
}

export default App
