
import { useEffect, useState } from "react";

export default function DarkModeToggle({ className = "" }) {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      /* no-op */
    }
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark((v) => !v)}
      className={`fixed bottom-4 right-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm 
                  backdrop-blur supports-[backdrop-filter]:bg-white/70 border-gray-300 text-gray-800 
                  hover:bg-white shadow-sm
                  dark:supports-[backdrop-filter]:bg-neutral-800/60 dark:border-neutral-700 dark:text-gray-100 
                  dark:hover:bg-neutral-800 ${className}`}
      aria-pressed={isDark}
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span aria-hidden="true">{isDark ? "🌙" : "☀️"}</span>
      <span>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
