import { CHROMATIC_NOTES, PossibleRootScale, arrayRotate } from './ChordMapper'
import tinycolor from 'tinycolor2';

const circleOfFifths: string[][] = [
  ['C'],
  ['G'],
  ['D'],
  ['A'],
  ['E'],
  ['B'],
  ['F#', 'Gb'],
  ['C#', 'Db'],
  ['G#', 'Ab'],
  ['D#', 'Eb'],
  ['A#', 'Bb'],
  ['F'],
]

export const rgbColorWheel = [
  [255,255,0], // yellow
  [255,125,0], // orange
  [255,0,0], // red
  [255,0,125], // raspberry
  [255,0,255], // magenta
  [125,0,255], // violet
  [0,0,255], // blue
  [0,125,255], // ocean
  [0,255,255], // cyan
  [0,255,125], // turquoise
  [0,255,0], // green
  [125,255,0], // spring green
  // BRIGHTER OPTIONS
  // [255,255,65], // yellow
  // [255,189,64], // orange
  // [255,64,64], // red
  // [255,64,189], // raspberry
  // [255,64,255], // magenta
  // [189,64,255], // violet
  // [64,64,255], // blue
  // [64,189,255], // ocean
  // [64,255,255], // cyan
  // [64,255,189], // turquoise
  // [64,255,64], // green
  // [189,255,64], // spring green
];

type MonochromaticPossibleRootScale = PossibleRootScale.m | PossibleRootScale.mm | PossibleRootScale.hm;

const monochromaticSchemes: { [key in MonochromaticPossibleRootScale]: string }[] = rgbColorWheel.map((rgbArray) => {
  const monochromaticSchemeArray = tinycolor(`rgb (${rgbArray})`).monochromatic(4);
  const scaleQualityToMonochromaticColor: { [key in MonochromaticPossibleRootScale]: string } = {
    [PossibleRootScale.m]: monochromaticSchemeArray[0].toString('rgb'),
    [PossibleRootScale.mm]: monochromaticSchemeArray[3].toString('rgb'),
    [PossibleRootScale.hm]: monochromaticSchemeArray[2].toString('rgb'),
  };
  return scaleQualityToMonochromaticColor;
});

export const circleOfFifthsMajorColors: { [key: string]: number[] } = {};

circleOfFifths.forEach((enharmonicNotesArray: Array<string>, index: number) => circleOfFifthsMajorColors[enharmonicNotesArray[0]] = rgbColorWheel[index])

const grayOpacities = [
  0.7,
  0.5,
  0.3,
]

const scaleToHexColor = (selectedScale: PossibleRootScale, selectedScaleRoot: string): string => {
  if (selectedScale == PossibleRootScale.d) {
    // 3 shades of gray

    const chromaticIndex = CHROMATIC_NOTES.findIndex((enharmonicNotesArray: string[]) => enharmonicNotesArray.indexOf(selectedScaleRoot) > -1);
    const moddedChromaticIndex = chromaticIndex % 3;
    return `rgb(0,0,0,${grayOpacities[moddedChromaticIndex]})`;
  }

  let rotatedCircleOfFifths = circleOfFifths;
  if (selectedScale == PossibleRootScale.hm) rotatedCircleOfFifths = arrayRotate(circleOfFifths, 3);

  const circleOfFifthsIndex = rotatedCircleOfFifths.findIndex((enharmonicNotesArray: string[]) => enharmonicNotesArray.indexOf(selectedScaleRoot) > -1);

  if (selectedScale == PossibleRootScale.wt) {
    // black or white
    const moddedCircleOfFifthsIndex = circleOfFifthsIndex % 2;
    return moddedCircleOfFifthsIndex ? 'white' : 'black';
  }

  const monochromaticScheme = monochromaticSchemes[circleOfFifthsIndex];
  const monochromaticColor = monochromaticScheme[selectedScale as MonochromaticPossibleRootScale];
  return monochromaticColor;
}

export default scaleToHexColor