const LanguageToggle = ({ language, toggleLanguage }) => {
  const ariaLabel =
    language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish';
  const buttonText = language === 'es' ? '🇬🇧 EN' : '🇪🇸 ES';

  return (
    <button
      onClick={toggleLanguage}
      className="language-toggle"
      aria-label={ariaLabel}
      title={ariaLabel}
      type="button">
      {buttonText}
    </button>
  );
};

export default LanguageToggle;
