import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TaskModal } from "@/components/TaskModal";
import { ListChecks, Edit, MoreVertical, User, Tag } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Task } from "@shared/schema";

export default function TaskList() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["/api/tasks"],
    retry: false,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<Task> }) => {
      const response = await apiRequest("PUT", `/api/tasks/${data.id}`, data.updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
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
        title: "Update Failed",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      await apiRequest("DELETE", `/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Task Deleted",
        description: "Task has been successfully deleted.",
      });
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
        title: "Delete Failed",
        description: "Failed to delete task",
        variant: "destructive",
      });
    },
  });

  const handleTaskCompletion = (task: Task, completed: boolean) => {
    updateTaskMutation.mutate({
      id: task.id,
      updates: { 
        status: completed ? "completed" : "pending",
        completedAt: completed ? new Date() : null,
      },
    });
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "priority-high";
      case "medium": return "priority-medium";
      case "low": return "priority-low";
      default: return "priority-medium";
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading tasks...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
              <ListChecks className="w-5 h-5 text-accent mr-2" />
              Your Tasks
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500">{tasks.length} tasks</span>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                <Edit className="w-4 h-4 mr-1" />
                Manage
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <ListChecks className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-2">No tasks yet</p>
              <p className="text-sm text-slate-500">Extract tasks from your communications to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task: Task) => (
                <div key={task.id} className="task-card group">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={task.status === "completed"}
                      onCheckedChange={(checked) => handleTaskCompletion(task, checked as boolean)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                        </Badge>
                        {task.dueDate && (
                          <span className="text-xs text-slate-500">
                            Due: {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                      
                      <h4 className={`font-medium ${task.status === "completed" ? "line-through text-slate-500" : "text-slate-900"}`}>
                        {task.title}
                      </h4>
                      
                      {task.description && (
                        <p className="text-sm text-slate-600 mt-1">{task.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-2 mt-3">
                        {task.assignee && (
                          <Badge variant="secondary" className="text-xs">
                            <User className="w-3 h-3 mr-1" />
                            {task.assignee}
                          </Badge>
                        )}
                        {task.tags && task.tags.length > 0 && (
                          <>
                            {task.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {task.tags.length > 2 && (
                              <span className="text-xs text-slate-500">
                                +{task.tags.length - 2} more
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="task-actions p-1 text-slate-400 hover:text-slate-600"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTask(task)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Task
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          Delete Task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
      />
    </>
  );
}
