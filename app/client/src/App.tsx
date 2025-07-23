import { useMemo } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ConnectWalletButton } from './components/ConnectWalletButton';
import { ProjectList } from './components/ProjectList';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import createEdgeClient from '@honeycomb-protocol/edge-client';

const API_KEY = import.meta.env.VITE_API_KEY || "https://edge.test.honeycombprotocol.com/";

const RootLayout = () => (
  <div className="bg-background text-foreground min-h-screen">
    <header className="p-4 flex justify-between items-center border-b">
      <h1 className="text-2xl font-bold">Honeycomb Dashboard</h1>
      <ConnectWalletButton />
    </header>
    <main className="p-4 sm:p-6 md:p-8">
      <Outlet />
    </main>
  </div>
);

function App() {
  const client = useMemo(() => createEdgeClient(API_KEY, true), [API_KEY]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <ProjectList client={client} />,
        },
        {
          path: "project/:projectAddress",
          element: <ProjectDetailPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
