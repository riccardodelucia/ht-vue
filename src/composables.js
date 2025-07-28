import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { ref } from 'vue';
import { useColorMode } from '@vueuse/core';
import {
  getHTThemeColors,
  getHTChartColors,
  getCSSVariable,
} from '@nf-data-iu3/ht-design/runtime';

// #region Tooltip

/**
 * Tooltip composable using tippy.js.
 * Provides showTooltip and hideTooltip methods for tooltip management.
 */
export const useTooltip = function (config = { animation: 'false' }) {
  const tooltipInstance = ref(null);

  /**
   * Show tooltip on the target element.
   * @param {Event} event - The triggering event (usually mouseover).
   * @param {string} content - Tooltip content.
   */
  const showTooltip = (event, content) => {
    const instance = tippy(event.target);
    instance.setProps(config);
    instance.setContent(content);
    tooltipInstance.value = instance;
  };

  /**
   * Hide and destroy the tooltip instance.
   */
  const hideTooltip = () => {
    tooltipInstance.value.destroy();
  };

  return { showTooltip, hideTooltip };
};

// #endregion

// #region Theme

/**
 * Reactive color mode composable based on @vueuse/core.
 * Uses saved theme from localStorage if available.
 * Defaults to system preference ('auto').
 * Applies correct theme class on initial render, including 'auto' mode.
 *
 * @returns {Ref<string>} Vue ref with current color theme: 'dark', 'light', or 'auto'.
 */
export const useHTColorTheme = () => {
  const theme = useColorMode({
    initialValue: 'auto',
    modes: { dark: 'ht-darkmode', light: '' },
  });

  return theme;
};

/**
 * Returns ECharts theme object based on the current active CSS theme.
 * Reads CSS custom properties at runtime to automatically match light/dark mode.
 *
 * @param {string} [paletteType='full'] - Palette type: 'full' or 'simple'.
 * @returns {Object} ECharts theme with resolved colors and styles.
 */
export const useHTEchartsTheme = (paletteType = 'full') => {
  const chartColors = getHTChartColors(paletteType);
  const themeColors = getHTThemeColors();

  /**
   * Calculates the numeric font size value by multiplying the given CSS variable by ht-font-size-base.
   * @param {string} fontSizeVar - The font size CSS variable name (e.g., 'ht-font-size-2')
   * @returns {number} The calculated font size as a number
   */
  const getCalculatedFontSize = (fontSizeVar) => {
    const fontSize = parseFloat(getCSSVariable(fontSizeVar)) || 1;
    const baseSize = parseFloat(getCSSVariable('--ht-font-size-base')) || 16;
    const result = fontSize * baseSize;
    return isNaN(result) ? 16 : result;
  };

  return {
    color: Object.values(chartColors),
    backgroundColor: themeColors.surface1,
    textStyle: {
      color: themeColors.textColor1,
      fontFamily: getCSSVariable('--ht-font-sans'),
      //fontSize: getCalculatedFontSize('--ht-font-size-1'),
    },
    title: {
      textStyle: {
        color: themeColors.textColor1,
        fontFamily: getCSSVariable('--ht-font-sans'),
        fontWeight: getCSSVariable('--ht-font-weight-5'),
        fontSize: getCalculatedFontSize('--ht-font-size-3'),
      },
    },
    legend: {
      left: 'center',
      textStyle: {
        color: themeColors.textColor1,
        fontFamily: getCSSVariable('--ht-font-sans'),
        fontWeight: getCSSVariable('--ht-font-weight-5'),
        fontSize: getCalculatedFontSize('--ht-font-size-1'),
      },
    },
    tooltip: {
      backgroundColor: getCSSVariable('--ht-surface-2'),
      borderColor: getCSSVariable('--ht-surface-shadow'),
      textStyle: {
        color: themeColors.textColor1,
        fontFamily: getCSSVariable('--ht-font-sans'),
        fontSize: getCalculatedFontSize('--ht-font-size-1'),
      },
    },
    xAxis: {
      axisLabel: {
        color: themeColors.textColor1,
        fontFamily: getCSSVariable('--ht-font-sans'),
        fontSize: getCalculatedFontSize('--ht-font-size-0'),
      },
      nameTextStyle: {
        color: themeColors.textColor1,
        fontFamily: getCSSVariable('--ht-font-sans'),
        fontSize: getCalculatedFontSize('--ht-font-size-1'),
      },
      splitLine: {
        lineStyle: {
          color: getCSSVariable('--ht-surface-2'),
          type: 'dashed',
        },
      },
    },
    yAxis: {
      axisLabel: {
        color: themeColors.textColor1,
        fontFamily: getCSSVariable('--ht-font-sans'),
        fontSize: getCalculatedFontSize('--ht-font-size-0'),
      },
      nameTextStyle: {
        color: themeColors.textColor1,
        fontFamily: getCSSVariable('--ht-font-sans'),
        fontSize: getCalculatedFontSize('--ht-font-size-1'),
      },
      splitLine: {
        lineStyle: {
          color: getCSSVariable('--ht-surface-2'),
          type: 'dashed',
        },
      },
    },
    label: {
      color: themeColors.textColor1,
      fontFamily: getCSSVariable('--ht-font-sans'),
      fontSize: getCalculatedFontSize('--ht-font-size-0'),
    },
    visualMap: {
      textStyle: {
        color: themeColors.textColor1,
        fontFamily: getCSSVariable('--ht-font-sans'),
        fontSize: getCalculatedFontSize('--ht-font-size-1'),
      },
    },
    seriesDefaults: {
      heatmap: {
        itemStyle: {
          borderColor: 'black',
          borderWidth: 1.2,
        },
      },
    },
  };
};

// #endregion
