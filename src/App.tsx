import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <AuthProvider>
      <AuthGuard>
        <RouterProvider router={router} />
        <Toaster />
      </AuthGuard>
    </AuthProvider>
  );
}

export default App;