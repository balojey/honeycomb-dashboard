import { useState } from 'react'
import beaver from './assets/beaver.svg'
import { ApiResponse } from 'shared'
import { Button } from './components/ui/button'
import { ConnectWalletButton } from './components/ConnectWalletButton';
import { ProjectList } from './components/ProjectList';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000"

function App() {
  const [data, setData] = useState<ApiResponse | undefined>()

  async function sendRequest() {
    try {
      const req = await fetch(`${SERVER_URL}/hello`)
      const res: ApiResponse = await req.json()
      setData(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
      <div className='flex items-center gap-4'>
        <ConnectWalletButton />
      </div>
        {data && (
          <pre className="bg-gray-100 p-4 rounded-md">
            <code>
            Message: {data.message} <br />
            Success: {data.success.toString()}
            </code>
          </pre>
        )}
      <ProjectList />
    </div>
  )
}

export default App
