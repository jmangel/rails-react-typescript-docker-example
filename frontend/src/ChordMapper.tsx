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
  quality: string;
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
    name: 'mixolydian b6',
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
    name: 'locrian #6',
    relatedScale: {
      name: 'harmonic minor',
      startingDegree: 2,
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
    name: 'Alt dom bb7',
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
      name: 'diminshed',
      startingDegree: 2,
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

interface ChordMapping {
  quality: string;
  possibleModes: Array<{name: string, offset: number}>;
}
const CHORD_MAPPINGS = [
  {
    quality: '-',
    possibleModes: [
      {
        name: 'aeolian',
        offset: 0,
      },
      {
        name: 'dorian',
        offset: 0,
      }
    ]
  },
  {
    quality: '^',
    possibleModes: [
      {
        name: 'ionian',
        offset: 0,
      },
      {
        name: 'lydian #2',
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

const scalesForChord = (chordNote: string, chordQuality: string): Array<Array<string>> => {
  const chordNoteIndex = enharmonicNoteIndex(chordNote, CHROMATIC_NOTES)
  const rotatedChromaticNotes = arrayRotate(CHROMATIC_NOTES, chordNoteIndex)

  const namedNoteIndex = NAMED_NOTES.findIndex((note: string): boolean => chordNote.includes(note))
  const rotatedNamedNotes = arrayRotate(NAMED_NOTES, namedNoteIndex)

  const possibleModes = CHORD_MAPPINGS.find((chord: ChordMapping) => chord.quality == chordQuality)?.possibleModes || []

  return possibleModes.map((possibleMode: {name: string, offset: number}) => {
    const mode = MODES.find((mode: Mode) => mode.name == possibleMode.name);
    if (mode == undefined) return [];

    const primaryScale = PRIMARY_SCALES.find((scale: Scale) => scale.name == mode.relatedScale.name)
    if (primaryScale == undefined) return [];

    const startingDegree = mode.relatedScale.startingDegree

    const modeDegrees = arrayRotate(primaryScale.degrees, (startingDegree - 1))
    let startingSemitones: number | null = null;
    const modeIntervalsSemitones = modeDegrees.map((modeDegree) => {
      const semitones = INTERVALS.find((interval: Interval): boolean => {
        return interval.degree === modeDegree.degree && interval.quality === modeDegree.quality
      })?.semitones
      if (semitones == undefined) return 0;

      startingSemitones = startingSemitones == null ? semitones : startingSemitones;

      let modulodSemitones = (semitones - startingSemitones) % 12
      if (modulodSemitones < 0) modulodSemitones += 12;
      return modulodSemitones
    })

    startingSemitones = modeIntervalsSemitones[0]

    // const scaleNotes: Array<string> = []
    return rotatedNamedNotes.map((namedNote, index) => {
      const desiredSemitones = modeIntervalsSemitones[index]
      console.log('desiredSemitones')
      console.log(desiredSemitones)

      const enharmonicNote = rotatedChromaticNotes[desiredSemitones]

      console.log('enharmonicNote')
      console.log(enharmonicNote)

      return (enharmonicNote.find((noteName: string): boolean => noteName.includes(namedNote)))
    })
    // return scaleNotes;
  })
}

export default scalesForChord;