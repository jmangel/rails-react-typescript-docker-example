import { CHROMATIC_NOTES } from './ChordMapper'

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

const scaleToHexColor = (selectedScale: string, selectedScaleRoot: string): string => {
  console.warn(selectedScale, selectedScaleRoot);

  if (selectedScale == 'major') {
    const circleOfFifthsIndex = circleOfFifths.findIndex((enharmonicNotesArray: string[]) => enharmonicNotesArray.indexOf(selectedScaleRoot) > -1);
    return colorWheel[circleOfFifthsIndex];
  }
  return '1';
}

export default scaleToHexColor