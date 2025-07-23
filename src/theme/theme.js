export const themeProperties = { light: {}, dark: {} };

/**
 * Reads a CSS property or variable from a specific tag or class.
 *
 * @param {string} property - The CSS property or custom property (e.g. '--ht-text-color-1-light', 'font-size').
 * @param {string} [fallback=''] - The fallback value if the property is not found or is empty.
 * @param {string} [tag='body'] - The HTML tag to create for reading the style (e.g. 'div', 'svg', 'h3').
 * @param {string} [className=''] - Optional class name to add to the created element for class-based styles.
 * @returns {string} The computed value of the CSS property, or the fallback if not found.
 */
export function getStyleFromTag(
  property,
  fallback = '',
  tag = 'body',
  className = '',
) {
  const el = document.createElement(tag);
  if (className) el.classList.add(className);
  document.body.appendChild(el);
  const value =
    getComputedStyle(el).getPropertyValue(property).trim() || fallback;
  document.body.removeChild(el);
  return value;
}

/**
 * Builds a theme object for a given suffix (e.g. '-light' or '-dark').
 *
 * @param {string} suffix - The suffix for the CSS custom properties (e.g. '-light' or '-dark').
 * @returns {Object} An object containing all theme values (colors, fonts, etc.) for the given mode.
 */
export function buildTheme(suffix) {
  return {
    textColor1: getStyleFromTag(`--ht-text-color-1${suffix}`),
    textColor2: getStyleFromTag(`--ht-text-color-2${suffix}`),
    surface1: getStyleFromTag(`--ht-surface-1${suffix}`),
    surface2: getStyleFromTag(`--ht-surface-2${suffix}`),
    surfaceShadow: getStyleFromTag(`--ht-surface-shadow${suffix}`),
    splitlineColor: getStyleFromTag(`--ht-splitline-color${suffix}`),
    chartOrange1: getStyleFromTag(`--ht-chart-orange-1${suffix}`),
    chartBlue1: getStyleFromTag(`--ht-chart-blue-1${suffix}`),
    chartGreen1: getStyleFromTag(`--ht-chart-green-1${suffix}`),
    chartYellow1: getStyleFromTag(`--ht-chart-yellow-1${suffix}`),
    chartBlue2: getStyleFromTag(`--ht-chart-blue-2${suffix}`),
    chartOrange2: getStyleFromTag(`--ht-chart-orange-2${suffix}`),
    chartPurple1: getStyleFromTag(`--ht-chart-purple-1${suffix}`),
    chartNeutral1: getStyleFromTag(`--ht-chart-neutral-1${suffix}`),
    chartMainBlue: getStyleFromTag(`--ht-chart-main-blue${suffix}`),
    chartMainRed: getStyleFromTag(`--ht-chart-main-red${suffix}`),
    chartMainGrey: getStyleFromTag(`--ht-chart-main-grey${suffix}`),
    fontFamily: getStyleFromTag('font-family', 'Arial, sans-serif', 'svg'),
    fontWeight: getStyleFromTag('font-weight', 'normal'),
    fontSizeTitle: getStyleFromTag(
      'font-size',
      '20px',
      'div',
      'ht-chart-title',
    ),
    fontWeightTitle: getStyleFromTag(
      'font-weight',
      'bold',
      'div',
      'ht-chart-title',
    ),
    lineHeight: parseFloat(getStyleFromTag('line-height', '28')),
  };
}

/**
 * Populates the themeVars object for light and dark mode.
 * Should be called once at app startup (e.g. in main.js).
 *
 * @returns {void}
 */
export function loadThemeProperties() {
  themeProperties.light = buildTheme('-light');
  themeProperties.dark = buildTheme('-dark');
}
