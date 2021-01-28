import React from 'react';
import {
  PieChart, Pie, Cell,
} from 'recharts';
import { arrayRotate, PossibleRootScale } from './ChordMapper';
import scaleToHexColor, { circleOfFifths, MonochromaticPossibleRootScale } from './ScaleColorer';

const ColorWheel: React.FC<{
  monochromaticSchemes: { [key in MonochromaticPossibleRootScale]: string }[],
  }> = ({
    monochromaticSchemes,
  }) => {
  const majorChartSections = circleOfFifths.map((enharmonicNotesArray: Array<string>) => {
    return {
      name: enharmonicNotesArray[0],
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

  const diminishedChartSections = majorChartSections.map((entry) => {
    return {
      ...entry,
      quality: PossibleRootScale.d,
    };
  });

  const wholeToneChartSections = majorChartSections.map((entry) => {
    return {
      ...entry,
      quality: PossibleRootScale.wt,
    };
  });

  const legendQualityMappings: { [key in PossibleRootScale]?: string } = {
    [PossibleRootScale.hm]: '  h.m.',
    [PossibleRootScale.mm]: '  m.m.',
    [PossibleRootScale.d]: '  dim.',
    [PossibleRootScale.wt]: '  whole tone',
  };

  const startAngle = 90 + (360 / majorChartSections.length / 2);

  const RADIAN = Math.PI / 180;
  class CustomizedLabel extends React.Component {
    render () {
      const {
        cx, cy, midAngle, innerRadius, outerRadius, name, quality
      } = this.props as {cx: number, cy: number, midAngle: number, innerRadius: number, outerRadius: number, name: string, quality: PossibleRootScale};

      let radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      if (innerRadius <= 115) radius = 115;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      const rotationAngle = midAngle + ((midAngle % 360) >= 90 && (midAngle % 360) < 270 ? 180 : 0)
      const textProps = radius == 115 ? {
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

  const pieChartDimensions = 1130;

  return (
    <PieChart width={pieChartDimensions} height={pieChartDimensions} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
      <Pie
        data={wholeToneChartSections}
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius={195}
        isAnimationActive={false}
        labelLine={false}
        label={<CustomizedLabel />}
        startAngle={startAngle}
        endAngle={360 + startAngle}
      >
        {
          wholeToneChartSections.map((entry, index) => <Cell key={`cell-${index}`} fill={scaleToHexColor(entry.quality, entry.name, monochromaticSchemes)} />)
        }
      </Pie>
      <Pie
        data={diminishedChartSections}
        dataKey="value"
        cx="50%"
        cy="50%"
        innerRadius={195}
        outerRadius={280}
        isAnimationActive={false}
        labelLine={false}
        label={<CustomizedLabel />}
        startAngle={startAngle}
        endAngle={360 + startAngle}
      >
        {
          diminishedChartSections.map((entry, index) => <Cell key={`cell-${index}`} fill={scaleToHexColor(entry.quality, entry.name, monochromaticSchemes)} />)
        }
      </Pie>
      <Pie
        data={hmChartSections}
        dataKey="value"
        cx="50%"
        cy="50%"
        innerRadius={280}
        outerRadius={365}
        isAnimationActive={false}
        labelLine={false}
        label={<CustomizedLabel />}
        startAngle={startAngle}
        endAngle={360 + startAngle}
      >
        {
          hmChartSections.map((entry, index) => <Cell key={`cell-${index}`} fill={scaleToHexColor(entry.quality, entry.name, monochromaticSchemes)} />)
        }
      </Pie>
      <Pie
        data={mmChartSections}
        dataKey="value"
        cx="50%"
        cy="50%"
        innerRadius={365}
        outerRadius={460}
        isAnimationActive={false}
        labelLine={false}
        label={<CustomizedLabel />}
        startAngle={startAngle}
        endAngle={360 + startAngle}
      >
        {
          mmChartSections.map((entry, index) => <Cell key={`cell-${index}`} fill={scaleToHexColor(entry.quality, entry.name, monochromaticSchemes)} />)
        }
      </Pie>
      <Pie
        // legendType="none"
        data={majorChartSections}
        dataKey="value"
        cx="50%"
        cy="50%"
        innerRadius={460}
        outerRadius="90%"
        isAnimationActive={false}
        labelLine={false}
        label={<CustomizedLabel />}
        startAngle={startAngle}
        endAngle={360 + startAngle}
      >
        {
          majorChartSections.map((entry, index) => <Cell key={`cell-${index}`} fill={scaleToHexColor(entry.quality, entry.name, monochromaticSchemes)} />)
        }
      </Pie>
    </PieChart>
  )
}

export default ColorWheel;
