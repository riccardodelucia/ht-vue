<template>
  <g ref="axis"></g>
</template>

<script>
import { select, axisBottom, axisLeft, axisRight, axisTop } from 'd3';
import { ref, watchEffect } from 'vue';

export default {
  name: 'HTChartAxis',
  props: {
    scale: {
      type: Function,
      required: true,
    },
    tickSize: {
      type: Number,
      default: 5,
    },
    position: {
      type: String,
      default: 'bottom',
    },
    strokeOpacity: { type: Number, default: 0.2 },
    textDx: { type: String, default: '0px' },
    textDy: { type: String, default: '0px' },
    textRotation: { type: Number, default: 0 },
    textAnchor: { type: String, default: 'start' },
  },
  setup(props) {
    const axis = ref(null);
    let axisFunction = null;
    switch (props.position) {
      case 'left':
        axisFunction = (scale) => axisLeft(scale).tickSize(props.tickSize);
        break;
      case 'right':
        axisFunction = (scale) => axisRight(scale).tickSize(props.tickSize);
        break;
      case 'top':
        axisFunction = (scale) => axisTop(scale).tickSize(props.tickSize);
        break;
      case 'bottom':
        axisFunction = (scale) => axisBottom(scale).tickSize(props.tickSize);
        break;
      default:
        axisFunction = (scale) => axisBottom(scale).tickSize(props.tickSize);
        break;
    }

    watchEffect(
      () => {
        select(axis.value)
          .call(axisFunction(props.scale))
          .attr('stroke-opacity', props.strokeOpacity)
          .selectAll('text')
          .style('text-anchor', props.textAnchor)
          .attr('dx', props.textDx)
          .attr('dy', props.textDy)
          .attr('transform', `rotate(${props.textRotation})`);
      },
      {
        flush: 'post',
      }
    );

    return {
      axisFunction,
      axis,
    };
  },
};
</script>
