import { CHROMATIC_NOTES, PossibleRootScale, arrayRotate } from './ChordMapper'
import tinycolor from 'tinycolor2';

export const circleOfFifths: string[][] = [
  ['C', 'B#'],
  ['G'],
  ['D'],
  ['A'],
  ['E', 'Fb'],
  ['B', 'Cb'],
  ['F#', 'Gb'],
  ['C#', 'Db'],
  ['G#', 'Ab'],
  ['D#', 'Eb'],
  ['A#', 'Bb'],
  ['F', 'E#'],
]

export type MonochromaticPossibleRootScale = PossibleRootScale.m | PossibleRootScale.mm | PossibleRootScale.hm;

export const regenerateMonochromaticSchemes = (redRgbValue: number, greenRgbValue: number, blueRgbValue: number) => {
  const baseColor = [redRgbValue, greenRgbValue, blueRgbValue];

  const rgbColorWheel = arrayRotate(Array.from(Array(12)).map((_, i) => tinycolor(`rgb (${baseColor})`).spin(-i * (360/12))), 4);

  return rgbColorWheel.map((rgbColor) => {
    const monochromaticSchemeSize = 6;
    const monochromaticSchemeArray = rgbColor.monochromatic(monochromaticSchemeSize);
    const scaleQualityToMonochromaticColor: { [key in MonochromaticPossibleRootScale]: string } = {
      [PossibleRootScale.m]: monochromaticSchemeArray[0].toString('rgb'),
      [PossibleRootScale.mm]: monochromaticSchemeArray[monochromaticSchemeSize - 1].toString('rgb'),
      [PossibleRootScale.hm]: monochromaticSchemeArray[monochromaticSchemeSize - 2].toString('rgb'),
    };
    return scaleQualityToMonochromaticColor;
  });
}

const grayOpacities = [
  0.7,
  0.5,
  0.3,
]

const scaleToHexColor = (selectedScale: PossibleRootScale, selectedScaleRoot: string, monochromaticSchemes: { [key in MonochromaticPossibleRootScale]: string }[]): string => {
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