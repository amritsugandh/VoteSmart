import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('votesmart_theme') || 'dark');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('votesmart_fontsize') || 'normal');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('votesmart_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('votesmart_fontsize', fontSize);
  }, [fontSize]);

  const cycleTheme = () => {
    const themes = ['dark', 'light', 'high-contrast'];
    const idx = themes.indexOf(theme);
    setTheme(themes[(idx + 1) % themes.length]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
