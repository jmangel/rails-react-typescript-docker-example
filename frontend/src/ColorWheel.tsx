import React from 'react';
import {
  PieChart, Pie, Cell,
} from 'recharts';
import { arrayRotate, PossibleRootScale } from './ChordMapper';
import scaleToHexColor, { circleOfFifthsMajorColors } from './ScaleColorer';

const ColorWheel: React.FC = () => {
  const majorChartSections = Object.entries(circleOfFifthsMajorColors).map(([note, rgbArray]) => {
    return {
      name: note,
      rgbArray,
      value: 100,
      quality: PossibleRootScale.m,
    };
  });

  const mmChartSections = arrayRotate(majorChartSections.map((entry) => {
    return {
      ...entry,
      quality: PossibleRootScale.mm,
    };
  }), 3);

  const hmChartSections = mmChartSections.map((entry) => {
    return {
      ...entry,
      quality: PossibleRootScale.hm,
    };
  });

  const legendQualityMappings: { [key in PossibleRootScale]?: string } = {
    [PossibleRootScale.hm]: '  h.m.',
    [PossibleRootScale.mm]: '  m.m.',
  };

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

      const rotationAngle = midAngle + (midAngle >= 90 && midAngle < 270 ? 180 : 0)
      const textProps = quality == PossibleRootScale.mm ? {
        x: 0,
        y: 0,
        transform: `translate(${x}, ${y}) rotate(-${rotationAngle})`
      } : {
        x,
        y
      };

      return (
        <text
          {...textProps}
          fill="white"
          stroke="black"
          fontSize={25}
          strokeWidth={0.8}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {name}{legendQualityMappings[quality]}
        </text>
      );
    }
  }

  return (
    <PieChart width={1000} height={1000}>
        <Pie
          data={mmChartSections}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={175}
          isAnimationActive={false}
          labelLine={false}
          label={<CustomizedLabel />}
        >
          {
            mmChartSections.map((entry, index) => <Cell key={`cell-${index}`} fill={scaleToHexColor(entry.quality, entry.name)} />)
          }
        </Pie>
        <Pie
          data={hmChartSections}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={175}
          outerRadius={300}
          isAnimationActive={false}
          labelLine={false}
          label={<CustomizedLabel />}
        >
          {
            hmChartSections.map((entry, index) => <Cell key={`cell-${index}`} fill={scaleToHexColor(entry.quality, entry.name)} />)
          }
        </Pie>
        <Pie
          data={majorChartSections}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={300}
          isAnimationActive={false}
          labelLine={false}
          label={<CustomizedLabel />}
        >
          {
            majorChartSections.map((entry, index) => <Cell key={`cell-${index}`} fill={scaleToHexColor(entry.quality, entry.name)} />)
          }
        </Pie>
      </PieChart>
  )
}

export default ColorWheel;
