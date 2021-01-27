import React from 'react';
import {
  PieChart, Pie, Cell,
} from 'recharts';
import { PossibleRootScale } from './ChordMapper';
import { circleOfFifthsMajorColors, opacities } from './ScaleColorer';

const ColorWheel: React.FC = () => {
  const majorChartSections = Object.entries(circleOfFifthsMajorColors).map(([note, rgbArray]) => {
    return {
      name: note,
      rgbArray,
      value: 100,
      quality: PossibleRootScale.m,
    };
  });

  const mmChartSections = majorChartSections.map((entry) => {
    return {
      ...entry,
      quality: PossibleRootScale.mm,
    };
  });

  const hmChartSections = majorChartSections.map((entry) => {
    return {
      ...entry,
      quality: PossibleRootScale.hm,
    };
  });

  const fillForEntry = ({ rgbArray, quality }: { rgbArray: Array<number>, quality: PossibleRootScale }) => `rgba(${rgbArray},${opacities[quality]})`;

  const RADIAN = Math.PI / 180;
  class CustomizedLabel extends React.Component {
    render () {
      const {
        cx, cy, midAngle, innerRadius, outerRadius, name, quality
      } = this.props as {cx: number, cy: number, midAngle: number, innerRadius: number, outerRadius: number, name: string, quality: PossibleRootScale};

      let radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      if (quality == PossibleRootScale.mm) radius = innerRadius + (outerRadius - innerRadius) * 0.7;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="white"
          stroke="black"
          fontSize={25}
          strokeWidth={0.8}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {name}
        </text>
      );
    }
  }

  return (
    <PieChart width={800} height={800}>
        <Pie
          data={mmChartSections}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={120}
          isAnimationActive={false}
          labelLine={false}
          label={<CustomizedLabel />}
        >
          {
            mmChartSections.map((entry, index) => <Cell key={`cell-${index}`} fill={fillForEntry(entry)} />)
          }
        </Pie>
        <Pie
          data={hmChartSections}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={120}
          outerRadius={220}
          isAnimationActive={false}
          labelLine={false}
          label={<CustomizedLabel />}
        >
          {
            hmChartSections.map((entry, index) => <Cell key={`cell-${index}`} fill={fillForEntry(entry)} />)
          }
        </Pie>
        <Pie
          data={majorChartSections}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={220}
          isAnimationActive={false}
          labelLine={false}
          label={<CustomizedLabel />}
        >
          {
            majorChartSections.map((entry, index) => <Cell key={`cell-${index}`} fill={fillForEntry(entry)} />)
          }
        </Pie>
      </PieChart>
  )
}

export default ColorWheel;
