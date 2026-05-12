"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true); // dark by default

  useEffect(() => {
    // On mount, check localStorage or default to dark
    const stored = localStorage.getItem("theme");
    const dark = stored ? stored === "dark" : true;
    //setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </Button>
  );
}