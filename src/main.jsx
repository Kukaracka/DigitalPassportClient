import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import SharedProductPage from './components/SharedProductPage.jsx'
import { RouteProvider } from './contexts/RouteContext.jsx'
import { initTheme } from './utils/themeManager.js'
import './index.css'

initTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <RouteProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/shared-product/:token" element={<SharedProductPage />} />
        </Routes>
      </RouteProvider>
    </BrowserRouter>
  </React.StrictMode>,
)