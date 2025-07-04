import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Star, Target, Clock, Gift } from "lucide-react";
import Timer from "@/components/Timer";
import ProjectManager from "@/components/ProjectManager";
import Header from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import type { UserReward, PomodoroSession } from "@shared/schema";

// Children's mode gamified timer interface
function ChildrenMode() {
  const { data: rewards = [] } = useQuery<UserReward[]>({
    queryKey: ["/api/rewards"],
  });

  const { data: pomodoroSessions = [] } = useQuery<PomodoroSession[]>({
    queryKey: ["/api/pomodoro-sessions"],
  });

  const completedToday = pomodoroSessions.filter(session => {
    const today = new Date().toDateString();
    const sessionDate = new Date(session.createdAt!).toDateString();
    return sessionDate === today && session.isCompleted && session.sessionType === "work";
  }).length;

  const totalStars = rewards.filter(r => r.rewardType === "star").length;

  return (
    <div className="space-y-6">
      {/* Progress & Rewards Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="elegant-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-primary" />
              Stars Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalStars}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Keep focusing to earn more!
            </p>
          </CardContent>
        </Card>

        <Card className="elegant-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-primary" />
              Today's Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{completedToday}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Pomodoro sessions completed
            </p>
          </CardContent>
        </Card>

        <Card className="elegant-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Gift className="w-5 h-5 text-primary" />
              Achievement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-foreground">
              {completedToday >= 8 ? "Focus Master! 🏆" : 
               completedToday >= 4 ? "Great Work! ⭐" : 
               completedToday >= 1 ? "Getting Started! 🌟" : 
               "Ready to Focus! 💪"}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {completedToday >= 8 ? "You're amazing today!" : 
               `${8 - completedToday} more for Focus Master!`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Timer Component */}
      <Timer />
    </div>
  );
}

// Main timer page with adult and children modes
export default function TimerPage() {
  const [isChildrenMode, setIsChildrenMode] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading timer...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Timer & Time Tracking</h1>
            <p className="text-muted-foreground mt-2">
              Track your work with standard timers or stay focused with the Pomodoro technique
            </p>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="children-mode" className="text-foreground">Children Mode</Label>
            <Switch 
              id="children-mode" 
              checked={isChildrenMode} 
              onCheckedChange={setIsChildrenMode}
            />
          </div>
        </div>

        {isChildrenMode ? (
          <ChildrenMode />
        ) : (
          <Tabs defaultValue="timer" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="timer" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Clock className="w-4 h-4" />
                Timer
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Target className="w-4 h-4" />
                Projects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timer" className="space-y-6">
              <Timer />
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <ProjectManager />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}