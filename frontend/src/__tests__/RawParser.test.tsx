import rawToSong, { obfuscate, deobfuscate } from '../RawParser'

describe('obfuscate', () => {
  it('obfuscates', () => {
    const input = '[T44C   |G   |C   |G   Z';
    const output = '1r34LbKcu7[T44CXyQ|GXyQ|CXyQ|GXyQZ';

    expect(obfuscate(input)).toEqual(output);
  })
});

describe('deobfuscate', () => {
  it('deobfuscates', () => {
    const input = '1r34LbKcu7[T44CXyQ|GXyQ|CXyQ|GXyQZ';
    const output = '[T44C   |G   |C   |G   Z';

    expect(deobfuscate(input)).toEqual(output);
  })

  it('deobfuscates more', () => {
    const input = '1r34LbKcu7QyXZL4C, EQyX|D,C|,E ,DB[*  ,C|,B,A,GZL,LZXyQ3TA*{ZLQyXLZXyQZLQyXZLQyXZLQyZXLQyXA*[] QyXZLXyQLZQyXZLXyQLZXyQ Z';
    const output = "{*AT34C, E, |G,A,B,|C,  [*BD, E,|C,D|    |    |    |    |    |    ][*A    |    |    |    |    |    |    |    Z";
    expect(deobfuscate(input)).toEqual(output);
  })
});

describe('rawToSong', () => {
  it('parses raw', () => {
    const input = '[T44C   |G   |C   |G   Z';
    const output = rawToSong(input);

    const outputChords = output.measures.map((measure) => measure.chords);
    const expectedChords = [
      [{
        beats: '4',
        chordString: 'C'
      }],
      [{
        beats: '4',
        chordString: 'G'
      }],
      [{
        beats: '4',
        chordString: 'C'
      }],
      [{
        beats: '4',
        chordString: 'G'
      }],
    ]

    expect(outputChords).toEqual(expectedChords);
  })

  it('counts spaces after the coda', () => {
    const input = '[*iBb-7 Eb7,Q Z';
    const output = rawToSong(input);

    const outputChords = output.measures.map((measure) => measure.chords);
    const expectedChords = [
      [
        {
          beats: '2',
          chordString: 'Bb-7'
        },
        {
          beats: '2',
          chordString: 'Eb7'
        }
      ],
    ]

    expect(outputChords).toEqual(expectedChords);
  })

  it('does not count spaces after the measure', () => {
    const input = '[*iC-7, Bb-7, |x   |Bb7b5,   |N1Bb-7, A7 }            |N2Bb-7, A7,D7,Z';
    const output = rawToSong(input);

    const outputChords = output.measures.map((measure) => measure.chords);
    const expectedRepitition = [
      [
        {
          beats: '2',
          chordString: 'C-7'
        },
        {
          beats: '2',
          chordString: 'Bb-7'
        },
      ],
      [
        {
          beats: '2',
          chordString: 'C-7'
        },
        {
          beats: '2',
          chordString: 'Bb-7'
        },
      ],
      [
        {
          beats: '4',
          chordString: 'Bb7b5'
        }
      ],
    ];
    const expectedChords = [
      ...expectedRepitition,
      [
        {
          beats: '2',
          chordString: 'Bb-7'
        },
        {
          beats: '2',
          chordString: 'A7'
        },
      ],
      ...expectedRepitition,
      [
        {
          beats: '2',
          chordString: 'Bb-7'
        },
        {
          beats: '1',
          chordString: 'A7'
        },
        {
          beats: '1',
          chordString: 'D7',
        },
      ],
    ]

    expect(outputChords).toEqual(expectedChords);
  })

  it('does not counts spaces after the end', () => {
    const input = '[*iAb^   Z ';
    const output = rawToSong(input);

    const outputChords = output.measures.map((measure) => measure.chords);
    const expectedChords = [
      [
        {
          beats: '4',
          chordString: 'Ab^'
        },
      ],
    ]

    expect(outputChords).toEqual(expectedChords);
  })
});