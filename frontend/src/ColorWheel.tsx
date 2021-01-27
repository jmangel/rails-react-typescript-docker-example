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
  }).reverse(); // reverse so that it moves clockwise as in circle of fifths

  const mmChartSections = majorChartSections.map((entry) => {
    return {
      ...entry,
      quality: PossibleRootScale.mm,
    };
  });

  const hmChartSections = arrayRotate(majorChartSections.map((entry) => {
    return {
      ...entry,
      quality: PossibleRootScale.hm,
    };
  }), 9); // 9 instead of 3 because we reversed so that it moves clockwise as in circle of fifths

  const legendQualityMappings: { [key in PossibleRootScale]?: string } = {
    [PossibleRootScale.hm]: '  h.m.',
    [PossibleRootScale.mm]: '  m.m.',
  };

  const startAngle = 90 + (360 / majorChartSections.length / 2);

  const RADIAN = Math.PI / 180;
  class CustomizedLabel extends React.Component {
    render () {
      const {
        cx, cy, midAngle, innerRadius, outerRadius, name, quality
      } = this.props as {cx: number, cy: number, midAngle: number, innerRadius: number, outerRadius: number, name: string, quality: PossibleRootScale};

      let radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      if (innerRadius == 0) radius = innerRadius + (outerRadius - innerRadius) * 0.7;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      const rotationAngle = midAngle + ((midAngle % 360) >= 90 && (midAngle % 360) < 270 ? 180 : 0)
      const textProps = innerRadius == 0 ? {
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
          fontSize={25}
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
          data={hmChartSections}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={175}
          isAnimationActive={false}
          labelLine={false}
          label={<CustomizedLabel />}
          startAngle={startAngle}
          endAngle={360 + startAngle}
        >
          {
            hmChartSections.map((entry, index) => <Cell key={`cell-${index}`} fill={scaleToHexColor(entry.quality, entry.name)} />)
          }
        </Pie>
        <Pie
          data={mmChartSections}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={175}
          outerRadius={300}
          isAnimationActive={false}
          labelLine={false}
          label={<CustomizedLabel />}
          startAngle={startAngle}
          endAngle={360 + startAngle}
        >
          {
            mmChartSections.map((entry, index) => <Cell key={`cell-${index}`} fill={scaleToHexColor(entry.quality, entry.name)} />)
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
          startAngle={startAngle}
          endAngle={360 + startAngle}
        >
          {
            majorChartSections.map((entry, index) => <Cell key={`cell-${index}`} fill={scaleToHexColor(entry.quality, entry.name)} />)
          }
        </Pie>
      </PieChart>
  )
}

export default ColorWheel;
