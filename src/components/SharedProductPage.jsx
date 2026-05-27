import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useProducts } from '../hooks/useProducts';
import './SharedProductPage.css';

const SharedProductPage = () => {
  const { token } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getProductByShareToken } = useProducts();

  useEffect(() => {
    loadProduct();
  }, [token]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await getProductByShareToken(token);
      setProduct(data);
      setError(null);
    } catch (error) {
      console.error('Error loading shared product:', error);
      setError('Продукт не найден или ссылка недействительна');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
    return <LoadingSpinner message="Загрузка информации о продукте..." />;
  }

  if (error) {
    return (
      <div className="shared-product-error">
        <div className="error-container">
          <div className="error-icon">🔒</div>
          <h2>Доступ ограничен</h2>
          <p>{error}</p>
          <button onClick={() => window.location.href = '/'}>
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="shared-product-error">
        <div className="error-container">
          <div className="error-icon">❓</div>
          <h2>Продукт не найден</h2>
          <button onClick={() => window.location.href = '/'}>
            Вернуться на главную
          </button>
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