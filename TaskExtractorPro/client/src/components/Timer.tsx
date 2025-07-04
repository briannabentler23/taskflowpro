import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Project, Task } from "@shared/schema";

// Timer component with both standard and Pomodoro modes
export default function Timer() {
  const [timerMode, setTimerMode] = useState<"standard" | "pomodoro">("standard");
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  
  // Pomodoro specific state
  const [pomodoroPhase, setPomodoroPhase] = useState<"work" | "short_break" | "long_break">("work");
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get projects and tasks for selection
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Timer management
  const startTimerMutation = useMutation({
    mutationFn: async (data: { timerType: string; projectId?: number; taskId?: number }) => {
      const response = await apiRequest('POST', '/api/timer-sessions', data);
      return await response.json();
    },
    onSuccess: (session: any) => {
      setCurrentSessionId(session.id);
      toast({
        title: "Timer Started",
        description: `${timerMode === "pomodoro" ? "Pomodoro" : "Standard"} timer session started`,
      });
    },
  });

  const updateTimerMutation = useMutation({
    mutationFn: async (data: { id: number; duration: number; isCompleted: boolean; notes?: string; endedAt?: Date }) => {
      const { id, ...updateData } = data;
      const response = await apiRequest('PUT', `/api/timer-sessions/${id}`, updateData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
  });

  const createPomodoroSessionMutation = useMutation({
    mutationFn: async (data: { 
      sessionType: "work" | "short_break" | "long_break";
      duration: number;
      projectId?: number;
      taskId?: number;
    }) => {
      const response = await apiRequest('POST', '/api/pomodoro-sessions', data);
      return await response.json();
    },
  });

  const completePomodoroSessionMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      const response = await apiRequest('PUT', `/api/pomodoro-sessions/${sessionId}/complete`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rewards"] });
      toast({
        title: "Pomodoro Completed! ⭐",
        description: "Great work! You've earned a star.",
      });
    },
  });

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (timerMode === "standard") {
          setTimeElapsed(prev => prev + 1);
        } else {
          setPomodoroTimeLeft(prev => {
            if (prev <= 1) {
              // Pomodoro phase completed
              handlePomodoroPhaseComplete();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timerMode]);

  const handlePomodoroPhaseComplete = async () => {
    setIsRunning(false);
    
    if (pomodoroPhase === "work") {
      // Complete work session
      const workSession: any = await createPomodoroSessionMutation.mutateAsync({
        sessionType: "work",
        duration: 25 * 60,
        projectId: selectedProject || undefined,
        taskId: selectedTask || undefined,
      });
      
      await completePomodoroSessionMutation.mutateAsync(workSession.id);
      
      setPomodoroCount(prev => prev + 1);
      
      // Determine next phase
      if (pomodoroCount + 1 >= 4) {
        setPomodoroPhase("long_break");
        setPomodoroTimeLeft(15 * 60); // 15 minutes
        setPomodoroCount(0);
      } else {
        setPomodoroPhase("short_break");
        setPomodoroTimeLeft(5 * 60); // 5 minutes
      }
    } else {
      // Break completed, back to work
      setPomodoroPhase("work");
      setPomodoroTimeLeft(25 * 60);
    }
    
    toast({
      title: `${pomodoroPhase === "work" ? "Work session" : "Break"} completed!`,
      description: `Time for a ${pomodoroPhase === "work" ? (pomodoroCount + 1 >= 4 ? "long break" : "short break") : "work session"}`,
    });
  };

  const startTimer = async () => {
    if (timerMode === "standard") {
      await startTimerMutation.mutateAsync({
        timerType: "standard",
        projectId: selectedProject || undefined,
        taskId: selectedTask || undefined,
      });
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = async () => {
    setIsRunning(false);
    
    if (currentSessionId && timerMode === "standard") {
      await updateTimerMutation.mutateAsync({
        id: currentSessionId,
        duration: timeElapsed,
        isCompleted: true,
        notes: notes || undefined,
        endedAt: new Date(),
      });
    }
    
    // Reset timer
    setTimeElapsed(0);
    setCurrentSessionId(null);
    setNotes("");
    
    toast({
      title: "Timer Stopped",
      description: `Session completed! Time tracked: ${formatTime(timeElapsed)}`,
    });
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeElapsed(0);
    setPomodoroTimeLeft(25 * 60);
    setPomodoroPhase("work");
    setCurrentSessionId(null);
    setNotes("");
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const displayTime = timerMode === "standard" ? timeElapsed : pomodoroTimeLeft;
  const phaseDisplay = timerMode === "pomodoro" ? 
    (pomodoroPhase === "work" ? "Focus Time" : 
     pomodoroPhase === "short_break" ? "Short Break" : "Long Break") : "";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Timer
            <Select value={timerMode} onValueChange={(value: "standard" | "pomodoro") => setTimerMode(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Timer</SelectItem>
                <SelectItem value="pomodoro">Pomodoro Timer</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-primary mb-2">
              {formatTime(displayTime)}
            </div>
            {timerMode === "pomodoro" && (
              <div className="text-lg text-muted-foreground">
                {phaseDisplay} • Session {pomodoroCount + 1}/4
              </div>
            )}
          </div>

          {/* Project and Task Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project-select">Project (Optional)</Label>
              <Select value={selectedProject?.toString() || ""} onValueChange={(value) => setSelectedProject(value ? parseInt(value) : null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project..." />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: project.color || "#3b82f6" } as React.CSSProperties}
                        />
                        {project.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="task-select">Task (Optional)</Label>
              <Select value={selectedTask?.toString() || ""} onValueChange={(value) => setSelectedTask(value ? parseInt(value) : null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a task..." />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map(task => (
                    <SelectItem key={task.id} value={task.id.toString()}>
                      {task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <Button onClick={startTimer} size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Start
              </Button>
            ) : (
              <Button onClick={pauseTimer} variant="secondary" size="lg" className="gap-2">
                <Pause className="w-5 h-5" />
                Pause
              </Button>
            )}
            
            {timerMode === "standard" && (
              <Button onClick={stopTimer} variant="destructive" size="lg" className="gap-2">
                <Square className="w-5 h-5" />
                Stop
              </Button>
            )}
            
            <Button onClick={resetTimer} variant="outline" size="lg" className="gap-2">
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          </div>

          {/* Notes */}
          {timerMode === "standard" && (
            <div>
              <Label htmlFor="notes">Session Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about what you worked on..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Pomodoro Progress */}
          {timerMode === "pomodoro" && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Today's Progress</span>
                <span className="text-sm text-muted-foreground">{pomodoroCount} completed</span>
              </div>
              <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded ${
                      i < pomodoroCount ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}