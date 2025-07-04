import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Zap, 
  Mail, 
  Calendar, 
  Share, 
  Webhook, 
  BarChart3, 
  Clock,
  ExternalLink,
  Send 
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Sidebar() {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/tasks/stats"],
    retry: false,
  });

  const { data: activities = [] } = useQuery({
    queryKey: ["/api/activities"],
    retry: false,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["/api/tasks"],
    retry: false,
  });

  const emailTasksMutation = useMutation({
    mutationFn: async (data: { taskIds: number[]; email: string; subject: string }) => {
      const response = await apiRequest("POST", "/api/tasks/email", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Email Sent",
        description: "Your tasks have been sent via email successfully.",
      });
      setEmailDialogOpen(false);
      setEmailAddress("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      
      toast({
        title: "Email Failed",
        description: error instanceof Error ? error.message : "Failed to send email",
        variant: "destructive",
      });
    },
  });

  const handleEmailTasks = () => {
    if (!emailAddress) {
      toast({
        title: "Email Required",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    const pendingTasks = tasks.filter((task: any) => task.status !== 'completed');
    if (pendingTasks.length === 0) {
      toast({
        title: "No Tasks",
        description: "No pending tasks to send.",
        variant: "destructive",
      });
      return;
    }

    emailTasksMutation.mutate({
      taskIds: pendingTasks.map((task: any) => task.id),
      email: emailAddress,
      subject: "Your Task List from TaskFlow",
    });
  };

  const quickActions = [
    {
      icon: Mail,
      label: "Email Tasks",
      color: "text-blue-500",
      action: () => setEmailDialogOpen(true),
    },
    {
      icon: Calendar,
      label: "Create Calendar Events",
      color: "text-green-500",
      action: () => toast({ title: "Coming Soon", description: "Calendar integration is coming soon!" }),
    },
    {
      icon: Share,
      label: "Export to Notion",
      color: "text-purple-500",
      action: () => toast({ title: "Coming Soon", description: "Notion integration is coming soon!" }),
    },
    {
      icon: Webhook,
      label: "Send to Slack",
      color: "text-orange-500",
      action: () => toast({ title: "Coming Soon", description: "Slack integration is coming soon!" }),
    },
  ];

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
            <Zap className="w-5 h-5 text-warning mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-between p-3 h-auto bg-slate-50 hover:bg-slate-100"
              onClick={action.action}
            >
              <div className="flex items-center space-x-3">
                <action.icon className={`w-5 h-5 ${action.color}`} />
                <span className="font-medium text-slate-900">{action.label}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Task Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
            <BarChart3 className="w-5 h-5 text-accent mr-2" />
            Task Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Total Tasks</span>
                <span className="font-semibold text-slate-900">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Completed</span>
                <span className="font-semibold text-accent">{stats.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">In Progress</span>
                <span className="font-semibold text-warning">{stats.inProgress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Overdue</span>
                <span className="font-semibold text-destructive">{stats.overdue}</span>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-600">Completion Rate</span>
                  <span className="font-medium text-slate-900">{stats.completionRate}%</span>
                </div>
                <Progress value={stats.completionRate} className="h-2" />
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-slate-500">Loading stats...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
            <Clock className="w-5 h-5 text-slate-500 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity: any) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.action === "completed" ? "bg-accent" :
                    activity.action === "created" ? "bg-blue-500" :
                    activity.action === "updated" ? "bg-warning" : "bg-slate-400"
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{activity.description}</p>
                    <p className="text-xs text-slate-500">{formatTimeAgo(activity.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No recent activity</p>
            </div>
          )}
          
          {activities.length > 5 && (
            <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary/80">
              View All Activity
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Email Tasks Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Your Tasks</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Send to Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={handleEmailTasks}
                disabled={emailTasksMutation.isPending}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {emailTasksMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Send Tasks</span>
                  </div>
                )}
              </Button>
              <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
