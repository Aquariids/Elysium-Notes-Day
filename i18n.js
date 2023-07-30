// i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Настройка и инициализация i18next
i18n.use(initReactI18next).init({
  lng: 'ru', // Устанавливаем язык на русский
  resources: {
    ru: {
      translation: {
        apple: '{{count}} яблоко', // Здесь определен перевод для ключа 'apple'
        // Добавьте другие переводы здесь, если нужно
      },
    },
    
  },
});

export default i18n;
