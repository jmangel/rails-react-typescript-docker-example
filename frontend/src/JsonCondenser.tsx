import { MODES, PossibleRootScale, POSSIBLE_ROOT_SCALE_MAPPINGS } from "./ChordMapper";
import { ChordRowObject, QUERY_STRING_KEY_MAPPINGS } from "./ChordRow";

export const stringifyChordRowObject = (chordRowObject: ChordRowObject): string => {
  const clonedChordRowObject:  { [key: string]: string; } = {};

  (Object.keys(QUERY_STRING_KEY_MAPPINGS) as [keyof ChordRowObject]).forEach((fullKeyName) => {
    const shortKey = QUERY_STRING_KEY_MAPPINGS[fullKeyName as keyof ChordRowObject];
    clonedChordRowObject[shortKey] = chordRowObject[fullKeyName] || '';
  })

  const mode = MODES.find((mode) => mode.name === chordRowObject.selectedScale);
  if (mode) clonedChordRowObject.ss = `${POSSIBLE_ROOT_SCALE_MAPPINGS[mode.relatedScale.name]}${mode.relatedScale.startingDegree}`;

  // remove empty elements to save space
  const cleanedChordRowObject = Object.entries(clonedChordRowObject)
    .reduce((a: { [key: string]: string; },[k,v]) => (v === '' ? a : (a[k]=v, a)), {});

  return JSON.stringify(cleanedChordRowObject);
}

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
