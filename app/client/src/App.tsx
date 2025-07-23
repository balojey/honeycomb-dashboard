import { useMemo } from 'react'
import { ConnectWalletButton } from './components/ConnectWalletButton';
import { ProjectList } from './components/ProjectList';
import createEdgeClient from '@honeycomb-protocol/edge-client';

const API_KEY = import.meta.env.VITE_API_KEY || "https://edge.test.honeycombprotocol.com/";

function App() {
  const client = useMemo(() => createEdgeClient(API_KEY, true), [API_KEY]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="p-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold">Honeycomb Dashboard</h1>
        <ConnectWalletButton />
      </header>
      <main className="p-4 sm:p-6 md:p-8">
        <ProjectList client={client} />
      </main>
    </div>
  )
}

export default App
