/**
 * Language Switcher Component
 *
 * A responsive, reusable component for switching between supported languages.
 * Features:
 * - Dropdown UI for language selection
 * - Persistent language preference via localStorage
 * - Smooth transitions without page reload
 * - Accessible and keyboard-friendly
 *
 * @module components/LanguageSwitcher
 */

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../../hooks/useTranslation';
import { SUPPORTED_LANGUAGES } from '../../i18n';
import type { SupportedLanguage } from '../../i18n';

interface LanguageSwitcherProps {
  /**
   * Display variant
   * - 'dropdown': Full dropdown with button
   * - 'select': Native select element (for settings pages)
   */
  variant?: 'dropdown' | 'select';

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Show language label next to icon
   */
  showLabel?: boolean;
}

/**
 * Language Switcher Component
 *
 * @example Dropdown variant (for navbar)
 * ```tsx
 * <LanguageSwitcher variant="dropdown" showLabel />
 * ```
 *
 * @example Select variant (for settings)
 * ```tsx
 * <LanguageSwitcher variant="select" />
 * ```
 */
export function LanguageSwitcher({
  variant = 'dropdown',
  className = '',
  showLabel = false,
}: LanguageSwitcherProps) {
  const { currentLanguage, changeLanguage, availableLanguages, isLanguageActive } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  /**
   * Handle language change
   */
  const handleLanguageChange = async (lng: SupportedLanguage) => {
    await changeLanguage(lng);
    setIsOpen(false);
  };

  /**
   * Render select variant (for settings pages)
   */
  if (variant === 'select') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={currentLanguage}
          onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
          className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-cyan appearance-none cursor-pointer"
        >
          {availableLanguages.map((lng) => (
            <option key={lng} value={lng}>
              {SUPPORTED_LANGUAGES[lng]}
            </option>
          ))}
        </select>
        <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary pointer-events-none" />
      </div>
    );
  }

  /**
   * Render dropdown variant (for navbar)
   */
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface transition-colors text-secondary hover:text-primary"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe className="w-5 h-5" />
        {showLabel && (
          <span className="text-sm font-medium">
            {SUPPORTED_LANGUAGES[currentLanguage]}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 glass-card p-2 z-50 shadow-xl">
          {availableLanguages.map((lng) => (
            <button
              key={lng}
              onClick={() => handleLanguageChange(lng)}
              className={`
                w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm
                transition-colors
                ${
                  isLanguageActive(lng)
                    ? 'bg-cyan/10 text-cyan'
                    : 'text-primary hover:bg-surface'
                }
              `}
            >
              <span className="font-medium">{SUPPORTED_LANGUAGES[lng]}</span>
              {isLanguageActive(lng) && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Compact Language Switcher
 *
 * A minimal version showing only language codes (EN/VI)
 *
 * @example
 * ```tsx
 * <CompactLanguageSwitcher />
 * ```
 */
export function CompactLanguageSwitcher({ className = '' }: { className?: string }) {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {availableLanguages.map((lng) => (
        <button
          key={lng}
          onClick={() => changeLanguage(lng)}
          className={`
            px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all
            ${
              currentLanguage === lng
                ? 'bg-cyan text-background'
                : 'text-secondary hover:text-primary hover:bg-surface'
            }
          `}
        >
          {lng}
        </button>
      ))}
    </div>
  );
}

/**
 * Combined Theme and Language Switcher
 *
 * A compact component that combines theme selection and language selection
 * with hover dropdowns for each option.
 *
 * @example
 * ```tsx
 * <CombinedThemeLanguageSwitcher />
 * ```
 */
export function CombinedThemeLanguageSwitcher({
  theme,
  setTheme,
  className = '',
}: {
  theme: 'black' | 'white';
  setTheme: (theme: 'black' | 'white') => void;
  className?: string;
}) {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const themeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const langTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const themeOptions = [
    { value: 'black' as const, label: 'Dark', icon: <Moon size={14} /> },
    { value: 'white' as const, label: 'Light', icon: <Sun size={14} /> },
  ];

  const currentTheme = themeOptions.find((t) => t.value === theme);
  const otherTheme = themeOptions.find((t) => t.value !== theme);
  const otherLanguages = availableLanguages.filter((lng) => lng !== currentLanguage);

  const handleThemeMouseEnter = () => {
    if (themeTimeoutRef.current) clearTimeout(themeTimeoutRef.current);
    setShowThemeDropdown(true);
  };

  const handleThemeMouseLeave = () => {
    themeTimeoutRef.current = setTimeout(() => {
      setShowThemeDropdown(false);
    }, 200);
  };

  const handleLangMouseEnter = () => {
    if (langTimeoutRef.current) clearTimeout(langTimeoutRef.current);
    setShowLangDropdown(true);
  };

  const handleLangMouseLeave = () => {
    langTimeoutRef.current = setTimeout(() => {
      setShowLangDropdown(false);
    }, 200);
  };

  return (
    <div className={`flex items-center gap-0.5 p-1 rounded-xl glass-button border border-white/10 ${className}`}>
      {/* Theme Section */}
      <div
        className="relative"
        onMouseEnter={handleThemeMouseEnter}
        onMouseLeave={handleThemeMouseLeave}
      >
        <button
          className="px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 text-secondary hover:text-primary"
        >
          {currentTheme?.icon}
          <span className="hidden sm:inline">{currentTheme?.label}</span>
        </button>

        {/* Theme Dropdown */}
        {showThemeDropdown && otherTheme && (
          <div className="absolute top-full left-0 pt-1 z-50">
            <button
              onClick={() => {
                setTheme(otherTheme.value);
                setShowThemeDropdown(false);
              }}
              className="px-3 py-2 rounded-lg text-xs font-bold transition-all glass-button border border-white/10 flex items-center gap-1.5 text-secondary hover:text-primary hover:border-cyan/40 whitespace-nowrap"
            >
              {otherTheme.icon}
              <span className="hidden sm:inline">{otherTheme.label}</span>
            </button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-border" />

      {/* Language Section */}
      <div
        className="relative"
        onMouseEnter={handleLangMouseEnter}
        onMouseLeave={handleLangMouseLeave}
      >
        <button
          className="px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all duration-200 text-secondary hover:text-primary"
        >
          {currentLanguage}
        </button>

        {/* Language Dropdown */}
        {showLangDropdown && otherLanguages.length > 0 && (
          <div className="absolute top-full right-0 pt-1 z-50 flex flex-col gap-1">
            {otherLanguages.map((lng) => (
              <button
                key={lng}
                onClick={() => {
                  changeLanguage(lng);
                  setShowLangDropdown(false);
                }}
                className="px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all glass-button border border-white/10 text-secondary hover:text-primary hover:border-cyan/40"
              >
                {lng}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
