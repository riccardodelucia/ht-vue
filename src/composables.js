import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { computed, ref } from 'vue';
import { useColorMode } from '@vueuse/core';

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
 * Applies 'ht-darkmode' class to <html> for dark mode.
 *
 * @returns {Ref<string>} A Vue ref whose value is the current color mode: 'dark', 'light', or 'auto'.
 */
export const useHTColorMode = () => {
  const mode = useColorMode({
    initialValue: 'auto',
    modes: {
      dark: 'ht-darkmode',
      light: '',
    },
  });

  return mode;
};

/**
 * Returns a reactive ECharts theme object based on the current color mode.
 * The theme colors and styles are dynamically resolved from CSS custom properties
 * for dark and light modes. Automatically detects system preference if mode is 'auto'.
 *
 * @param {Ref<string>} colorMode - Reactive ref for the color mode ('dark', 'light', or 'auto').
 * @returns {ComputedRef<Object>} - Computed ECharts theme object with resolved color values.
 */
export const useEChartsTheme = (colorMode) => {
  function getStyleFromTag(property, fallback = '', tag = 'body') {
    const el = document.createElement(tag);
    document.body.appendChild(el);
    const value =
      getComputedStyle(el).getPropertyValue(property).trim() || fallback;
    document.body.removeChild(el);
    return value;
  }

  return computed(() => {
    const isDarkMode =
      colorMode.value === 'dark' ||
      (colorMode.value === 'auto' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    const suffix = isDarkMode ? '-dark' : '-light';

    const fontFamily = getStyleFromTag('font-family', 'Arial, sans-serif');
    const fontWeight = getStyleFromTag('font-weight', 'normal');
    const fontSizeTitle = getStyleFromTag('font-size', '20px', 'h3');
    const fontWeightTitle = getStyleFromTag('font-weight', 'bold', 'h1');
    const lineHeight = parseFloat(getStyleFromTag('font-size')) * 1.25 || '20';

    return {
      color: [
        getStyleFromTag(`--ht-chart-orange-1${suffix}`),
        getStyleFromTag(`--ht-chart-blue-1${suffix}`),
        getStyleFromTag(`--ht-chart-green-1${suffix}`),
        getStyleFromTag(`--ht-chart-yellow-1${suffix}`),
        getStyleFromTag(`--ht-chart-blue-2${suffix}`),
        getStyleFromTag(`--ht-chart-orange-2${suffix}`),
        getStyleFromTag(`--ht-chart-purple-1${suffix}`),
        getStyleFromTag(`--ht-chart-neutral-1${suffix}`),
      ],
      backgroundColor: getStyleFromTag(`--ht-surface-1${suffix}`),
      textStyle: {
        color: getStyleFromTag(`--ht-text-color-1${suffix}`),
        fontFamily,
        fontWeight,
        lineHeight,
      },
      title: {
        textStyle: {
          color: getStyleFromTag(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight: fontWeightTitle,
          fontSize: fontSizeTitle,
          lineHeight,
        },
        subtextStyle: {
          color: getStyleFromTag(`--ht-text-color-2${suffix}`),
          fontFamily,
          fontWeight,
          lineHeight,
        },
      },
      legend: {
        textStyle: {
          color: getStyleFromTag(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight: 'bold',
          lineHeight,
        },
      },
      tooltip: {
        backgroundColor: getStyleFromTag(`--ht-surface-2${suffix}`),
        borderColor: getStyleFromTag(`--ht-surface-shadow${suffix}`),
        textStyle: {
          color: getStyleFromTag(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight,
          lineHeight,
        },
      },
      xAxis: {
        axisLabel: {
          color: getStyleFromTag(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight,
          lineHeight,
        },
        nameTextStyle: {
          color: getStyleFromTag(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight: fontWeightTitle,
          lineHeight,
        },
        splitLine: {
          lineStyle: {
            color: getStyleFromTag(`--ht-splitline-color${suffix}`) || '#ccc',
            type: 'dashed',
          },
        },
      },
      yAxis: {
        axisLabel: {
          color: getStyleFromTag(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight,
          lineHeight,
        },
        nameTextStyle: {
          color: getStyleFromTag(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight: fontWeightTitle,
          lineHeight,
        },
        splitLine: {
          lineStyle: {
            color: getStyleFromTag(`--ht-splitline-color${suffix}`) || '#ccc',
            type: 'dashed',
          },
        },
      },
      label: {
        color: getStyleFromTag(`--ht-text-color-1${suffix}`),
        fontFamily,
        fontWeight,
        lineHeight,
      },
      visualMap: {
        textStyle: {
          color: getStyleFromTag(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight,
          lineHeight,
        },
      },
      seriesDefaults: {
        heatmap: {
          itemStyle: {
            borderColor:
              getStyleFromTag(`--ht-chart-neutral-1${suffix}`) || '#000',
            borderWidth: 1,
          },
        },
      },
    };
  });
};

// #endregion
