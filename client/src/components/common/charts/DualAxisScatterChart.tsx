import { ChartOptions } from 'chart.js';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { AxisProps, DataProps, ScatterChartProps } from './ScatterChart';

// Interface to define structure of input for dual axis scatter charts with shared X-Axis.
// Extends existing ScatterChartProps interface by adding a second set of
// Y-Axis data and associated attributes.
export interface DualAxisScatterChartProps extends ScatterChartProps {
  // Second Y-Axis label and units
  yAxis2: AxisProps;
  // Second Y-Axis data values
  data2: DataProps[];
  // Data2 background colour
  data2Colour: string;
  // Data2 Max value
  max2: number;
  // Data2 Max Line Colour
  max2Colour: string;
}

/**
 * Dual Axis Scatter Chart Component
 *
 * Takes various chart parameters (e.g. title, axis labels/units, max value)
 * and returns a JSX Component for a dual-axis scatter chart.
 *
 * @param props Props
 * @returns Component
 */
export default function DualAxisScatterChart({
  title,
  xAxis,
  yAxis,
  data,
  dataColour,
  max,
  maxColour,
  yAxis2,
  data2,
  data2Colour,
  max2,
  max2Colour,
  maintainAspectRatio = true,
}: DualAxisScatterChartProps): JSX.Element {
  const options: ChartOptions = {
    title: {
      display: true,
      text: title,
      fontSize: 14,
    },
    maintainAspectRatio,
    animation: {
      duration: 0,
    },
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: `${xAxis.label} (${xAxis.unit})`,
          },
          ticks: {
            min: 0,
          },
        },
      ],
      yAxes: [
        {
          id: 'y-axis-1',
          display: true,
          scaleLabel: {
            display: true,
            labelString: `${yAxis.label} (${yAxis.unit})`,
            fontColor: dataColour,
          },
          stacked: false,
          ticks: {
            min: 0,
            max: Math.ceil((max + 1) / 100) * 100,
            fontColor: dataColour,
          },
          position: 'left',
        },
        {
          id: 'y-axis-2',
          display: true,
          scaleLabel: {
            display: true,
            labelString: `${yAxis2.label} (${yAxis2.unit})`,
            fontColor: data2Colour,
          },
          stacked: false,
          ticks: {
            min: 0,
            max: Math.ceil((max2 + 1) / 100) * 100,
            beginAtZero: true,
            fontColor: data2Colour,
          },
          position: 'right',
        },
      ],
    },
    annotation: {
      drawTime: 'afterDraw',
      annotations: [
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-1',
          value: max,
          borderColor: maxColour,
          borderDash: [10, 10],
          label: {
            enabled: true,
            content: `${Math.round(max * 100) / 100} ${yAxis.unit}`,
            yAdjust: 15,
          },
        },
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-2',
          value: max2,
          borderColor: max2Colour,
          borderDash: [10, 10],
          label: {
            enabled: true,
            content: `${Math.round(max2 * 100) / 100} ${yAxis2.unit}`,
            yAdjust: 15,
          },
        },
      ],
    },
    plugins: [AnnotationPlugin],
  };

  const formattedData = {
    datasets: [
      {
        label: 'Power data',
        data,
        borderColor: dataColour,
        pointRadius: 0,
        showLine: true,
        yAxisID: 'y-axis-1',
        lineTension: 0,
      },
      {
        label: 'Speed data',
        data: data2,
        borderColor: data2Colour,
        pointRadius: 0,
        showLine: true,
        yAxisID: 'y-axis-2',
        lineTension: 0,
      },
    ],
  };

  return <Scatter options={options} data={formattedData} />;
}
