import { useState, useEffect } from 'react';
import { getTheme, saveTheme, applyTheme, THEMES } from '../utils/themeManager';

export const useTheme = () => {
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    // Слушаем изменения темы в localStorage (если тема изменилась в другой вкладке)
    const handleStorageChange = (e) => {
      if (e.key === THEME_KEY) {
        setTheme(e.newValue || THEMES.LIGHT);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    saveTheme(newTheme);
    applyTheme(newTheme);
  };

  return {
    theme,
    changeTheme,
    THEMES
  };
};