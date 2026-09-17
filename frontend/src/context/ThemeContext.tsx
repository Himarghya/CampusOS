import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'cyber-obsidian' | 'midnight-navy' | 'emerald-matrix' | 'royal-amethyst' | 'clean-light';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDark: boolean;
  accentColor: string;
}

export const themesList: Array<{
  id: ThemeMode;
  name: string;
  desc: string;
  previewBg: string;
  previewPrimary: string;
  previewSecondary: string;
  isDark: boolean;
}> = [
  {
    id: 'cyber-obsidian',
    name: 'Cyber Obsidian (Default)',
    desc: 'Deep Charcoal, Neon Cyan & Electric Violet glow',
    previewBg: '#0B0F17',
    previewPrimary: '#00F2FE',
    previewSecondary: '#A855F7',
    isDark: true,
  },
  {
    id: 'midnight-navy',
    name: 'Midnight Sapphire',
    desc: 'Deep Space Navy, Electric Blue & Sky Cyan',
    previewBg: '#0A1128',
    previewPrimary: '#38BDF8',
    previewSecondary: '#818CF8',
    isDark: true,
  },
  {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    desc: 'Deep Obsidian Jade, Neon Emerald & Mint',
    previewBg: '#081410',
    previewPrimary: '#10B981',
    previewSecondary: '#34D399',
    isDark: true,
  },
  {
    id: 'royal-amethyst',
    name: 'Royal Amethyst',
    desc: 'Dark Void Violet, Vivid Purple & Neon Rose',
    previewBg: '#0F0B1E',
    previewPrimary: '#C084FC',
    previewSecondary: '#F43F5E',
    isDark: true,
  },
  {
    id: 'clean-light',
    name: 'Clean Day Light',
    desc: 'Crisp Slate Canvas with Indigo & Sky Accents',
    previewBg: '#F8FAFC',
    previewPrimary: '#4F46E5',
    previewSecondary: '#0EA5E9',
    isDark: false,
  },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('campusos_theme') as ThemeMode;
    return saved && themesList.some((t) => t.id === saved) ? saved : 'cyber-obsidian';
  });

  const currentThemeObj = themesList.find((t) => t.id === theme) || themesList[0];
  const isDark = currentThemeObj.isDark;

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('campusos_theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    // Remove all previous theme classes
    themesList.forEach((t) => root.classList.remove(`theme-${t.id}`));
    root.classList.remove('dark', 'light');

    // Add current theme class
    root.classList.add(`theme-${theme}`);
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }

    // Set body background directly for instant seamless rendering
    document.body.style.backgroundColor = currentThemeObj.previewBg;
  }, [theme, isDark, currentThemeObj]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDark,
        accentColor: currentThemeObj.previewPrimary,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
