"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
  mounted: boolean;
}

const ThemeContext =
  React.createContext<ThemeContextValue | undefined>(
    undefined
  );

/**
 * Get the user's operating system theme.
 */
function getSystemTheme(): "light" | "dark" {
  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light";
}

/**
 * Apply the selected theme to <html>.
 */
function applyTheme(
  theme: Theme,
  animate = false
): "light" | "dark" {
  const root = document.documentElement;

  if (animate) {
    root.classList.add("theme-transition");
  }

  const resolved =
    theme === "system"
      ? getSystemTheme()
      : theme;

  root.classList.remove("light", "dark");
  root.classList.add(resolved);

  if (animate) {
    window.setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 350);
  }

  return resolved;
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] =
    React.useState<Theme>("system");

  const [resolvedTheme, setResolvedTheme] =
    React.useState<"light" | "dark">("light");

  const [mounted, setMounted] =
    React.useState(false);

  /**
   * Restore the saved theme after the component mounts.
   */
  React.useEffect(() => {
    const saved =
      localStorage.getItem(
        "instant-mechanic-theme"
      ) as Theme | null;

    const initialTheme =
      saved === "light" ||
      saved === "dark" ||
      saved === "system"
        ? saved
        : "system";

    const resolved = applyTheme(
      initialTheme,
      false
    );

    setThemeState(initialTheme);
    setResolvedTheme(resolved);
    setMounted(true);

    /**
     * Theme has now been applied.
     * Reveal the application.
     */
    document.documentElement.classList.remove(
      "theme-loading"
    );

    document.documentElement.classList.add(
      "theme-ready"
    );
  }, []);

  /**
   * Change the theme.
   */
  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      localStorage.setItem(
        "instant-mechanic-theme",
        newTheme
      );

      setThemeState(newTheme);

      const resolved = applyTheme(
        newTheme,
        true
      );

      setResolvedTheme(resolved);
    },
    []
  );

  /**
   * Watch for operating-system theme changes
   * when the user has selected "System".
   */
  React.useEffect(() => {
    if (!mounted || theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleChange = () => {
      const resolved = applyTheme(
        "system",
        true
      );

      setResolvedTheme(resolved);
    };

    mediaQuery.addEventListener(
      "change",
      handleChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleChange
      );
    };
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    React.useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}