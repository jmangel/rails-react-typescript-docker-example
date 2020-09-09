const chordParserRegex = /(^[A-G]+[b|#]*)([^/]*)(\/?[A-G]+[b|#]*)?$/gm;

const parseChordString = (chordString: string): [string, string, string] => {
  let match;
  let chordNote = '';
  let chordQuality = '';
  let bassNote = '';

  while ((match = chordParserRegex.exec(chordString)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (match.index === chordParserRegex.lastIndex) {
      chordParserRegex.lastIndex++;
    }

    // The result can be accessed through the `match`-variable.
    chordNote = match[1] || '';
    chordQuality = match[2] || '';

    bassNote = match[3] || '';
  }

  if (!chordNote) chordQuality = chordString;
  return [chordNote, chordQuality, bassNote];
}

export default parseChordString