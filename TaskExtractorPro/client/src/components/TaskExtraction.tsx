import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Upload, Mic, FileText, Brain } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function TaskExtraction() {
  const [inputText, setInputText] = useState("");
  const [inputType, setInputType] = useState<"text" | "file" | "voice">("text");
  const [summary, setSummary] = useState<string>("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const extractTasksMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; type: string }) => {
      const response = await apiRequest("POST", "/api/communications/extract", data);
      return response.json();
    },
    onSuccess: (data) => {
      setSummary(data.communication.summary);
      // Invalidate tasks query to refresh the task list
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      
      toast({
        title: "Tasks Extracted Successfully",
        description: `Found ${data.tasks.length} actionable tasks in your communication.`,
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
        title: "Extraction Failed",
        description: error instanceof Error ? error.message : "Failed to extract tasks from communication",
        variant: "destructive",
      });
    },
  });

  const handleExtractTasks = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some communication text to extract tasks from.",
        variant: "destructive",
      });
      return;
    }

    extractTasksMutation.mutate({
      title: "Communication Input",
      content: inputText,
      type: inputType,
    });
  };

  const inputTypeButtons = [
    { id: "text" as const, label: "Paste Text", icon: FileText },
    { id: "file" as const, label: "Upload File", icon: Upload },
    { id: "voice" as const, label: "Voice Input", icon: Mic },
  ];

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Extract Tasks from Communication
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500">AI Processing</span>
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input Type Selector */}
          <div className="flex space-x-2">
            {inputTypeButtons.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={inputType === id ? "default" : "outline"}
                size="sm"
                onClick={() => setInputType(id)}
                className={inputType === id ? "bg-primary text-white" : ""}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>

          {/* Text Input Area */}
          <div className="relative">
            <Textarea 
              placeholder="Paste your meeting transcript, voicemail transcription, or message log here..."
              className="min-h-[160px] resize-none"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-500">
              {inputText.length} characters
            </div>
          </div>

          {/* Processing Button */}
          <Button 
            onClick={handleExtractTasks}
            disabled={extractTasksMutation.isPending || !inputText.trim()}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {extractTasksMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing with AI...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Extract Tasks with AI</span>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* AI Summary Section */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
              <Brain className="w-5 h-5 text-secondary mr-2" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-secondary">
              <p className="text-slate-700 leading-relaxed">{summary}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
