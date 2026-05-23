import { useState, useEffect } from 'react';

const DRAFT_PREFIX = 'product_form_draft_';

export const useFormDraft = (productId = null) => {
  const draftKey = productId ? `${DRAFT_PREFIX}${productId}` : `${DRAFT_PREFIX}new`;
  const [hasDraft, setHasDraft] = useState(false);

  // Загрузить черновик
  const loadDraft = () => {
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // Сохранить черновик
  const saveDraft = (formData) => {
    const draft = {
      data: formData,
      timestamp: Date.now(),
      productId: productId
    };
    localStorage.setItem(draftKey, JSON.stringify(draft));
    setHasDraft(true);
  };

  // Удалить черновик
  const clearDraft = () => {
    localStorage.removeItem(draftKey);
    setHasDraft(false);
  };

  // Проверить наличие черновика при загрузке
  useEffect(() => {
    const saved = localStorage.getItem(draftKey);
    setHasDraft(!!saved);
  }, [draftKey]);

  // Автосохранение (каждые 10 секунд)
  const enableAutoSave = (formData, delay = 10000) => {
    const interval = setInterval(() => {
      if (formData && Object.keys(formData).length > 0) {
        saveDraft(formData);
      }
    }, delay);
    return () => clearInterval(interval);
  };

  return {
    loadDraft,
    saveDraft,
    clearDraft,
    hasDraft,
    enableAutoSave
  };
};