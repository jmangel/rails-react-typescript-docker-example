import { MODES, PossibleRootScale, POSSIBLE_ROOT_SCALE_MAPPINGS } from "./ChordMapper";
import { ChordRowObject, QUERY_STRING_KEY_MAPPINGS } from "./ChordRow";

const CSV_DELIMITER = '|';
const CSV_DELIMITER_REGEX = new RegExp(`[${CSV_DELIMITER}]`, 'g');

const SORTED_CHORD_ROW_OBJECT_KEYS = Object.keys(QUERY_STRING_KEY_MAPPINGS);

export const parseStringifiedChordRowObject = (stringifiedObject: string): ChordRowObject => {
  let parsedObject = JSON.parse(stringifiedObject)

  Object.keys(QUERY_STRING_KEY_MAPPINGS).forEach((fullKeyName) => {
    const shortKey = QUERY_STRING_KEY_MAPPINGS[fullKeyName as keyof ChordRowObject];
    parsedObject[fullKeyName] = parsedObject[shortKey] || '';

    if (shortKey === 'ss') {
      // 'ss' is the only short key we have to process
      const encodedSelectedScale = parsedObject.ss || '';

      const matches = encodedSelectedScale.match(/^([a-z]+)([0-9]+)$/);
      if (matches) {
        let modeEncoding: keyof typeof PossibleRootScale;
        let startingDegree: number;
        [, modeEncoding, startingDegree] = matches;

        const mode = MODES.find((mode) => mode.relatedScale.name === PossibleRootScale[modeEncoding] && mode.relatedScale.startingDegree == startingDegree)
        if (mode) parsedObject[fullKeyName] = mode.name;
      }
    }

    // TODO remove backward compatibility for ssr
    if (shortKey === 'r') {
      if (parsedObject[fullKeyName] === '') parsedObject[fullKeyName] = parsedObject.ssr || ''
      delete parsedObject.ssr;
    }
    delete parsedObject[shortKey];
  })
  return parsedObject;
}

export const csvifyChordRowObject = (chordRowObject: ChordRowObject): string => {
  // make sure values are predictably sorted
  const ordered = {} as ChordRowObject;
  (Object.keys(chordRowObject) as [keyof ChordRowObject]).sort((a, b) => {
    return SORTED_CHORD_ROW_OBJECT_KEYS.indexOf(a) - SORTED_CHORD_ROW_OBJECT_KEYS.indexOf(b);
  }).forEach((key) => {
    ordered[key] = chordRowObject[key];
  });

  const encodedSelectedScale = encodeSelectedScale(chordRowObject.selectedScale)
  if (encodedSelectedScale) ordered.selectedScale = encodedSelectedScale;

  const valuesArray = Object.values(ordered);
  return valuesArray.join(CSV_DELIMITER);
}

export const csvifyChordRowObjects = (chordRowObjects: Array<ChordRowObject>): string => {
  return chordRowObjects.map((chordRowObject) => csvifyChordRowObject(chordRowObject)).join('\n')
}

export const parseCsvifiedChordRowObjects = (csvifiedObject: string): ChordRowObject[] => {
  const lines = csvifiedObject.split('\n');

  const headers = SORTED_CHORD_ROW_OBJECT_KEYS;

  return lines.map((line) => {
    let chordRowObject = {} as ChordRowObject;

    headers.forEach((header, i) => {
      const stringifiedValue = line.split(CSV_DELIMITER_REGEX)[i];
      chordRowObject[header as keyof ChordRowObject] = stringifiedValue;

      if (header === 'selectedScale') {
        // 'selectedScale' is the only column we have to process
        const encodedSelectedScale = stringifiedValue;

        const matches = encodedSelectedScale.match(/^([a-z]+)([0-9]+)$/);
        if (matches) {
          let modeEncoding: string;
          let startingDegree: string;
          [, modeEncoding, startingDegree] = matches;

          const mode = MODES.find((mode) => mode.relatedScale.name === PossibleRootScale[modeEncoding as keyof typeof PossibleRootScale] && mode.relatedScale.startingDegree.toString() == startingDegree)
          if (mode) chordRowObject.selectedScale = mode.name;
        }
      }
    })

    return chordRowObject;
  });
}

const encodeSelectedScale = (selectedScale: string): string => {
  const mode = MODES.find((mode) => mode.name === selectedScale);
  return mode ? `${POSSIBLE_ROOT_SCALE_MAPPINGS[mode.relatedScale.name]}${mode.relatedScale.startingDegree}` : '';
}