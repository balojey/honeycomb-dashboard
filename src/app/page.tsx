import Header from "@/components/Header";
import ProjectDashboard from "@/components/ProjectDashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      <Header />

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
