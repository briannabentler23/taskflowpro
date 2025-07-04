import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import TaskModal from "./TaskModal";
import { 
  Target, 
  AlertTriangle, 
  Clock, 
  Zap,
  Coffee,
  Star,
  Calendar,
  User,
  Tag,
  Edit3
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { Task } from "@shared/schema";
import { cn } from "@/lib/utils";

interface PrioritizedTaskListProps {
  onTaskEdit: (task: Task) => void;
  onTaskComplete: (task: Task, completed: boolean) => void;
}

const eisenhowerColors = {
  "urgent-important": "bg-red-100 text-red-800 border-red-200",
  "not-urgent-important": "bg-blue-100 text-blue-800 border-blue-200",
  "urgent-not-important": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "not-urgent-not-important": "bg-gray-100 text-gray-800 border-gray-200",
};

const abcdeColors = {
  "A": "bg-red-100 text-red-800 border-red-200",
  "B": "bg-orange-100 text-orange-800 border-orange-200",
  "C": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "D": "bg-blue-100 text-blue-800 border-blue-200",
  "E": "bg-gray-100 text-gray-800 border-gray-200",
};

const chunkColors = {
  "small": "bg-green-100 text-green-800 border-green-200",
  "medium": "bg-blue-100 text-blue-800 border-blue-200",
  "large": "bg-purple-100 text-purple-800 border-purple-200",
};

export default function PrioritizedTaskList({ onTaskEdit, onTaskComplete }: PrioritizedTaskListProps) {
  const { user } = useAuth();
  const method = (user as any)?.prioritizationMethod || "eisenhower";

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["/api/tasks"],
  });

  const sortTasksByMethod = (tasks: Task[]) => {
    switch (method) {
      case "eisenhower":
        return tasks.sort((a, b) => {
          const order = ["urgent-important", "not-urgent-important", "urgent-not-important", "not-urgent-not-important"];
          const aIndex = order.indexOf(a.eisenhowerQuadrant || "not-urgent-not-important");
          const bIndex = order.indexOf(b.eisenhowerQuadrant || "not-urgent-not-important");
          return aIndex - bIndex;
        });
      case "abcde":
        return tasks.sort((a, b) => {
          const order = ["A", "B", "C", "D", "E"];
          const aIndex = order.indexOf(a.abcdePriority || "C");
          const bIndex = order.indexOf(b.abcdePriority || "C");
          return aIndex - bIndex;
        });
      case "eat-the-frog":
        return tasks.sort((a, b) => {
          if (a.isEatTheFrog && !b.isEatTheFrog) return -1;
          if (!a.isEatTheFrog && b.isEatTheFrog) return 1;
          return 0;
        });
      case "chunking":
        return tasks.sort((a, b) => {
          const order = ["small", "medium", "large"];
          const aIndex = order.indexOf(a.chunkSize || "medium");
          const bIndex = order.indexOf(b.chunkSize || "medium");
          return aIndex - bIndex;
        });
      default:
        return tasks;
    }
  };

  const getTaskPriorityBadge = (task: Task) => {
    switch (method) {
      case "eisenhower":
        if (!task.eisenhowerQuadrant) return null;
        const eisenhowerLabels = {
          "urgent-important": "Do First",
          "not-urgent-important": "Schedule",
          "urgent-not-important": "Delegate",
          "not-urgent-not-important": "Eliminate",
        };
        return (
          <Badge className={cn("text-xs", eisenhowerColors[task.eisenhowerQuadrant as keyof typeof eisenhowerColors])}>
            <Target className="w-3 h-3 mr-1" />
            {eisenhowerLabels[task.eisenhowerQuadrant as keyof typeof eisenhowerLabels]}
          </Badge>
        );
      case "abcde":
        if (!task.abcdePriority) return null;
        return (
          <Badge className={cn("text-xs", abcdeColors[task.abcdePriority as keyof typeof abcdeColors])}>
            <Zap className="w-3 h-3 mr-1" />
            Priority {task.abcdePriority}
          </Badge>
        );
      case "eat-the-frog":
        if (!task.isEatTheFrog) return null;
        return (
          <Badge className="text-xs bg-orange-100 text-orange-800 border-orange-200">
            <Coffee className="w-3 h-3 mr-1" />
            Frog Task
          </Badge>
        );
      case "chunking":
        if (!task.chunkSize) return null;
        const chunkLabels = {
          "small": "15-30 min",
          "medium": "30-60 min",
          "large": "1-2 hours",
        };
        return (
          <Badge className={cn("text-xs", chunkColors[task.chunkSize as keyof typeof chunkColors])}>
            <Clock className="w-3 h-3 mr-1" />
            {chunkLabels[task.chunkSize as keyof typeof chunkLabels]}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getMethodDescription = () => {
    switch (method) {
      case "eisenhower":
        return "Tasks organized by urgency and importance quadrants";
      case "abcde":
        return "Tasks prioritized by consequence levels (A=Must do, B=Should do, etc.)";
      case "eat-the-frog":
        return "Most important tasks highlighted for morning completion";
      case "chunking":
        return "Tasks organized by estimated time chunks";
      default:
        return "Tasks organized by your preferred method";
    }
  };

  const sortedTasks = sortTasksByMethod(tasks.filter((task: Task) => task.status !== "completed"));

  if (isLoading) {
    return (
      <Card className="border-elegant">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-elegant">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-gold" />
              Prioritized Tasks
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {getMethodDescription()}
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-gold/30 text-gold">
            {method.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())} Method
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Tasks Yet</h3>
            <p className="text-muted-foreground">Create your first task to see prioritization in action!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTasks.map((task: Task) => (
              <div
                key={task.id}
                className={cn(
                  "p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors",
                  task.status === "completed" && "opacity-60"
                )}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={task.status === "completed"}
                    onCheckedChange={(checked) => onTaskComplete(task, !!checked)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-foreground">{task.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onTaskEdit(task)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {getTaskPriorityBadge(task)}
                      
                      {task.dueDate && (
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </Badge>
                      )}
                      
                      {task.assignee && (
                        <Badge variant="outline" className="text-xs">
                          <User className="w-3 h-3 mr-1" />
                          {task.assignee}
                        </Badge>
                      )}
                      
                      {task.estimatedTime && method === "chunking" && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {task.estimatedTime} min
                        </Badge>
                      )}
                      
                      {task.tags && task.tags.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {task.tags.slice(0, 2).join(", ")}
                          {task.tags.length > 2 && " +more"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}