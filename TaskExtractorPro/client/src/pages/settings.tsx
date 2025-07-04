import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import PrioritizationSettings from "@/components/PrioritizationSettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, User, Zap } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Settings() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 gradient-gold rounded-lg flex items-center justify-center">
          <SettingsIcon className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Customize your TaskFlowPro experience</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Prioritization Settings */}
        <Card className="border-elegant">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-foreground">Task Prioritization</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Choose how you want to organize and prioritize your tasks
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PrioritizationSettings />
          </CardContent>
        </Card>

        {/* Future Settings Sections */}
        <Card className="border-elegant opacity-60">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-foreground">Profile Settings</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Manage your account and personal preferences (Coming Soon)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}