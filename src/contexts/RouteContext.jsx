import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const RouteContext = createContext();

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within RouteProvider');
  }
  return context;
};

export const RouteProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      const saved = localStorage.getItem('lastView');
      if (saved && saved !== 'login' && saved !== 'register') {
        setCurrentView(saved);
      }
    }
  }, []);

  useEffect(() => {
    if (isInitializedRef.current && currentView && currentView !== 'login' && currentView !== 'register') {
      localStorage.setItem('lastView', currentView);
    }
  }, [currentView]);

  const navigate = (view) => {
    if (view && view !== currentView) {
      setCurrentView(view);
    }
  };

  return (
    <RouteContext.Provider value={{ currentView, navigate }}>
      {children}
    </RouteContext.Provider>
  );
};