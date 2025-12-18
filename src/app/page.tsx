import Header from "@/components/Header";
import WalletConnection from "@/components/WalletConnection";
import ProjectDashboard from "@/components/ProjectDashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col items-center space-y-6 text-center">
            {/* Title */}
            <div className="space-y-4 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Solana Devnet
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Honeycomb
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">Dashboard</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Connect your Solana wallet and manage your Honeycomb Protocol projects with ease
              </p>
            </div>
            
            {/* Wallet Connection */}
            <div className="w-full max-w-md pt-4">
              <WalletConnection />
            </div>
            
            {/* Supported Wallets Info */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400 pt-2">
              <span className="font-medium">Supported:</span>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  Phantom
                </span>
                <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  Solflare
                </span>
                <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  Torus
                </span>
                <span className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  Ledger
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-8 md:space-y-12">
          {/* Projects Section */}
          <section className="w-full">
            <div className="mb-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Your Projects
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage your Honeycomb Protocol projects
              </p>
            </div>
            <ProjectDashboard />
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Built with Honeycomb Protocol on Solana</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
