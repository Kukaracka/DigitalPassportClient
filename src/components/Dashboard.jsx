import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = ({ user, onLogout, onNavigate }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 768 && window.innerWidth > 480);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth <= 480);
      setIsTablet(window.innerWidth <= 768 && window.innerWidth > 480);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentUser = user;
  const avatarUrl = user?.avatar_url;

  const getDisplayName = () => {
    if (!currentUser?.first_name) return 'Пользователь';
    const name = currentUser.first_name;
    if (isMobile && name.length > 10) {
      return name.substring(0, 8) + '...';
    }
    if (isTablet && name.length > 15) {
      return name.substring(0, 12) + '...';
    }
    return name;
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>DigitalPassport</h1>
        <div className="user-info">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="avatar" 
              className="header-avatar"
              onError={(e) => {
                e.target.style.display = 'none';
                const placeholder = e.target.parentNode.querySelector('.header-avatar-placeholder');
                if (placeholder) placeholder.style.display = 'flex';
              }}
            />
          ) : null}
          
          {!avatarUrl && (
            <div className="header-avatar-placeholder">
              {currentUser?.first_name?.[0]}{currentUser?.last_name?.[0]}
            </div>
          )}
          
          <span className="welcome-text" title={`Добро пожаловать, ${getDisplayName()}!`}>
            Добро пожаловать, {getDisplayName()}!
          </span>
          <button onClick={onLogout} className="logout-button">
            Выйти
          </button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>Добро пожаловать!</h2>
          <p>Управляйте вашими цифровыми документами и данными в одном безопасном месте</p>
        </div>
        
        <div 
          className="dashboard-card clickable-card"
          onClick={() => onNavigate('profile')}
        >
          <h3>👤 Профиль</h3>
          <p>Редактировать профиль</p>
        </div>
        
        <div 
          className="dashboard-card clickable-card"
          onClick={() => onNavigate('products')}
        >
          <h3>📦 Мои продукты</h3>
          <p>Мои продукты</p>
        </div>
        
        <div 
          className="dashboard-card clickable-card"
          onClick={() => onNavigate('history')}
        >
          <h3>📈 История</h3>
          <p>История действий</p>
        </div>
        
        <div 
          className="dashboard-card clickable-card"
          onClick={() => onNavigate('settings')}
        >
          <h3>🛠️ Настройки</h3>
          <p>Внешний вид</p>
        </div>
        
      </main>
    </div>
  );
};

export default Dashboard;