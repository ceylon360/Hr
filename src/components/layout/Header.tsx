import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { CalendarDays, Calendar, Settings as SettingsIcon } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Employee Manager
            </h1>
          </div>

          <nav className="flex items-center gap-4">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              Schedule
            </Button>
            <Button
              variant={location.pathname === "/holidays" ? "default" : "ghost"}
              onClick={() => navigate("/holidays")}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Holidays
            </Button>
            <Button
              variant={location.pathname === "/settings" ? "default" : "ghost"}
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2"
            >
              <SettingsIcon className="h-4 w-4" />
              Settings
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
