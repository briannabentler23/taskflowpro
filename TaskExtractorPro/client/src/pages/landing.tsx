import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MessageSquare, Calendar, Mail, Zap, Brain } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 gradient-gold rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-black" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">TaskFlowPro</h1>
            </div>
            <Button onClick={handleLogin} className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Welcome to TaskFlowPro
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Transform your communications into organized to-do lists automatically. 
            Extract actionable tasks from meeting transcripts, voicemails, and messages with AI.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
            >
              Start Extracting Tasks
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Smart AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced natural language processing extracts actionable tasks from any communication text with context and priority.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Multiple Input Types</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Process meeting transcripts, voicemail transcriptions, chat messages, and any text-based communication.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Task Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Organize tasks with priorities, due dates, assignees, and tags. Track progress and completion rates.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-warning" />
                </div>
                <CardTitle>Calendar Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create calendar events from extracted tasks and sync with your existing scheduling tools.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Email Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Share task lists via email and integrate with your team's workflow tools and communication platforms.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  One-click integrations with popular productivity tools and instant task sharing capabilities.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Ready to streamline your workflow?</h2>
          <p className="mt-4 text-lg text-slate-600">
            Join thousands of professionals who use TaskFlow to extract actionable insights from their communications.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            className="mt-8 bg-primary hover:bg-primary/90"
          >
            Get Started Now
          </Button>
        </div>
      </main>
    </div>
  );
}
