import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import './Settings.css';

const Settings = ({ onBack }) => {
  const { theme, changeTheme, THEMES } = useTheme();
  const { changePassword, deleteAccount } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }
    if (newPassword.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setError('Пароль должен содержать хотя бы одну заглавную букву');
      return;
    }
    if (!/\d/.test(newPassword)) {
      setError('Пароль должен содержать хотя бы одну цифру');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await changePassword(oldPassword, newPassword);
      setShowPasswordModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Пароль успешно изменён');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!window.confirm('ВНИМАНИЕ! Это действие необратимо. Все ваши данные будут удалены. Вы уверены?')) {
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await deleteAccount(deletePassword);
      setShowDeleteModal(false);
      alert('Аккаунт успешно удалён');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
            <button 
              className="settings-action-btn" 
              onClick={() => setShowPasswordModal(true)}
            >
              🔐 Сменить пароль
            </button>
            <button 
              className="settings-action-btn delete-btn" 
              onClick={() => setShowDeleteModal(true)}
            >
              🗑️ Удалить аккаунт
            </button>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Смена пароля</h3>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>✕</button>
            </div>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Текущий пароль</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Новый пароль</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <small>Минимум 8 символов, заглавная буква и цифра</small>
              </div>
              <div className="form-group">
                <label>Подтвердите новый пароль</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowPasswordModal(false)} disabled={loading}>
                  Отмена
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Сохранение...' : 'Сменить пароль'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Удаление аккаунта</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>✕</button>
            </div>
            <form onSubmit={handleDeleteAccount}>
              <div className="warning-text">
                ⚠️ ВНИМАНИЕ! Это действие необратимо. Все ваши данные будут удалены.
              </div>
              <div className="form-group">
                <label>Введите пароль для подтверждения</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowDeleteModal(false)} disabled={loading}>
                  Отмена
                </button>
                <button type="submit" className="delete-btn" disabled={loading}>
                  {loading ? 'Удаление...' : 'Удалить аккаунт'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;