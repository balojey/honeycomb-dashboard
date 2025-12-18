import WalletConnection from "@/components/WalletConnection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Solana Wallet
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              Connect your Solana wallet to access decentralized applications on the Solana blockchain
            </p>
          </div>
          
          <WalletConnection />
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 max-w-md">
            <p>Supports Phantom, Solflare, Torus, and Ledger wallets</p>
            <p className="mt-2">Currently connected to Solana Devnet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
