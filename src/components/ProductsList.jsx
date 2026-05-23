import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import ProductDetail from './ProductDetail';
import './ProductsList.css';

const ProductsList = ({ 
  products, 
  loading, 
  error, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct,
  getProductsByCategory,
  getProductsByPriceRange,
  getProductsByDateRange,
  getProductsByManufacturer,
  sortProducts,
  getCategories = () => [],
  getManufacturers = () => [],
  getPriceStats = () => ({ min: 0, max: 0, avg: 0 }),
  onRefresh
}) => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    manufacturer: 'all',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: ''
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const categories = ['all', ...getCategories()];
  const manufacturers = ['all', ...getManufacturers()];
  const priceStats = getPriceStats();

  useEffect(() => {
    if (error) {
      console.error('Products error:', error);
    }
  }, [error]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleAddProduct = async (productData) => {
    try {
      await onAddProduct(productData);
      setIsAddingProduct(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (productId, productData) => {
    try {
      await onEditProduct(productId, productData);
      setSelectedProduct(null);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await onDeleteProduct(productId);
      setSelectedProduct(null);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  const handleCloseForm = () => {
    setIsAddingProduct(false);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      manufacturer: 'all',
      minPrice: '',
      maxPrice: '',
      startDate: '',
      endDate: ''
    });
    setSortBy('created_at');
    setSortOrder('desc');
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getFilteredProducts = () => {
    if (!products || products.length === 0) return [];
    
    return products.filter(product => {
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }
      if (filters.manufacturer !== 'all' && product.manufacturer !== filters.manufacturer) {
        return false;
      }
      const productPrice = product.price || 0;
      if (filters.minPrice && productPrice < Number(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && productPrice > Number(filters.maxPrice)) {
        return false;
      }
      if (product.purchase_date) {
        const purchaseDate = new Date(product.purchase_date);
        if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          if (purchaseDate < startDate) {
            return false;
          }
        }
        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          endDate.setHours(23, 59, 59, 999);
          if (purchaseDate > endDate) {
            return false;
          }
        }
      }
      return true;
    });
  };

  const getSortedProducts = (productsToSort) => {
    if (!productsToSort || productsToSort.length === 0) return [];
    
    if (sortProducts) {
      return sortProducts(productsToSort, sortBy, sortOrder);
    }
    return [...productsToSort].sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'purchase_date':
          aValue = a.purchase_date ? new Date(a.purchase_date).getTime() : 0;
          bValue = b.purchase_date ? new Date(b.purchase_date).getTime() : 0;
          break;
        default:
          aValue = a.created_at ? new Date(a.created_at).getTime() : 0;
          bValue = b.created_at ? new Date(b.created_at).getTime() : 0;
      }
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  const filteredProducts = getFilteredProducts();
  const sortedProducts = getSortedProducts(filteredProducts);
  const productsCount = sortedProducts.length;
  const totalProducts = products?.length || 0;

  if (selectedProduct) {
    return (
      <ProductDetail 
        product={selectedProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onClose={handleCloseDetail}
      />
    );
  }

  if (isAddingProduct) {
    return (
      <ProductForm
        onSubmit={handleAddProduct}
        onCancel={handleCloseForm}
      />
    );
  }

  if (loading && products.length === 0) {
    return (
      <div className="loading-products">
        <div className="loading-spinner"></div>
        <p>Загрузка продуктов...</p>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="error-products">
        <p>❌ {error}</p>
        <button onClick={onRefresh}>Повторить</button>
      </div>
    );
  }

  return (
    <div className="products-list-container">
      <div className="products-header">
        <h1>Мои продукты ({totalProducts})</h1>
        <div className="products-controls">
          <button
            className="add-product-btn"
            onClick={() => setIsAddingProduct(true)}
          >
            ➕ Добавить продукт
          </button>
        </div>
      </div>

      <div className="filters-panel">
        <div className="filters-header">
          <h3>🔍 Фильтры и сортировка</h3>
          <button className="reset-filters-btn" onClick={handleResetFilters}>
            Сбросить все
          </button>
        </div>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label>Категория</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Все категории' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Производитель</label>
            <select
              value={filters.manufacturer}
              onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
              className="filter-select"
            >
              {manufacturers.map(manufacturer => (
                <option key={manufacturer} value={manufacturer}>
                  {manufacturer === 'all' ? 'Все производители' : manufacturer}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Цена от</label>
            <input
              type="number"
              placeholder={`${priceStats.min} ₽`}
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="filter-input"
              min="0"
              step="1000"
            />
          </div>
          
          <div className="filter-group">
            <label>Цена до</label>
            <input
              type="number"
              placeholder={`${priceStats.max} ₽`}
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="filter-input"
              min="0"
              step="1000"
            />
          </div>
          
          <div className="filter-group">
            <label>Дата покупки от</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Дата покупки до</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="filter-input"
            />
          </div>
        </div>
        
        <div className="sorting-panel">
          <label>Сортировать по:</label>
          <div className="sort-buttons">
            <button
              className={`sort-btn ${sortBy === 'created_at' ? 'active' : ''}`}
              onClick={() => handleSortChange('created_at')}
            >
              Дата добавления {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
              onClick={() => handleSortChange('name')}
            >
              Названию {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`sort-btn ${sortBy === 'price' ? 'active' : ''}`}
              onClick={() => handleSortChange('price')}
            >
              Цене {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`sort-btn ${sortBy === 'purchase_date' ? 'active' : ''}`}
              onClick={() => handleSortChange('purchase_date')}
            >
              Дате покупки {sortBy === 'purchase_date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
        
        {productsCount !== totalProducts && (
          <div className="filter-info">
            Найдено продуктов: {productsCount} из {totalProducts}
          </div>
        )}
      </div>

      {totalProducts === 0 ? (
        <div className="empty-products">
          <div className="empty-icon">📦</div>
          <h2>У вас пока нет продуктов</h2>
          <p>Добавьте свою первую технику, чтобы начать отслеживание</p>
          <button
            className="add-first-product-btn"
            onClick={() => setIsAddingProduct(true)}
          >
            Добавить первый продукт
          </button>
        </div>
      ) : productsCount === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h2>Продукты не найдены</h2>
          <p>Попробуйте изменить параметры фильтров</p>
          <button className="reset-filters-btn" onClick={handleResetFilters}>
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {sortedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={handleProductClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;