const THEME_KEY = 'digitalpassport_theme';

// Доступные темы
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Получить текущую тему
export const getTheme = () => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved && (saved === THEMES.LIGHT || saved === THEMES.DARK)) {
    return saved;
  }
  return THEMES.LIGHT;
};

// Сохранить тему
export const saveTheme = (theme) => {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
  return theme;
};

// Применить тему
export const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

// Инициализация темы при загрузке страницы (вызывать сразу)
export const initTheme = () => {
  const savedTheme = getTheme();
  applyTheme(savedTheme);
};