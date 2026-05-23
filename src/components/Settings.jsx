import React from 'react';
import { useTheme } from '../hooks/useTheme';
import './Settings.css';

const Settings = ({ onBack }) => {
  const { theme, changeTheme, THEMES } = useTheme();

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <button onClick={onBack} className="back-button">← Назад</button>
        <h1>Настройки</h1>
      </header>

      <div className="settings-content">
        <div className="settings-section">
          <h3>🎨 Внешний вид</h3>
          <div className="settings-option">
            <label>Тема</label>
            <div className="theme-buttons">
              <button 
                className={`theme-btn ${theme === THEMES.LIGHT ? 'active' : ''}`} 
                onClick={() => handleThemeChange(THEMES.LIGHT)}
              >
                ☀️ Светлая
              </button>
              <button 
                className={`theme-btn ${theme === THEMES.DARK ? 'active' : ''}`} 
                onClick={() => handleThemeChange(THEMES.DARK)}
              >
                🌙 Тёмная
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>🔐 Аккаунт</h3>
          <div className="settings-option">
            <button className="settings-action-btn disabled" disabled>
              🔐 Сменить пароль
            </button>
            <button className="settings-action-btn delete-btn disabled" disabled>
              🗑️ Удалить аккаунт
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;