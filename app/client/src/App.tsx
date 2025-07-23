import { useMemo } from 'react'
import { ConnectWalletButton } from './components/ConnectWalletButton';
import { ProjectList } from './components/ProjectList';
import createEdgeClient from '@honeycomb-protocol/edge-client';

const API_KEY = import.meta.env.VITE_API_KEY || "https://edge.test.honeycombprotocol.com/";

function App() {
  const client = useMemo(() => createEdgeClient(API_KEY, true), [API_KEY]);

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
      <div className='flex items-center gap-4'>
        <ConnectWalletButton />
      </div>
      <ProjectList client={client} />
    </div>
  )
}

export default App
