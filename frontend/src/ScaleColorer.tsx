import { CHROMATIC_NOTES, PossibleRootScale, arrayRotate } from './ChordMapper'

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
]

export const circleOfFifthsMajorColors: { [key: string]: number[] } = {};

circleOfFifths.forEach((enharmonicNotesArray: Array<string>, index: number) => circleOfFifthsMajorColors[enharmonicNotesArray[0]] = rgbColorWheel[index])

const grayOpacities = [
  0.87,
  0.6,
  0.38,
]

export const opacities: { [key in PossibleRootScale]: number } = {
  [PossibleRootScale.m]: 1.0,
  [PossibleRootScale.hm]: 0.4,
  [PossibleRootScale.mm]: 0.25,
  [PossibleRootScale.d]: 0.1, // should be unused
  [PossibleRootScale.wt]: 1.0, // should be unused
};

const scaleToHexColor = (selectedScale: PossibleRootScale, selectedScaleRoot: string): string => {
  if (selectedScale == PossibleRootScale.d) {
    // 3 shades of gray

    const chromaticIndex = CHROMATIC_NOTES.findIndex((enharmonicNotesArray: string[]) => enharmonicNotesArray.indexOf(selectedScaleRoot) > -1);
    const moddedChromaticIndex = chromaticIndex % 3;
    return `rgb(0,0,0,${grayOpacities[moddedChromaticIndex]})`;
  }

  let rotatedCircleOfFifths = circleOfFifths;
  if ([PossibleRootScale.mm, PossibleRootScale.hm].indexOf(selectedScale) > -1) rotatedCircleOfFifths = arrayRotate(circleOfFifths, 3);

  const circleOfFifthsIndex = rotatedCircleOfFifths.findIndex((enharmonicNotesArray: string[]) => enharmonicNotesArray.indexOf(selectedScaleRoot) > -1);

  if (selectedScale == PossibleRootScale.wt) {
    // black or white
    const moddedCircleOfFifthsIndex = circleOfFifthsIndex % 2;
    return moddedCircleOfFifthsIndex ? 'black' : 'white';
  }

  const rgbColor = rgbColorWheel[circleOfFifthsIndex];
  const opacity = opacities[selectedScale];

  return `rgb(${rgbColor},${opacity})`;
}

export default scaleToHexColor