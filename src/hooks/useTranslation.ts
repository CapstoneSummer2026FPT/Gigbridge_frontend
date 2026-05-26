/**
 * Custom Translation Hooks
 *
 * Provides type-safe translation hooks with enhanced functionality:
 * - useTranslation: Main hook for translations
 * - useLanguage: Hook for language switching
 * - useTranslationText: Simplified hook for text-only translations
 *
 * @module hooks/useTranslation
 */

import { useTranslation as useI18nTranslation, UseTranslationOptions } from 'react-i18next';
import { useCallback } from 'react';
import type { SupportedLanguage } from '../i18n';

/**
 * Main translation hook
 *
 * Re-exports react-i18next's useTranslation with additional type safety
 *
 * @param ns - Namespace(s) to use (default: 'common')
 * @param options - Translation options
 *
 * @example
 * ```tsx
 * const { t } = useTranslation();
 * return <button>{t('auth.login')}</button>;
 * ```
 *
 * @example With variables
 * ```tsx
 * const { t } = useTranslation();
 * return <h1>{t('common.welcome', { name: 'John' })}</h1>;
 * ```
 */
export function useTranslation(ns?: string | string[], options?: UseTranslationOptions) {
  return useI18nTranslation(ns || 'common', options);
}

/**
 * Language switching hook
 *
 * Provides utilities for managing language state
 *
 * @returns Object with current language and change function
 *
 * @example
 * ```tsx
 * const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
 *
 * return (
 *   <select value={currentLanguage} onChange={(e) => changeLanguage(e.target.value)}>
 *     {availableLanguages.map(lang => (
 *       <option key={lang} value={lang}>{lang}</option>
 *     ))}
 *   </select>
 * );
 * ```
 */
export function useLanguage() {
  const { i18n } = useI18nTranslation();

  /**
   * Change current language
   * Saves to localStorage automatically
   */
  const changeLanguage = useCallback(
    async (lng: SupportedLanguage) => {
      await i18n.changeLanguage(lng);
    },
    [i18n]
  );

  /**
   * Get current language code
   */
  const currentLanguage = i18n.language as SupportedLanguage;

  /**
   * Get list of available languages
   */
  const availableLanguages = i18n.options.supportedLngs?.filter(
    (lng) => lng !== 'cimode'
  ) as SupportedLanguage[];

  /**
   * Check if a language is currently active
   */
  const isLanguageActive = useCallback(
    (lng: SupportedLanguage) => currentLanguage === lng,
    [currentLanguage]
  );

  return {
    currentLanguage,
    changeLanguage,
    availableLanguages,
    isLanguageActive,
  };
}

/**
 * Simplified translation hook for text-only use cases
 *
 * Returns just the translation function without additional utilities
 *
 * @param ns - Namespace to use (default: 'common')
 *
 * @example
 * ```tsx
 * const t = useTranslationText();
 * const loginButton = t('auth.login');
 * const welcomeMessage = t('common.welcome', { name: userName });
 * ```
 */
export function useTranslationText(ns?: string) {
  const { t } = useI18nTranslation(ns || 'common');
  return t;
}

/**
 * Hook to check if translations are ready
 *
 * Useful for showing loading states while translations load
 *
 * @example
 * ```tsx
 * const isReady = useTranslationsReady();
 * if (!isReady) return <Loader />;
 * ```
 */
export function useTranslationsReady() {
  const { ready } = useI18nTranslation();
  return ready;
}
