import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { ref, watch } from 'vue';
import { useColorMode } from '@vueuse/core';
import {
  getCSSHTThemeColors,
  getCSSHTChartColors,
  getCSSProperty,
} from '@nf-data-iu3/ht-design';

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
    instance.show();
    tooltipInstance.value = instance;
  };

  /**
   * Hide and destroy the tooltip instance.
   */
  const hideTooltip = () => {
    if (tooltipInstance.value) tooltipInstance.value.destroy();
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
 * Waits for DOM to be mounted before reading CSS properties.
 *
 * @param {string} [paletteType='default'] - Palette type: 'default' or 'simple'.
 * @returns {Ref<Object|null>} Reactive ref with ECharts theme (null until mounted).
 */
export const useHTEchartsTheme = (paletteType = 'default') => {
  const echartsTheme = ref(null);
  const colorTheme = useHTColorTheme(); // Reactive theme reference

  /**
   * Calculates the numeric font size value by multiplying the given CSS variable by ht-font-size-base.
   * @param {string} fontSizeVar - The font size CSS variable name (e.g., 'ht-font-size-2')
   * @returns {number} The calculated font size as a number
   */
  const getCalculatedFontSize = (fontSizeVar) => {
    const fontSize = parseFloat(getCSSProperty(fontSizeVar)) || 1;
    const baseSize = parseFloat(getCSSProperty('--ht-font-size-base')) || 16;
    const result = fontSize * baseSize;
    return isNaN(result) ? 16 : result;
  };

  /**
   * Updates the ECharts theme based on current CSS variables and color theme.
   * This function reads from the DOM, so it should only be called after mounting.
   */
  const updateTheme = () => {
    const chartColors = getCSSHTChartColors(paletteType);
    const themeColors = getCSSHTThemeColors();

    echartsTheme.value = {
      color: Object.values(chartColors),
      backgroundColor: themeColors.surface1,
      textStyle: {
        color: themeColors.textColor1,
        fontFamily: getCSSProperty('--ht-font-sans'),
      },
      title: {
        textStyle: {
          color: themeColors.textColor1,
          fontFamily: getCSSProperty('--ht-font-sans'),
          fontWeight: getCSSProperty('--ht-font-weight-5'),
          fontSize: getCalculatedFontSize('--ht-font-size-3'),
        },
      },
      legend: {
        left: 'center',
        textStyle: {
          color: themeColors.textColor1,
          fontFamily: getCSSProperty('--ht-font-sans'),
          fontWeight: getCSSProperty('--ht-font-weight-5'),
          fontSize: getCalculatedFontSize('--ht-font-size-1'),
        },
      },
      tooltip: {
        backgroundColor: getCSSProperty('--ht-surface-2'),
        borderColor: getCSSProperty('--ht-surface-shadow'),
        textStyle: {
          color: themeColors.textColor1,
          fontFamily: getCSSProperty('--ht-font-sans'),
          fontSize: getCalculatedFontSize('--ht-font-size-1'),
        },
      },
      xAxis: {
        axisLabel: {
          color: themeColors.textColor1,
          fontFamily: getCSSProperty('--ht-font-sans'),
          fontSize: getCalculatedFontSize('--ht-font-size-0'),
        },
        nameTextStyle: {
          color: themeColors.textColor1,
          fontFamily: getCSSProperty('--ht-font-sans'),
          fontSize: getCalculatedFontSize('--ht-font-size-1'),
        },
        splitLine: {
          lineStyle: {
            color: getCSSProperty('--ht-surface-2'),
            type: 'dashed',
          },
        },
      },
      yAxis: {
        axisLabel: {
          color: themeColors.textColor1,
          fontFamily: getCSSProperty('--ht-font-sans'),
          fontSize: getCalculatedFontSize('--ht-font-size-0'),
        },
        nameTextStyle: {
          color: themeColors.textColor1,
          fontFamily: getCSSProperty('--ht-font-sans'),
          fontSize: getCalculatedFontSize('--ht-font-size-1'),
        },
        splitLine: {
          lineStyle: {
            color: getCSSProperty('--ht-surface-2'),
            type: 'dashed',
          },
        },
      },
      label: {
        color: themeColors.textColor1,
        fontFamily: getCSSProperty('--ht-font-sans'),
        fontSize: getCalculatedFontSize('--ht-font-size-0'),
      },
      visualMap: {
        textStyle: {
          color: themeColors.textColor1,
          fontFamily: getCSSProperty('--ht-font-sans'),
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

  // Watch for color theme changes and update the ECharts theme accordingly
  watch(colorTheme, () => updateTheme(), {
    immediate: true, // Execute immediately when the composable is created
    flush: 'post', // Execute after DOM updates to ensure CSS variables are available
  });

  return echartsTheme;
};

// #endregion
