import { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useApp, AppTheme } from '../../app/providers/AppProvider';
import '../styles/ThemeSwitcher.css';

const THEMES: Array<{ value: AppTheme; label: string; icon: string; preview: string }> = [
  { value: 'black', label: 'Black', icon: '⚫', preview: '#000000' },
  { value: 'white', label: 'White', icon: '⚪', preview: '#FFFFFF' },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const currentTheme = THEMES.find(t => t.value === theme) || THEMES[0];

  const handleThemeChange = (newTheme: AppTheme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="theme-switcher" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-switcher-trigger"
        aria-label="Change theme"
      >
        <Palette size={18} />
        <span className="theme-switcher-current-label">{currentTheme.icon} {currentTheme.label}</span>
      </button>

      {isOpen && (
        <div className="theme-switcher-dropdown">
          <div className="theme-switcher-header">
            <Palette size={14} />
            <span>Select Theme</span>
          </div>

          <div className="theme-switcher-options">
            {THEMES.map(t => (
              <button
                key={t.value}
                onClick={() => handleThemeChange(t.value)}
                className={`theme-switcher-option ${theme === t.value ? 'active' : ''}`}
              >
                <div className="theme-switcher-option-preview" style={{ background: t.preview }} />
                <div className="theme-switcher-option-info">
                  <span className="theme-switcher-option-icon">{t.icon}</span>
                  <span className="theme-switcher-option-label">{t.label}</span>
                </div>
                {theme === t.value && <Check size={16} className="theme-switcher-check" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
