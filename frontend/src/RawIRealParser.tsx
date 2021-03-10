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

const noteRegex = /([ABCDEFG][#b]?)/;
const degreeRegex = /[56791113]/;
const qualityRegex = new RegExp(`()|((([-+^ho]|add)*${degreeRegex}?([#b]?${degreeRegex})*sus?)alt?)`)
// const quality =  ('*' [^*]* '*' ) / (( ( [-+^ho] / 'add')* <degree>? ( [#b]? <degree> )*  'sus'? )  'alt'?)
// const rootnote = '/' <note>

const chordSplitter = /[ ,]/;
const chordMatcher = /[A-Gb#-^h/]*/;

export const rawToMeasures = (raw: string): ParsedMeasure[] => {
  console.warn(raw);
  raw = raw.trim();

  const splitMeasures = raw.split(measureSplitterRegexWithXyQ).filter((measure) => measure !== '');
  console.warn(splitMeasures);

  const measures = splitMeasures.map((measureString) => {
    return {
      chords: [{
        note: measureString
      }]
    };
  });

  // console.warn(measures);

  return measures;
}