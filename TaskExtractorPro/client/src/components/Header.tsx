import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle, Bell, ChevronDown, LogOut, Clock, Home, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const { user } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const getDisplayName = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName || lastName) {
      return `${firstName || ""} ${lastName || ""}`.trim();
    }
    return email || "User";
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 gradient-gold rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">TaskFlowPro</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"} 
                size="sm" 
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/timer">
              <Button 
                variant={location === "/timer" ? "default" : "ghost"} 
                size="sm" 
                className="gap-2"
              >
                <Clock className="w-4 h-4" />
                Timer
              </Button>
            </Link>
            <Link href="/settings">
              <Button 
                variant={location === "/settings" ? "default" : "ghost"} 
                size="sm" 
                className="gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="p-2 text-muted-foreground hover:text-foreground">
              <Bell className="w-4 h-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-10">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profileImageUrl || ""} alt="User avatar" />
                    <AvatarFallback className="text-xs">
                      {getInitials(user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground hidden sm:block">
                    {getDisplayName(user?.firstName, user?.lastName, user?.email)}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleLogout} className="text-foreground hover:text-primary">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
