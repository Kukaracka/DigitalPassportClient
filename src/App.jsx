import React, { useState, useEffect, useRef } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Profile from './components/Profile';
import Settings from './components/Settings';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './hooks/useAuth';
import { useRoute } from './contexts/RouteContext';
import './App.css';

function App() {
  const { 
    isAuthenticated, 
    user, 
    loading: authLoading, 
    error, 
    login, 
    register, 
    updateUser,
    uploadAvatar,
    logout,
    clearError 
  } = useAuth();
  
  const { currentView, navigate } = useRoute();
  const [transitionLoading, setTransitionLoading] = useState(false);
  const [appLoading, setAppLoading] = useState(true);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated && !hasCheckedRef.current) {
      hasCheckedRef.current = true;
      const savedView = localStorage.getItem('lastView');
      if (savedView && savedView !== currentView && savedView !== 'login' && savedView !== 'register') {
        navigate(savedView);
      }
    }
  }, [isAuthenticated, authLoading, currentView, navigate]);

  const handleLogin = async (credentials) => {
    setTransitionLoading(true);
    try {
      await login(credentials);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setTransitionLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setTransitionLoading(true);
    try {
      await register(userData);
      navigate('login');
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setTransitionLoading(false);
    }
  };

  const handleUpdateUser = async (userData) => {
    setTransitionLoading(true);
    try {
      await updateUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setTransitionLoading(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    setTransitionLoading(true);
    try {
      await uploadAvatar(file);
    } catch (error) {
      throw error;
    } finally {
      setTransitionLoading(false);
    }
  };

  const handleLogout = async () => {
    setTransitionLoading(true);
    try {
      await logout();
      localStorage.removeItem('lastView');
      navigate('login');
    } finally {
      setTransitionLoading(false);
    }
  };

  if (appLoading || authLoading || transitionLoading) {
    return <LoadingSpinner message="Загрузка..." />;
  }

  if (!isAuthenticated) {
    return (
      <div className="App">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={clearError}>×</button>
          </div>
        )}
        {currentView === 'login' ? (
          <Login 
            onSwitchToRegister={() => navigate('register')}
            onLogin={handleLogin}
            error={error}
          />
        ) : (
          <Register 
            onSwitchToLogin={() => navigate('login')}
            onRegister={handleRegister}
            error={error}
          />
        )}
      </div>
    );
  }

  return (
    <div className="App">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={clearError}>×</button>
        </div>
      )}
      
      {currentView === 'dashboard' && (
        <Dashboard 
          user={user} 
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
          onAvatarUpload={handleAvatarUpload}
          onNavigate={navigate}
        />
      )}
      
      {currentView === 'profile' && (
        <Profile 
          user={user} 
          onBack={() => navigate('dashboard')}
          onUpdateUser={handleUpdateUser}
          onAvatarUpload={handleAvatarUpload}
        />
      )}
      
      {currentView === 'products' && (
        <Products 
          user={user}
          onBack={() => navigate('dashboard')}
        />
      )}
      
      {currentView === 'settings' && (
        <Settings onBack={() => navigate('dashboard')} />
      )}
      
      {currentView === 'history' && (
        <div className="history-placeholder">
          <header className="history-header">
            <button onClick={() => navigate('dashboard')} className="back-button">← Назад</button>
            <h1>История</h1>
          </header>
          <div className="history-content">
            <p>Раздел в разработке</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;