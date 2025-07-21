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
  function cssVar(name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  return computed(() => {
    const isDarkMode =
      colorMode.value === 'dark' ||
      (colorMode.value === 'auto' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    const suffix = isDarkMode ? '-dark' : '-light';

    const fontFamily = cssVar('--font-sans') || 'Arial, sans-serif';
    const fontWeight = cssVar('--font-weight-4') || 'normal';
    const fontSizeTitle = cssVar('--font-size-2') || '20px';
    const fontWeightTitle = cssVar('--font-weight-5') || 'bold';
    const lineHeight = cssVar('--font-lineheight-4') || '1.5';

    return {
      color: [
        cssVar(`--ht-chart-orange-1${suffix}`),
        cssVar(`--ht-chart-blue-1${suffix}`),
        cssVar(`--ht-chart-green-1${suffix}`),
        cssVar(`--ht-chart-yellow-1${suffix}`),
        cssVar(`--ht-chart-blue-2${suffix}`),
        cssVar(`--ht-chart-orange-2${suffix}`),
        cssVar(`--ht-chart-purple-1${suffix}`),
        cssVar(`--ht-chart-neutral-1${suffix}`),
      ],
      backgroundColor: cssVar(`--ht-surface-1${suffix}`),
      textStyle: {
        color: cssVar(`--ht-text-color-1${suffix}`),
        fontFamily,
        fontWeight,
        lineHeight,
      },
      title: {
        textStyle: {
          color: cssVar(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight: fontWeightTitle,
          fontSize: fontSizeTitle,
          lineHeight,
        },
        subtextStyle: {
          color: cssVar(`--ht-text-color-2${suffix}`),
          fontFamily,
          fontWeight,
          lineHeight,
        },
      },
      legend: {
        textStyle: {
          color: cssVar(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight,
          lineHeight,
        },
      },
      tooltip: {
        backgroundColor: cssVar(`--ht-surface-2${suffix}`),
        borderColor: cssVar(`--ht-surface-shadow${suffix}`),
        textStyle: {
          color: cssVar(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight,
          lineHeight,
        },
      },
      xAxis: {
        axisLabel: {
          color: cssVar(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight,
          lineHeight,
        },
        nameTextStyle: {
          color: cssVar(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight,
          lineHeight,
        },
      },
      yAxis: {
        axisLabel: {
          color: cssVar(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight,
          lineHeight,
        },
        nameTextStyle: {
          color: cssVar(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight,
          lineHeight,
        },
      },
      label: {
        color: cssVar(`--ht-text-color-1${suffix}`),
        fontFamily,
        fontWeight,
        lineHeight,
      },
      markPoint: {
        label: {
          color: cssVar(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight,
          lineHeight,
        },
      },
      markLine: {
        label: {
          color: cssVar(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight,
          lineHeight,
        },
      },
      emphasis: {
        label: {
          color: cssVar(`--ht-text-color-1${suffix}`),
          fontFamily,
          fontWeight,
          lineHeight,
        },
      },
    };
  });
};

// #endregion
