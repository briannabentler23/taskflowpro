import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { 
  Target, 
  Coffee, 
  Zap, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Brain
} from "lucide-react";

const prioritizationMethods = [
  {
    id: "eisenhower",
    name: "Eisenhower Matrix",
    description: "Organize tasks by urgency and importance into four quadrants",
    icon: Target,
    features: [
      "Urgent & Important (Do First)",
      "Important & Not Urgent (Schedule)",
      "Urgent & Not Important (Delegate)",
      "Neither (Eliminate)"
    ],
    bestFor: "Strategic planning and long-term productivity"
  },
  {
    id: "eat-the-frog",
    name: "Eat The Frog",
    description: "Tackle your most challenging task first thing in the morning",
    icon: Coffee,
    features: [
      "Identify the most important task",
      "Complete it first thing in the day",
      "Build momentum for other tasks",
      "Reduce procrastination"
    ],
    bestFor: "Overcoming procrastination and building daily momentum"
  },
  {
    id: "abcde",
    name: "ABCDE Method",
    description: "Assign letter priorities from A (must do) to E (eliminate)",
    icon: Zap,
    features: [
      "A: Must do - serious consequences",
      "B: Should do - mild consequences", 
      "C: Nice to do - no consequences",
      "D: Delegate to someone else",
      "E: Eliminate - unnecessary tasks"
    ],
    bestFor: "Clear priority ranking and consequence-based decisions"
  },
  {
    id: "chunking",
    name: "Chunking Method",
    description: "Break large tasks into smaller, manageable chunks by time or complexity",
    icon: Clock,
    features: [
      "Small chunks (15-30 minutes)",
      "Medium chunks (30-60 minutes)",
      "Large chunks (1-2 hours)",
      "Focus on one chunk at a time"
    ],
    bestFor: "Managing overwhelming projects and maintaining focus"
  }
];

export default function PrioritizationSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMethod, setSelectedMethod] = useState(user?.prioritizationMethod || "eisenhower");

  const updateMethodMutation = useMutation({
    mutationFn: async (method: string) => {
      const response = await fetch("/api/auth/user/prioritization", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ method }),
      });
      if (!response.ok) {
        throw new Error("Failed to update prioritization method");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your prioritization method has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update prioritization method. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    updateMethodMutation.mutate(selectedMethod);
  };

  const currentMethod = prioritizationMethods.find(m => m.id === (user?.prioritizationMethod || "eisenhower"));

  return (
    <div className="space-y-6">
      {/* Current Method Overview */}
      {currentMethod && (
        <Card className="border-elegant bg-card/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-gold rounded-lg flex items-center justify-center">
                <currentMethod.icon className="w-5 h-5 text-black" />
              </div>
              <div>
                <CardTitle className="text-foreground">Current Method: {currentMethod.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {currentMethod.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Method Selection */}
      <Card className="border-elegant">
        <CardHeader>
          <CardTitle className="text-foreground">Choose Your Prioritization Method</CardTitle>
          <CardDescription className="text-muted-foreground">
            Select the task prioritization approach that works best for your workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-4">
            {prioritizationMethods.map((method) => (
              <div key={method.id} className="space-y-3">
                <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <div className="flex-1">
                    <Label 
                      htmlFor={method.id}
                      className="flex items-center gap-3 cursor-pointer text-base font-medium text-foreground"
                    >
                      <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                        <method.icon className="w-4 h-4 text-accent-foreground" />
                      </div>
                      {method.name}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1 ml-11">
                      {method.description}
                    </p>
                    <div className="mt-2 ml-11">
                      <Badge variant="outline" className="text-xs border-gold/30 text-gold">
                        {method.bestFor}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {selectedMethod === method.id && (
                  <div className="ml-11 p-3 bg-accent/30 rounded-lg border-l-4 border-gold">
                    <h4 className="font-medium text-foreground mb-2">Key Features:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {method.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-gold flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-end pt-6">
            <Button
              onClick={handleSave}
              disabled={updateMethodMutation.isPending || selectedMethod === user?.prioritizationMethod}
              className="bg-primary hover:bg-primary/90"
            >
              {updateMethodMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Method Comparison */}
      <Card className="border-elegant">
        <CardHeader>
          <CardTitle className="text-foreground">Quick Comparison</CardTitle>
          <CardDescription className="text-muted-foreground">
            Choose based on your work style and goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Brain className="w-4 h-4 text-gold" />
                <span className="font-medium">For Strategic Thinkers:</span>
              </div>
              <div className="text-sm text-muted-foreground pl-6">
                Eisenhower Matrix, ABCDE Method
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <AlertTriangle className="w-4 h-4 text-gold" />
                <span className="font-medium">For Procrastinators:</span>
              </div>
              <div className="text-sm text-muted-foreground pl-6">
                Eat The Frog, Chunking Method
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Calendar className="w-4 h-4 text-gold" />
                <span className="font-medium">For Busy Professionals:</span>
              </div>
              <div className="text-sm text-muted-foreground pl-6">
                Eisenhower Matrix, ABCDE Method
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Clock className="w-4 h-4 text-gold" />
                <span className="font-medium">For Large Projects:</span>
              </div>
              <div className="text-sm text-muted-foreground pl-6">
                Chunking Method, Eat The Frog
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}