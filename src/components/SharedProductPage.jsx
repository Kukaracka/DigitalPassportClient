import React, { useState, useEffect } from 'react';
import './SharedProductPage.css';

const SharedProductPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Просто показываем демо-данные
    setTimeout(() => {
      setProduct({
        id: 999,
        name: "Демо продукт",
        manufacturer: "Apple",
        model: "MacBook Pro",
        serial_number: "SN-DEMO-123",
        price: 150000,
        purchase_date: "2024-01-15",
        warranty_until: "2026-01-15",
        description: "Это демонстрационный продукт. В реальном приложении здесь будут данные из базы данных.",
        category: "Ноутбук"
      });
      setLoading(false);
    }, 500);
  }, []);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };
  
  const getCategoryIcon = (category) => {
    const icons = {
      'Ноутбук': '💻',
      'Смартфон': '📱',
      'Планшет': '📟',
      'Наушники': '🎧',
      'Телевизор': '📺',
      'Фотоаппарат': '📷',
      'Игровая консоль': '🎮',
      'Другое': '📦'
    };
    return icons[category] || '📦';
  };
  
  if (loading) {
    return (
      <div className="shared-product-page">
        <div className="shared-product-container" style={{ textAlign: 'center', padding: '50px' }}>
          Загрузка...
        </div>
      </div>
    );
  }
  
  return (
    <div className="shared-product-page">
      <div className="shared-product-container">
        <div className="shared-product-header">
          <h1>Информация о продукте</h1>
          <div className="guest-badge">👥 Гостевой доступ</div>
        </div>
        
        <div className="shared-product-content">
          <div className="shared-product-main">
            <div className="product-title-section">
              <div className="product-icon-large">{getCategoryIcon(product.category)}</div>
              <div>
                <h2>{product.name}</h2>
                <p className="product-category-detail">{product.category || 'Без категории'}</p>
              </div>
            </div>
          </div>
          
          <div className="shared-product-info">
            <div className="info-section">
              <h3>📋 Основная информация</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Производитель:</span>
                  <span className="info-value">{product.manufacturer || 'Не указан'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Модель:</span>
                  <span className="info-value">{product.model || 'Не указана'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Серийный номер:</span>
                  <span className="info-value">{product.serial_number || 'Не указан'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Цена:</span>
                  <span className="info-value">{product.price ? `${product.price.toLocaleString('ru-RU')} ₽` : 'Не указана'}</span>
                </div>
              </div>
            </div>
            
            <div className="info-section">
              <h3>📅 Даты</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Дата покупки:</span>
                  <span className="info-value">{formatDate(product.purchase_date)}</span>
                </div>
                {product.warranty_until && (
                  <div className="info-item">
                    <span className="info-label">Гарантия до:</span>
                    <span className="info-value">{formatDate(product.warranty_until)}</span>
                  </div>
                )}
              </div>
            </div>
            
            {product.description && (
              <div className="info-section">
                <h3>📝 Описание</h3>
                <p className="product-description">{product.description}</p>
              </div>
            )}
          </div>
          
          <div className="shared-product-footer">
            <div className="share-notice">
              <span className="notice-icon">🔒</span>
              <p>Вы просматриваете продукт в гостевом режиме.</p>
              <p className="notice-small">Для редактирования необходимо авторизоваться как владелец.</p>
            </div>
            <button className="login-btn" onClick={() => window.location.href = '/'}>
              Войти в аккаунт
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedProductPage;