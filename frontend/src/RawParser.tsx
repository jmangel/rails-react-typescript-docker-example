import ChordRow from "./ChordRow";

interface ParsedChord {
  chordString?: string;
  beats?: string;
  noChord?: boolean;
}
interface ParsedMeasure {
  chords: ParsedChord[];
  timeSignature: string;
};

let measures: ParsedMeasure[] = [];
let startRepeatLocation: number | null | undefined = null;
let endRepeatLocation: number | null | undefined = null;
let lastChord: string | null | undefined = null;
let codaLocation: number | null | undefined = null;
let segnoLocation: number | null | undefined = null;
let timeSignature: string = '44';
let thirdEndingImminent = false;
let dcAlCodaImminent = false;
let dsAlCodaImminent = false;
let fineLocation: number | null | undefined = null;
let dcAlFineImminent = false;

function resetVars() {
  measures = [];
  startRepeatLocation = null;
  endRepeatLocation = null;
  lastChord = null;
  codaLocation = null;
  segnoLocation = null;
  timeSignature = '44';
  thirdEndingImminent = false;
  dcAlCodaImminent = false;
  dsAlCodaImminent = false;
  fineLocation = null;
  dcAlFineImminent = false;
}

const rules = [
  { token: 'XyQ', description: 'Empty space' },
  { token: /\*\w/, description: 'Section marker' },
  { token: /<(.*?)>/, description: 'Comments inside carets', matchOperation: checkForRepeats },
  { token: /T(\d+)/, description: 'Time signature', matchOperation: setTimeSignature },
  { token: 'x', description: 'Repeat previous measure in current measure', operation: repeatLastMeasure },
  { token: 'Kcl', description: 'Repeat previous measure and create new measure', operation: repeatLastMeasureAndAddNew },
  { token: 'r|XyQ', description: 'Repeat previous two measures', operation: repeatLastTwoMeasures },
  { token: /Y+/, description: 'Vertical spacers' },
  { token: 'n', description: 'No Chord (N.C)', operation: pushNull },
  { token: 'p', description: 'Pause slash' },
  { token: 'U', description: 'Ending measure for player' },
  { token: 'S', description: 'Segno', operation: setSegnoLocation },
  { token: 'Q', description: 'Coda', operation: setCodaLocation },
  { token: '{', description: 'Start repeat marker', operation: setStartRepeatLocation },
  { token: '}', description: 'End repeat marker', operation: repeatEverythingToEndRepeatLocation },
  { token: 'LZ|', description: 'Bar line', operation: createNewMeasure },
  { token: '|', description: 'Bar line', operation: createNewMeasure },
  { token: 'LZ', description: 'Bar line', operation: () => { handleLZ(); createNewMeasure(); }},
  { token: '[', description: 'Double bar start', operation: createNewMeasure },
  { token: ']', description: 'Double bar end', operation: repeatRemainingEndings },
  { token: /N(\d)/, description: 'Numbered endings', matchOperation: setEndRepeatLocation },
  { token: 'Z', description: 'Final bar line', operation: repeatRemainingEndings },
  { token: /[A-GW]{1}[\+\-\^\dhob#suadlt]*(\/[A-G][#b]?)?,? */, description: 'Chord', matchOperation: pushChordInMeasures }
];

//chord regex:
//  letters A-G and W (W is an invisible slash chord)
//  {1} only one of the aforementioned letters
//  followed by zero or more of these: + - ^ h o # b digit
//  followed by an optional group (to catch slash chords)
//    that starts with a slash
//    followed by A-G
//    followed by optional # or b

function checkForRepeats(match: RegExpMatchArray) {
  if (match[1].toLowerCase() === 'd.c. al 3rd ending') {
    thirdEndingImminent = true;
  }
  if (match[1].toLowerCase() === 'd.c. al fine') {
    dcAlFineImminent = true;
  }
  if (match[1].toLowerCase() === 'd.c. al coda') {
    dcAlCodaImminent = true;
  }
  if (match[1].toLowerCase() === 'd.s. al coda') {
    dsAlCodaImminent = true;
  }
  if (match[1].toLowerCase() === 'fine') {
    fineLocation = measures.length;
  }
}

function setTimeSignature(match: RegExpMatchArray) {
  timeSignature = match[1];
  measures[measures.length - 1].timeSignature = timeSignature
}

function pushNull() {
  if (measures.length === 0) measures.push({ chords: [], timeSignature });
  measures[measures.length - 1].chords.push({ noChord: true });
}

function repeatLastMeasure() {
  measures[measures.length - 1] = measures[measures.length - 2];
}

function repeatLastMeasureAndAddNew() {
  measures[measures.length] = measures[measures.length - 1];
}

function repeatLastTwoMeasures() {
  measures[measures.length - 1] = measures[measures.length - 3];
  measures[measures.length] = measures[measures.length - 2];
}

function setStartRepeatLocation() {
  createNewMeasure();
  startRepeatLocation = measures.length - 1;
  endRepeatLocation = null;
}

function setEndRepeatLocation(match: RegExpMatchArray) {
  //if the ending is N1, set that as the end of the repeat, because next time around we go to N2
  const ending = parseInt(match[1]);
  if (ending === 1) {
    endRepeatLocation = measures.length - 1;
  }
}

function setSegnoLocation() {
  segnoLocation = measures.length - 1;
}

function setCodaLocation() {
  codaLocation = measures.length;
}

function createNewMeasure() {
  //unless the last measure is a blank, insert a new blank measure
  if (measures.length === 0 || measures[measures.length - 1].chords.length !== 0) {
    measures.push({ chords: [], timeSignature });
  }
}

function handleLZ() {
  console.warn('handleLZ');

  // measures.forEach((measure) => measure.chords.forEach((chord) => console.warn(chord.chordString)));
}

function repeatEverythingToEndRepeatLocation() {
  if (!endRepeatLocation) {
    endRepeatLocation = measures.length;
  }
  measures.push(...measures.slice(startRepeatLocation || undefined, endRepeatLocation));
  createNewMeasure();
}

function repeatRemainingEndings() {
  if (thirdEndingImminent) {
    repeatEverythingToEndRepeatLocation();
    thirdEndingImminent = false;
  }
  if (dcAlFineImminent) {
    measures.push(...measures.slice(0, fineLocation  || undefined));
    dcAlFineImminent = false;
  }
  if (dcAlCodaImminent) {
    measures.push(...measures.slice(0, codaLocation  || undefined));
    dcAlCodaImminent = false;
  }
  if (dsAlCodaImminent) {
    measures.push(...measures.slice(segnoLocation  || undefined, codaLocation  || undefined));
    dsAlCodaImminent = false;
  }
}

function pushChordInMeasures(match: RegExpMatchArray) {
  if (measures.length === 0) measures.push({ chords: [], timeSignature: timeSignature });

  let chord = match[0];

  const durationSplitChord = chord.split(',');
  let duration;
  if (durationSplitChord[1] !== undefined) duration = 1;
  console.warn(durationSplitChord);

  let chordString = durationSplitChord[0];

  if (chordString.startsWith('W') && lastChord) {
    chordString = chordString.replace('W', lastChord)
  } else {
    lastChord = chordString.split('/')[0];
  }
  measures[measures.length - 1].chords.push({ chordString, beats: duration?.toString() })
}

function parse(inputString: string) {
  // loop through the rules until one of them applies to the beginning of the string
  // chop off the match and parse again

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];

    if (typeof rule.token === 'string' && inputString.startsWith(rule.token)) {
      if (rule.operation) rule.operation();
      if (rule.token === 'LZ') {
        console.warn(measures);
        console.log(measures.slice());
      }

      parse(inputString.substring(rule.token.length).trim());
      break;
    } else if (rule.token instanceof RegExp) {
      const match = inputString.match(rule.token);
      if (match && match.index === 0) {
        if (rule.matchOperation) rule.matchOperation(match);
        parse(inputString.substring(match[0].length).trim());
        break;
      }
    }
    if (i === rules.length - 1 && inputString.length > 1) {
      // we got to the last rule and no rule applied
      // trim off one character and parse again
      parse(inputString.substring(1));
    }
  }
}
function removeEmptyMeasures(measures: ParsedMeasure[]){
  return measures.filter(m => m.chords.length !== 0)
}

const rawToSong = (raw: string) => {
  resetVars();
  parse(raw);
  return { measures: removeEmptyMeasures(measures), timeSignature, raw };
}

export default rawToSong;

// Obfuscate...
// IN:  [T44C   |G   |C   |G   Z
// OUT: 1r34LbKcu7[T44CXyQ|GXyQ|CXyQ|GXyQZ
export const obfuscate = (string: string) => {
  string = string.replace(/   /g, 'XyQ'); // obfuscating substitution
  string = string.replace(/ \|/g, 'LZ'); // obfuscating substitution
  string = string.replace(/\| x/g, 'Kcl'); // obfuscating substitution
  string = hussle(string);	// hussle
  string = string.replace(/^/, '1r34LbKcu7'); // add magix prefix
  return string;
}

// Deobfuscate...
// IN:  1r34LbKcu7[T44CXyQ|GXyQ|CXyQ|GXyQZ
// OUT: [T44C   |G   |C   |G   Z
export const deobfuscate = (string: string) => {
  string = string.replace(/^1r34LbKcu7/g, ''); // remove magix prefix
  string = hussle(string);	// hussle
  string = string.replace(/XyQ/g, '   '); // obfuscating substitution
  string = string.replace(/LZ/g, ' |'); // obfuscating substitution
  string = string.replace(/Kcl/g, '| x'); // obfuscating substitution
  return string;
}

// Symmetric husseling.
const hussle = (string: string) => {
    let result = '';

    while (string.length > 50) {

      // Treat 50-byte segments.
      const segment =  string.substr(0, 50);
      string = string.slice(50);
      if ( string.length < 2 ) {
        result += segment;
        continue;
      }

      // Obfuscate a 50-byte segment.
      result += reverse(  segment.substr(5,5) ) +
         segment.substr(5,5) +
        reverse(  segment.substr(6,4) ) +
         segment.substr(4,2) +
        reverse(  segment.substr(0,4) ) +
         segment.substr(0,5) +
        reverse(  segment.substr(0,5) );
    }

    return result + string;
}

const reverse = (s: string): string => {
  return s.split("").reverse().join("");
}
