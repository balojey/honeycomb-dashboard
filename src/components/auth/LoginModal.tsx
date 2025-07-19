import { useState } from 'react';
import { Github, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginModalProps {
  open: boolean;
}

export function LoginModal({ open }: LoginModalProps) {
  const { signInWithGitHub } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGitHubLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGitHub();
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to sign in with GitHub. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={() => {}} // Prevent closing
    >
      <DialogContent 
        className="sm:max-w-md"
        showCloseButton={false} // Remove close button
        onPointerDownOutside={(e) => e.preventDefault()} // Prevent closing on outside click
        onEscapeKeyDown={(e) => e.preventDefault()} // Prevent closing on escape
      >
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">Welcome</DialogTitle>
          <DialogDescription>
            Sign in to access your dashboard
          </DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Github className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-lg">Continue with GitHub</CardTitle>
            <CardDescription>
              Use your GitHub account to securely access the dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleGitHubLogin}
              disabled={isLoading}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Redirecting to GitHub...
                </>
              ) : (
                <>
                  <Github className="w-5 h-5 mr-2" />
                  Continue with GitHub
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                By continuing, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}