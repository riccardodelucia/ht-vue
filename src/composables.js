import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { ref } from 'vue';
import { useColorMode } from '@vueuse/core';
import { themeProperties } from './theme/theme';

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
 * Applies 'ht-darkmode' class to <html> for dark theme.
 *
 * @returns {Ref<string>} A Vue ref whose value is the current color theme: 'dark', 'light', or 'auto'.
 */
export const useHTColorTheme = () => {
  const theme = useColorMode({
    initialValue: 'auto',
    modes: {
      dark: 'ht-darkmode',
      light: '',
    },
  });

  return theme;
};

/**
 * Returns a plain ECharts theme object based on the current color theme.
 * Uses preloaded theme variables from theme.js and builds the ECharts theme
 * configuration dynamically for 'light' or 'dark' mode.
 * The palette type can be customized (e.g. 'full', 'simple').
 *
 * @param {string|Ref<string>} theme - The current color theme ('dark', 'light', or 'auto'), or a Vue ref.
 * @param {string} [paletteType='full'] - The palette type to use for chart colors.
 * @returns {Object} An ECharts theme object with resolved color and style values.
 */
export function useEChartsTheme(theme = 'light', paletteType = 'full') {
  let colorMode =
    typeof theme === 'object' && theme.value ? theme.value : theme;
  if (theme === 'auto') {
    colorMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  const vars = themeProperties[colorMode];

  const palettes = {
    full: [
      vars.chartOrange1,
      vars.chartBlue1,
      vars.chartGreen1,
      vars.chartYellow1,
      vars.chartBlue2,
      vars.chartOrange2,
      vars.chartPurple1,
      vars.chartNeutral1,
    ],
    simple: [vars.chartMainBlue, vars.chartMainRed, vars.chartMainGrey],
  };

  return {
    color: palettes[paletteType] || palettes.full,
    backgroundColor: vars.surface1,
    textStyle: {
      color: vars.textColor1,
      fontFamily: vars.fontFamily,
      fontWeight: vars.fontWeight,
      lineHeight: vars.lineHeight,
    },
    title: {
      textStyle: {
        color: vars.textColor1,
        fontFamily: vars.fontFamily,
        fontWeight: vars.fontWeightTitle,
        fontSize: vars.fontSizeTitle,
        lineHeight: vars.lineHeight,
      },
      subtextStyle: {
        color: vars.textColor2,
        fontFamily: vars.fontFamily,
        fontWeight: vars.fontWeight,
        lineHeight: vars.lineHeight,
      },
    },
    legend: {
      left: 'center',
      textStyle: {
        color: vars.textColor1,
        fontFamily: vars.fontFamily,
        fontWeight: 'bold',
        lineHeight: vars.lineHeight,
      },
    },
    tooltip: {
      backgroundColor: vars.surface2,
      borderColor: vars.surfaceShadow,
      textStyle: {
        color: vars.textColor1,
        fontFamily: vars.fontFamily,
        fontWeight: vars.fontWeight,
        lineHeight: vars.lineHeight,
      },
    },
    xAxis: {
      axisLabel: {
        color: vars.textColor1,
        fontFamily: vars.fontFamily,
        fontWeight: vars.fontWeight,
        lineHeight: vars.lineHeight,
      },
      nameTextStyle: {
        color: vars.textColor1,
        fontFamily: vars.fontFamily,
        fontWeight: vars.fontWeightTitle,
        lineHeight: vars.lineHeight,
      },
      splitLine: {
        lineStyle: {
          color: vars.splitlineColor,
          type: 'dashed',
        },
      },
    },
    yAxis: {
      axisLabel: {
        color: vars.textColor1,
        fontFamily: vars.fontFamily,
        fontWeight: vars.fontWeight,
        lineHeight: vars.lineHeight,
      },
      nameTextStyle: {
        color: vars.textColor1,
        fontFamily: vars.fontFamily,
        fontWeight: vars.fontWeightTitle,
        lineHeight: vars.lineHeight,
      },
      splitLine: {
        lineStyle: {
          color: vars.splitlineColor,
          type: 'dashed',
        },
      },
    },
    label: {
      color: vars.textColor1,
      fontFamily: vars.fontFamily,
      fontWeight: vars.fontWeight,
      lineHeight: vars.lineHeight,
    },
    visualMap: {
      textStyle: {
        color: vars.textColor1,
        fontFamily: vars.fontFamily,
        fontWeight: vars.fontWeight,
        lineHeight: vars.lineHeight,
      },
    },
    seriesDefaults: {
      heatmap: {
        itemStyle: {
          borderColor: vars.chartNeutral1,
          borderWidth: 1,
        },
      },
    },
  };
}

// #endregion
