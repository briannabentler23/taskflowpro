import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { 
  Target, 
  AlertTriangle, 
  Clock, 
  Zap,
  Coffee,
  Star,
  Calendar
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface TaskPrioritizationProps {
  eisenhowerQuadrant?: string;
  abcdePriority?: string;
  isEatTheFrog?: boolean;
  chunkSize?: string;
  estimatedTime?: number;
  onPrioritizationChange: (data: {
    eisenhowerQuadrant?: string;
    abcdePriority?: string;
    isEatTheFrog?: boolean;
    chunkSize?: string;
    estimatedTime?: number;
  }) => void;
}

const eisenhowerQuadrants = [
  { value: "urgent-important", label: "Urgent & Important", description: "Do First", color: "bg-red-100 text-red-800 border-red-200" },
  { value: "not-urgent-important", label: "Not Urgent & Important", description: "Schedule", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "urgent-not-important", label: "Urgent & Not Important", description: "Delegate", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "not-urgent-not-important", label: "Not Urgent & Not Important", description: "Eliminate", color: "bg-gray-100 text-gray-800 border-gray-200" },
];

const abcdePriorities = [
  { value: "A", label: "A - Must Do", description: "Serious consequences if not completed", color: "bg-red-100 text-red-800 border-red-200" },
  { value: "B", label: "B - Should Do", description: "Mild consequences if not completed", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { value: "C", label: "C - Nice to Do", description: "No consequences if not completed", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "D", label: "D - Delegate", description: "Assign to someone else", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "E", label: "E - Eliminate", description: "Remove from task list", color: "bg-gray-100 text-gray-800 border-gray-200" },
];

const chunkSizes = [
  { value: "small", label: "Small (15-30 min)", description: "Quick tasks or initial steps", icon: Clock },
  { value: "medium", label: "Medium (30-60 min)", description: "Focused work sessions", icon: Target },
  { value: "large", label: "Large (1-2 hours)", description: "Deep work or complex tasks", icon: Zap },
];

export default function TaskPrioritization({
  eisenhowerQuadrant,
  abcdePriority,
  isEatTheFrog = false,
  chunkSize,
  estimatedTime,
  onPrioritizationChange
}: TaskPrioritizationProps) {
  const { user } = useAuth();
  const method = (user as any)?.prioritizationMethod || "eisenhower";

  const [localEisenhower, setLocalEisenhower] = useState(eisenhowerQuadrant || "");
  const [localAbcde, setLocalAbcde] = useState(abcdePriority || "");
  const [localEatTheFrog, setLocalEatTheFrog] = useState(isEatTheFrog);
  const [localChunkSize, setLocalChunkSize] = useState(chunkSize || "");
  const [localEstimatedTime, setLocalEstimatedTime] = useState(estimatedTime || 30);

  useEffect(() => {
    onPrioritizationChange({
      eisenhowerQuadrant: localEisenhower || undefined,
      abcdePriority: localAbcde || undefined,
      isEatTheFrog: localEatTheFrog,
      chunkSize: localChunkSize || undefined,
      estimatedTime: localEstimatedTime,
    });
  }, [localEisenhower, localAbcde, localEatTheFrog, localChunkSize, localEstimatedTime, onPrioritizationChange]);

  const renderEisenhowerMatrix = () => (
    <Card className="border-elegant">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-gold" />
          <CardTitle className="text-sm text-foreground">Eisenhower Matrix</CardTitle>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Choose the appropriate quadrant for this task
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={localEisenhower} onValueChange={setLocalEisenhower} className="space-y-2">
          {eisenhowerQuadrants.map((quadrant) => (
            <div key={quadrant.value} className="flex items-center space-x-3 p-2 rounded border border-border hover:bg-accent/50">
              <RadioGroupItem value={quadrant.value} id={quadrant.value} />
              <div className="flex-1">
                <Label htmlFor={quadrant.value} className="text-sm font-medium text-foreground cursor-pointer">
                  {quadrant.label}
                </Label>
                <p className="text-xs text-muted-foreground">{quadrant.description}</p>
              </div>
              <Badge className={`text-xs ${quadrant.color}`}>
                {quadrant.description}
              </Badge>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );

  const renderEatTheFrog = () => (
    <Card className="border-elegant">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Coffee className="w-5 h-5 text-gold" />
          <CardTitle className="text-sm text-foreground">Eat The Frog</CardTitle>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Mark as your most important task of the day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-accent/20">
          <Checkbox
            id="eat-the-frog"
            checked={localEatTheFrog}
            onCheckedChange={(checked) => setLocalEatTheFrog(!!checked)}
          />
          <div className="flex-1">
            <Label htmlFor="eat-the-frog" className="text-sm font-medium text-foreground cursor-pointer">
              This is my most important task today
            </Label>
            <p className="text-xs text-muted-foreground">
              Complete this first thing in the morning for maximum productivity
            </p>
          </div>
          {localEatTheFrog && (
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              <Star className="w-3 h-3 mr-1" />
              Frog Task
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderAbcdeMethod = () => (
    <Card className="border-elegant">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-gold" />
          <CardTitle className="text-sm text-foreground">ABCDE Priority</CardTitle>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Assign a letter priority based on consequences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={localAbcde} onValueChange={setLocalAbcde} className="space-y-2">
          {abcdePriorities.map((priority) => (
            <div key={priority.value} className="flex items-center space-x-3 p-2 rounded border border-border hover:bg-accent/50">
              <RadioGroupItem value={priority.value} id={priority.value} />
              <div className="flex-1">
                <Label htmlFor={priority.value} className="text-sm font-medium text-foreground cursor-pointer">
                  {priority.label}
                </Label>
                <p className="text-xs text-muted-foreground">{priority.description}</p>
              </div>
              <Badge className={`text-xs ${priority.color}`}>
                {priority.value}
              </Badge>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );

  const renderChunkingMethod = () => (
    <Card className="border-elegant">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gold" />
          <CardTitle className="text-sm text-foreground">Task Chunking</CardTitle>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Break this task into manageable time chunks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-foreground mb-2 block">Chunk Size</Label>
          <RadioGroup value={localChunkSize} onValueChange={setLocalChunkSize} className="space-y-2">
            {chunkSizes.map((chunk) => (
              <div key={chunk.value} className="flex items-center space-x-3 p-2 rounded border border-border hover:bg-accent/50">
                <RadioGroupItem value={chunk.value} id={chunk.value} />
                <div className="flex-1">
                  <Label htmlFor={chunk.value} className="text-sm font-medium text-foreground cursor-pointer flex items-center gap-2">
                    <chunk.icon className="w-4 h-4 text-gold" />
                    {chunk.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{chunk.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div>
          <Label htmlFor="estimated-time" className="text-sm font-medium text-foreground mb-2 block">
            Estimated Time (minutes)
          </Label>
          <Input
            id="estimated-time"
            type="number"
            min="5"
            max="240"
            value={localEstimatedTime}
            onChange={(e) => setLocalEstimatedTime(parseInt(e.target.value) || 30)}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );

  const getMethodComponent = () => {
    switch (method) {
      case "eisenhower":
        return renderEisenhowerMatrix();
      case "eat-the-frog":
        return renderEatTheFrog();
      case "abcde":
        return renderAbcdeMethod();
      case "chunking":
        return renderChunkingMethod();
      default:
        return renderEisenhowerMatrix();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-gold" />
        <h3 className="text-sm font-medium text-foreground">Task Prioritization</h3>
        <Badge variant="outline" className="text-xs border-gold/30 text-gold">
          {method.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
        </Badge>
      </div>
      
      {getMethodComponent()}
    </div>
  );
}