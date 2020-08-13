const CHROMATIC_NOTES = [
  ['A'],
  ['A#', 'Bb'],
  ['B'],
  ['C'],
  ['C#', 'Db'],
  ['D'],
  ['D#', 'Eb'],
  ['E'],
  ['F'],
  ['F#', 'Gb'],
  ['G'],
  ['G#', 'Ab'],
]

const NAMED_NOTES = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
]

const NOTE_SEMITONES = {
  'A': 2,
  'B': 2,
  'C': 1,
  'D': 2,
  'E': 2,
  'F': 1,
  'G': 2,
}

interface Interval {
  degree: number;
  quality: string;
  semitones: number;
}
const INTERVALS = [
  {
    degree: 1,
    quality: 'perfect',
    semitones: 0,
  },
  {
    degree: 2,
    quality: 'minor',
    semitones: 1,
  },
  {
    degree: 2,
    quality: 'major',
    semitones: 2,
  },
  {
    degree: 3,
    quality: 'minor',
    semitones: 3,
  },
  {
    degree: 3,
    quality: 'major',
    semitones: 4,
  },
  {
    degree: 4,
    quality: 'perfect',
    semitones: 5,
  },
  {
    degree: 4,
    quality: 'augmented',
    semitones: 6,
  },
  {
    degree: 5,
    quality: 'diminished',
    semitones: 6,
  },
  {
    degree: 5,
    quality: 'perfect',
    semitones: 7,
  },
  {
    degree: 5,
    quality: 'augmented',
    semitones: 8,
  },
  {
    degree: 6,
    quality: 'minor',
    semitones: 8,
  },
  {
    degree: 6,
    quality: 'major',
    semitones: 9,
  },
  {
    degree: 7,
    quality: 'diminished',
    semitones: 9,
  },
  {
    degree: 7,
    quality: 'minor',
    semitones: 10,
  },
  {
    degree: 7,
    quality: 'major',
    semitones: 11,
  },
]

interface ScaleDegree {
  degree: number;
  quality: string | null;
}
interface Scale {
  name: string;
  degrees: Array<ScaleDegree>;
}
const PRIMARY_SCALES = [

  {
    name: 'major',
    degrees: [
      {
        degree: 1,
        quality: 'perfect',
      },
      {
        degree: 2,
        quality: 'major',
      },
      {
        degree: 3,
        quality: 'major',
      },
      {
        degree: 4,
        quality: 'perfect',
      },
      {
        degree: 5,
        quality: 'perfect',
      },
      {
        degree: 6,
        quality: 'major',
      },
      {
        degree: 7,
        quality: 'major',
      },
    ],
  },
  {
    name: 'melodic minor',
    degrees: [
      {
        degree: 1,
        quality: 'perfect',
      },
      {
        degree: 2,
        quality: 'major',
      },
      {
        degree: 3,
        quality: 'minor',
      },
      {
        degree: 4,
        quality: 'perfect',
      },
      {
        degree: 5,
        quality: 'perfect',
      },
      {
        degree: 6,
        quality: 'major',
      },
      {
        degree: 7,
        quality: 'major',
      },
    ],
  },
  {
    name: 'harmonic minor',
    degrees: [
      {
        degree: 1,
        quality: 'perfect',
      },
      {
        degree: 2,
        quality: 'major',
      },
      {
        degree: 3,
        quality: 'minor',
      },
      {
        degree: 4,
        quality: 'perfect',
      },
      {
        degree: 5,
        quality: 'perfect',
      },
      {
        degree: 6,
        quality: 'minor',
      },
      {
        degree: 7,
        quality: 'major',
      },
    ],
  },
  {
    name: 'diminished',
    degrees: [
      {
        degree: 1,
        quality: 'perfect',
      },
      {
        degree: 2,
        quality: 'major',
      },
      {
        degree: 3,
        quality: 'minor',
      },
      {
        degree: 4,
        quality: 'perfect',
      },
      {
        degree: 5,
        quality: 'diminished',
      },
      {
        degree: 6,
        quality: 'minor',
      },
      {
        degree: 7,
        quality: 'diminished',
      },
      {
        degree: 7,
        quality: 'major',
      },
    ],
  },
  {
    name: 'whole-tone',
    degrees: [
      {
        degree: 1,
        quality: 'perfect',
      },
      {
        degree: 2,
        quality: 'major',
      },
      {
        degree: 3,
        quality: 'major',
      },
      {
        degree: 4,
        quality: 'augmented',
      },
      {
        degree: 5,
        quality: 'augmented',
      },
      {
        degree: 6,
        quality: null,
      },
      {
        degree: 7,
        quality: 'minor',
      },
    ],
  },
]

interface Mode {
  name: string;
  relatedScale: {
    name: string;
    startingDegree: number;
  };
}
const MODES = [
  {
    name: 'ionian',
    relatedScale: {
      name: 'major',
      startingDegree: 1,
    },
  },
  {
    name: 'dorian',
    relatedScale: {
      name: 'major',
      startingDegree: 2,
    },
  },
  {
    name: 'phrygian',
    relatedScale: {
      name: 'major',
      startingDegree: 3,
    },
  },
  {
    name: 'lydian',
    relatedScale: {
      name: 'major',
      startingDegree: 4,
    },
  },
  {
    name: 'mixolydian',
    relatedScale: {
      name: 'major',
      startingDegree: 5,
    },
  },
  {
    name: 'aeolian',
    relatedScale: {
      name: 'major',
      startingDegree: 6,
    },
  },
  {
    name: 'locrian',
    relatedScale: {
      name: 'major',
      startingDegree: 7,
    },
  },
  {
    name: 'melodic minor',
    relatedScale: {
      name: 'melodic minor',
      startingDegree: 1,
    },
  },
  {
    name: 'dorian b9',
    relatedScale: {
      name: 'melodic minor',
      startingDegree: 2,
    },
  },
  {
    name: 'lydian augmented',
    relatedScale: {
      name: 'melodic minor',
      startingDegree: 3,
    },
  },
  {
    name: 'lydian dominant',
    relatedScale: {
      name: 'melodic minor',
      startingDegree: 4,
    },
  },
  {
    name: 'mixolydian b13',
    relatedScale: {
      name: 'melodic minor',
      startingDegree: 5,
    },
  },
  {
    name: 'locrian 2/half-dim',
    relatedScale: {
      name: 'melodic minor',
      startingDegree: 6,
    },
  },
  {
    name: 'altered',
    relatedScale: {
      name: 'melodic minor',
      startingDegree: 7,
    },
  },
  {
    name: 'harmonic minor',
    relatedScale: {
      name: 'harmonic minor',
      startingDegree: 1,
    },
  },
  {
    name: 'locrian #6',
    relatedScale: {
      name: 'harmonic minor',
      startingDegree: 2,
    },
  },
  {
    name: 'major #5',
    relatedScale: {
      name: 'harmonic minor',
      startingDegree: 3,
    },
  },
  {
    name: 'dorian #4',
    relatedScale: {
      name: 'harmonic minor',
      startingDegree: 4,
    },
  },
  {
    name: 'phrygian dominant',
    relatedScale: {
      name: 'harmonic minor',
      startingDegree: 5,
    },
  },
  {
    name: 'lydian #2',
    relatedScale: {
      name: 'harmonic minor',
      startingDegree: 6,
    },
  },
  {
    name: 'alt dom bb7',
    relatedScale: {
      name: 'harmonic minor',
      startingDegree: 7,
    },
  },
  {
    name: 'w/h diminished',
    relatedScale: {
      name: 'diminished',
      startingDegree: 1,
    },
  },
  {
    name: 'h/w diminished',
    relatedScale: {
      name: 'diminished',
      startingDegree: 6,
    },
  },
  {
    name: 'whole-tone',
    relatedScale: {
      name: 'whole-tone',
      startingDegree: 1,
    },
  },
]

interface RelativeMode {
  name: string;
  offset: number;
  notes?: Array<string>;
}
interface ChordMapping {
  quality: string;
  possibleModes: Array<RelativeMode>;
}
const MINOR_MODES = [
  {
    name: 'aeolian',
    offset: 0,
  },
  {
    name: 'dorian',
    offset: 0,
  },
  {
    name: 'phrygian',
    offset: 0,
  },
  {
    name: 'dorian #4',
    offset: 0,
  },
];
const MAJOR_MODES = [
  {
    name: 'ionian',
    offset: 0,
  },
  {
    name: 'lydian',
    offset: 0,
  },
  {
    name: 'lydian #2',
    offset: 0,
  },
]
const MINOR_MAJOR_MODES = [
  {
    name: 'melodic minor',
    offset: 0,
  },
  {
    name: 'harmonic minor',
    offset: 0,
  },
]
const AUGMENTED_MODES: Array<RelativeMode> = [
  {
    name: 'whole-tone',
    offset: 0,
  },
  {
    name: 'altered',
    offset: 0,
    notes: [
      'musicians often prefer to substitute alt chord',
    ]
  },
]
const HALF_DIMINISHED_MODES: Array<RelativeMode> = [
  {
    name: 'locrian',
    offset: 0,
  },
  {
    name: 'locrian 2/half-dim',
    offset: 0,
  },
  {
    name: 'locrian #6',
    offset: 0,
  },
]
const CHORD_MAPPINGS = [
  {
    quality: '-',
    possibleModes: MINOR_MODES
  },
  {
    quality: '-7',
    possibleModes: MINOR_MODES
  },
  {
    quality: '-11',
    possibleModes: MINOR_MODES.filter(({ name }) => name !== 'dorian #4')
  },
  {
    quality: '^',
    possibleModes: MAJOR_MODES,
  },
  {
    quality: '',
    possibleModes: MAJOR_MODES,
  },
  {
    quality: '7',
    possibleModes: [
      {
        name: 'mixolydian',
        offset: 0,
      },
      {
        name: 'phrygian dominant',
        offset: 0,
      },
    ]
  },
  {
    quality: 'sus',
    possibleModes: [
      {
        name: 'mixolydian',
        offset: 0,
      },
    ]
  },
  {
    quality: 'susb9',
    possibleModes: [
      {
        name: 'phrygian',
        offset: 0,
      },
      {
        name: 'dorian b9',
        offset: 0,
      },
    ]
  },
  {
    quality: 'h7',
    possibleModes: HALF_DIMINISHED_MODES
  },
  {
    quality: '-7b5',
    possibleModes: HALF_DIMINISHED_MODES
  },
  {
    quality: '-^7',
    possibleModes: MINOR_MAJOR_MODES
  },
  {
    quality: '-^',
    possibleModes: MINOR_MAJOR_MODES
  },
  {
    quality: '^#5',
    possibleModes: [
      {
        name: 'lydian augmented',
        offset: 0,
      },
      {
        name: 'major #5',
        offset: 0,
      }
    ]
  },
  {
    quality: '7#11',
    possibleModes: [
      {
        name: 'lydian dominant',
        offset: 0,
      },
    ]
  },
  {
    quality: '7b9',
    possibleModes: [
      {
        name: 'phrygian dominant',
        offset: 0,
      },
      {
        name: 'h/w diminished',
        offset: 0,
      }
    ]
  },
  {
    quality: '7b13',
    possibleModes: [
      {
        name: 'mixolydian b13',
        offset: 0,
      },
      ...AUGMENTED_MODES.map((possibleMode) => {
        return {
          ...possibleMode,
          notes: (possibleMode.notes || [])
            .concat(
              '7b13 sometimes dangerously used to notate a 7#5'
            ),
        }
      }),
    ]
  },
  {
    quality: '7#5',
    possibleModes: AUGMENTED_MODES
  },
  {
    quality: 'o',
    possibleModes: [
      {
        name: 'w/h diminished',
        offset: 0,
      },
      {
        name: 'alt dom bb7',
        offset: 0,
      }
    ]
  },
  {
    quality: '7alt',
    possibleModes: [
      {
        name: 'altered',
        offset: 0,
      },
    ]
  },
]

const arrayRotate = (arr: Array<any>, index: number): Array<any> => {
  const emptyArray: Array<any> = [];
  const clone = emptyArray.concat(arr)

  for (let i = 0; i < index; i++) {
    const firstElement = clone.shift();
    if (firstElement) clone.push(firstElement);
  }
  return clone;
}

const enharmonicNoteIndex = (note: string, enharmonicNotes: Array<Array<string>>): number => {
  return enharmonicNotes.findIndex((enharmonics: Array<string>): boolean => enharmonics.includes(note));
}

export interface NamedScale {
  scaleName: string;
  scaleNotes: Array<string>;
  rootScale: string;
  rootScaleNote: string;
  notes: Array<string>;
}
const scalesForChord = (chordNote: string, chordQuality: string): Array<NamedScale> => {
  const namedNoteIndex = NAMED_NOTES.findIndex((note: string): boolean => chordNote.includes(note))
  const rotatedNamedNotes = arrayRotate(NAMED_NOTES, namedNoteIndex)

  const possibleModes = CHORD_MAPPINGS.find((chord: ChordMapping) => chord.quality == chordQuality)?.possibleModes || []

  return possibleModes.map((possibleMode: RelativeMode): NamedScale => {
    const mode = MODES.find((mode: Mode) => mode.name == possibleMode.name);
    if (mode == undefined) throw new Error(`primaryScale not found ${possibleMode.name}`);

    const primaryScale = PRIMARY_SCALES.find((scale: Scale) => scale.name == mode.relatedScale.name)
    if (primaryScale == undefined) throw new Error(`primaryScale not found ${mode.relatedScale.name}`);

    const startingDegree = mode.relatedScale.startingDegree

    // does not need to support whole-tone because it has only one mode
    // TODO: support diminished for breaking starting degrees?
    // currently doesn't "need" to support diminished because it has no
    // breaking modes
    const rootDegreeFinderArray: Array<number> = [...Array(primaryScale.degrees.length).keys()].map((i) => i + 1)
    rootDegreeFinderArray.push(rootDegreeFinderArray.shift() as number)
    rootDegreeFinderArray.reverse()
    const rootDegree = rootDegreeFinderArray[startingDegree - 1]

    const modeDegrees = arrayRotate(primaryScale.degrees, (startingDegree - 1))
    let startingSemitones: number | null = null;
    const modeIntervalsSemitones = modeDegrees.map((modeDegree) => {
      if (modeDegree.quality === null) return null;

      const semitones = INTERVALS.find((interval: Interval): boolean => {
        return interval.degree === modeDegree.degree && interval.quality === modeDegree.quality
      })?.semitones
      if (semitones == undefined) throw new Error(`semitones not found ${modeDegree.degree}${modeDegree.quality}`);

      startingSemitones = startingSemitones == null ? semitones : startingSemitones;

      let modulodSemitones = (semitones - startingSemitones) % 12
      if (modulodSemitones < 0) modulodSemitones += 12;
      return modulodSemitones
    })

    startingSemitones = modeIntervalsSemitones[0]

    let previousSharps = 0
    let cumulativeSemitones = 0

    let index = 0
    let scaleNotes: Array<string> = []
    rotatedNamedNotes.forEach((namedNote: 'A'|'B'|'C'|'D'|'E'|'F'|'G') => {
      if (index == 0) {
        previousSharps = (chordNote.split('#').length - chordNote.split('b').length)

        index += 1;
        scaleNotes.push(chordNote)
        return
      }

      let naturalSemitones = NOTE_SEMITONES[namedNote];

      const modeDegree = modeDegrees[index]
      const modeDegreeNotes = modeDegrees.filter((extraModeDegree) => extraModeDegree.degree === modeDegree.degree)
      modeDegreeNotes.forEach(() => {
        const desiredSemitones = modeIntervalsSemitones[index]
        if (desiredSemitones === null) {
          cumulativeSemitones += naturalSemitones
          return index += 1;
        }

        previousSharps = previousSharps + (desiredSemitones - (cumulativeSemitones + naturalSemitones))
        cumulativeSemitones = desiredSemitones

        // naturalSemitones is meant to capture the difference from the
        // previous degree; if naturalSemitones is used again in this scope,
        // it will be because we are on another quality of the same degree,
        // so the difference is 0
        naturalSemitones = 0

        let accidental: string = (previousSharps < 0) ? 'b' : '#'
        let accidentals: number = Math.abs(previousSharps)

        index += 1;
        scaleNotes.push(namedNote + accidental.repeat(accidentals))
      })
    })

    return {
      scaleName: possibleMode.name,
      scaleNotes,
      rootScale: mode.relatedScale.name,
      rootScaleNote: scaleNotes[rootDegree - 1],
      notes: possibleMode.notes || [],
    }
  })
}

export default scalesForChord;