import { CHROMATIC_NOTES, PossibleRootScale } from './ChordMapper'

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

const colorWheel = [
  '#FFFF00', // yellow
  '#FF8000', // orange
  '#FF0000', // red
  '#FF0080', // deep pink
  '#FF00FF', // magenta
  '#8000FF', // purple
  '#0000FF', // deep blue
  '#0080FF', // blue
  '#00FFFF', // sky blue
  '#00FF80', // cyan green
  '#00FF00', // green
  '#80FF00', // yellow green
]

const rgbColorWheel = [
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

const grayOpacities = [
  0.87,
  0.6,
  0.38,
]

const opacities: { [key in PossibleRootScale]: number } = {
  [PossibleRootScale.m]: 1.0,
  [PossibleRootScale.mm]: 0.6,
  [PossibleRootScale.hm]: 0.4,
  [PossibleRootScale.d]: 0.1,
  [PossibleRootScale.wt]: 1.0,
};

const scaleToHexColor = (selectedScale: PossibleRootScale, selectedScaleRoot: string): string => {
  console.warn(selectedScale, selectedScaleRoot);

  if (selectedScale == PossibleRootScale.d) {
    // 3 shades of gray

    const chromaticIndex = CHROMATIC_NOTES.findIndex((enharmonicNotesArray: string[]) => enharmonicNotesArray.indexOf(selectedScaleRoot) > -1);
    const moddedChromaticIndex = chromaticIndex % 3;
    return `rgb(0,0,0,${grayOpacities[moddedChromaticIndex]})`;
  }

  const circleOfFifthsIndex = circleOfFifths.findIndex((enharmonicNotesArray: string[]) => enharmonicNotesArray.indexOf(selectedScaleRoot) > -1);

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