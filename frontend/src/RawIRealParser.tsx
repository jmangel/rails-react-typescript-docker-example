interface ParsedChord {
  length?: number;
  note: string;
  quality?: string;
  bassNote?: string;
}

interface ParsedMeasure {
  chords: ParsedChord[];
};

const basicMeasureSplitter = String.raw ` ?L?Z|[\|\]\}]`;
const measureSplitterRegexWithXyQ = new RegExp(`(?<=XyQ(?!${basicMeasureSplitter})|${basicMeasureSplitter})`);

export const rawToMeasures = (raw: string): ParsedMeasure[] => {
  console.warn(raw);
  raw = raw.trim();

  const measures = raw.split(measureSplitterRegexWithXyQ).filter((measure) => measure !== '').map((measureString) => {
    return {
      chords: [{
        note: measureString
      }]
    };
  });

  console.warn(measures);

  return measures;
}