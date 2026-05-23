import React, { useState } from 'react';
import './QRCodeGenerator.css';

const QRCodeGenerator = ({ product, shareToken, onClose, isGenerating }) => {
  const [qrSize] = useState(256);
  
  // Сохраняем токен в localStorage для демо-режима
  React.useEffect(() => {
    if (shareToken && product) {
      const allTokens = JSON.parse(localStorage.getItem('share_tokens') || '{}');
      allTokens[shareToken] = product;
      localStorage.setItem('share_tokens', JSON.stringify(allTokens));
    }
  }, [shareToken, product]);
  
  // Ссылка на гостевую страницу
  const guestUrl = `${window.location.origin}/shared-product/${shareToken}`;
  
  // URL для генерации QR-кода через API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(guestUrl)}`;
  
  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `product-${product.id}-${product.name.replace(/[^a-zа-яё0-9]/gi, '_')}-qrcode.png`;
    link.click();
  };
  
  const printQR = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR-код продукта: ${product.name}</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              .qr-container {
                text-align: center;
                padding: 20px;
              }
              .qr-image {
                margin: 20px auto;
              }
              .product-info {
                margin-top: 20px;
                color: #333;
              }
              .product-name {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .product-details {
                font-size: 14px;
                color: #666;
              }
              .guest-note {
                margin-top: 20px;
                padding: 10px;
                background: #f0f0f0;
                border-radius: 8px;
                font-size: 12px;
                color: #666;
              }
              @media print {
                button {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h2>QR-код продукта</h2>
              <div class="qr-image">
                <img src="${qrUrl}" style="width: 200px; height: 200px;" />
              </div>
              <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-details">
                  <p>Производитель: ${product.manufacturer || 'Не указан'}</p>
                  <p>Модель: ${product.model || 'Не указана'}</p>
                  <p>Серийный номер: ${product.serial_number || 'Не указан'}</p>
                </div>
                <div class="guest-note">
                  🔒 Гостевой доступ. При сканировании QR-кода откроется страница с информацией о продукте.
                </div>
              </div>
              <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px;">Печать</button>
              <button onclick="window.close()" style="margin-top: 20px; margin-left: 10px; padding: 10px 20px;">Закрыть</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };
  
  const copyLink = () => {
    navigator.clipboard.writeText(guestUrl);
    alert('Ссылка для гостевого доступа скопирована в буфер обмена');
  };
  
  if (isGenerating) {
    return (
      <div className="qr-modal-overlay" onClick={onClose}>
        <div className="qr-modal-content">
          <div className="qr-modal-header">
            <h3>📱 Генерация QR-кода</h3>
            <button className="qr-close-btn" onClick={onClose}>✕</button>
          </div>
          <div className="qr-generating">
            <div className="qr-spinner"></div>
            <p>Создание ссылки для гостевого доступа...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="qr-modal-header">
          <h3>📱 QR-код для гостевого доступа</h3>
          <button className="qr-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="product-info-summary">
          <div className="product-name-summary">{product.name}</div>
          <div className="product-details-summary">
            {product.manufacturer} {product.model}
          </div>
        </div>
        
        <div className="qr-code-container">
          <img 
            src={qrUrl} 
            alt="QR Code" 
            style={{ width: qrSize, height: qrSize, imageRendering: 'pixelated' }}
            onError={(e) => {
              e.target.src = `https://quickchart.io/qr?text=${encodeURIComponent(guestUrl)}&size=${qrSize}`;
            }}
          />
        </div>
        
        <div className="qr-info">
          <p className="qr-guest-note">
            🔒 <strong>Гостевой доступ</strong><br/>
            При сканировании QR-кода откроется страница<br/>
            с информацией о продукте (только просмотр)
          </p>
          <div className="qr-link">
            <input 
              type="text" 
              value={guestUrl} 
              readOnly 
              className="qr-link-input"
            />
            <button className="qr-copy-link-btn" onClick={copyLink}>
              📋
            </button>
          </div>
        </div>
        
        <div className="qr-actions">
          <button className="qr-action-btn download-btn" onClick={downloadQR}>
            💾 Сохранить PNG
          </button>
          <button className="qr-action-btn print-btn" onClick={printQR}>
            🖨️ Распечатать
          </button>
        </div>
        
        <div className="qr-note">
          <small>ℹ️ Ссылка действительна постоянно. Вы можете отозвать доступ в любой момент в настройках продукта.</small>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;