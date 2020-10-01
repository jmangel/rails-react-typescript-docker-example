import scalesForChord, { NamedScale, countSemitonesBetween } from '../ChordMapper'

it('gets double sharp', () => {
  expect(
    scalesForChord('E', '^')[2].scaleNotes
  ).toEqual([
    'E', 'F##', 'G#', 'A#', 'B', 'C#', 'D#'
  ])
});

describe('rootScale', () => {
  it('returns major for major modes', () => {
    const majorScales = scalesForChord('A', '^')
    const minorScales = scalesForChord('A', '-')

    const ionianScale = majorScales[0]

    const aeolianScale = minorScales[0]
    const dorianScale = minorScales[1]

    expect(ionianScale.rootScale).toEqual('major')
    expect(aeolianScale.rootScale).toEqual('major')
    expect(dorianScale.rootScale).toEqual('major')
  })

  it('returns melodic minor for melodic minor modes', () => {
    const dominantFlatNineScales = scalesForChord('A', '7alt')

    const alteredScale = dominantFlatNineScales[0]
    expect(alteredScale.rootScale).toEqual('melodic minor')
  })

  it('returns harmonic minor for harmonic minor modes', () => {
    const majorScales = scalesForChord('A', '^')
    const dominantFlatNineScales = scalesForChord('A', '7b9')

    const lydianSharpTwoScale = majorScales[2]
    expect(lydianSharpTwoScale.rootScale).toEqual('harmonic minor')

    const phrygianDominantScale = dominantFlatNineScales[0]
    expect(phrygianDominantScale.rootScale).toEqual('harmonic minor')
  })

  it('returns diminished for diminished modes', () => {
    const dominantFlatNineScales = scalesForChord('A', '7b9')

    const halfWholeDiminishedScale = dominantFlatNineScales[1]
    expect(halfWholeDiminishedScale.rootScale).toEqual('diminished')
  })
})

describe('rootScaleNote', () => {
  it('returns first for major modes', () => {
    expect(scalesForChord('C', '^')[0].rootScaleNote).toEqual('C')
    expect(scalesForChord('F#', '^')[0].rootScaleNote).toEqual('F#')
    expect(scalesForChord('Db', '^')[0].rootScaleNote).toEqual('Db')
  })

  it('returns seventh for dorian modes', () => {
    expect(scalesForChord('D', '-')[1].rootScaleNote).toEqual('C')
    expect(scalesForChord('G#', '-')[1].rootScaleNote).toEqual('F#')
    expect(scalesForChord('Eb', '-')[1].rootScaleNote).toEqual('Db')
  })

  it('returns third for aeolian modes', () => {
    expect(scalesForChord('A', '-')[0].rootScaleNote).toEqual('C')
    expect(scalesForChord('D#', '-')[0].rootScaleNote).toEqual('F#')
    expect(scalesForChord('Bb', '-')[0].rootScaleNote).toEqual('Db')
  })

  it('returns third for lydian #2 modes', () => {
    expect(scalesForChord('Ab', '^')[2].rootScaleNote).toEqual('C')
    expect(scalesForChord('D', '^')[2].rootScaleNote).toEqual('F#')
    expect(scalesForChord('Bbb', '^')[2].rootScaleNote).toEqual('Db')
  })

  it('returns second for 7b9 chords', () => {
    expect(scalesForChord('G', '7b9')[1].rootScaleNote).toEqual('B')
  })

  it('returns first for whole-tone modes', () => {
    expect(scalesForChord('G', '7#5')[0].rootScaleNote).toEqual('G')
  })
})

describe('chords', () => {
  describe('major chords', () => {
    let majorQualities: Array<string>;

    beforeEach(() => {
      majorQualities = ['', '^', '^7']
    })

    it('gives ionian', () => {
      majorQualities.forEach((quality) => {
        const majorScale = scalesForChord('C', quality)[0]

        expect(majorScale.scaleName).toEqual('ionian')
        expect(majorScale.scaleNotes).toEqual([
          'C','D','E','F','G','A','B'
        ])
      })
    })

    it('gives lydian', () => {
      majorQualities.forEach((quality) => {
        const phrygianDominantScale = scalesForChord('F', quality)[1]

        expect(phrygianDominantScale.scaleName).toEqual('lydian')
        expect(phrygianDominantScale.scaleNotes).toEqual([
          'F','G','A','B','C','D','E'
        ])
      })
    })

    it('gives lydian #2', () => {
      majorQualities.forEach((quality) => {
        const phrygianDominantScale = scalesForChord('F', quality)[2]

        expect(phrygianDominantScale.scaleName).toEqual('lydian #2')
        expect(phrygianDominantScale.scaleNotes).toEqual([
          'F','G#','A','B','C','D','E'
        ])
      })
    })

    // TODO: lydian b6?
  });

  describe('minor', () => {
    let minorScales: Array<NamedScale>;

    beforeEach(() => {
      minorScales = scalesForChord('A', '-')
    })

    it('aeolian', () => {
      const aeolianScale = minorScales[0]

      expect(aeolianScale.scaleName).toEqual('aeolian')
      expect(aeolianScale.scaleNotes).toEqual([
        'A','B','C','D','E','F','G'
      ])
    });

    it('dorian', () => {
      const dorianScale = minorScales[1]

      expect(dorianScale.scaleName).toEqual('dorian')
      expect(dorianScale.scaleNotes).toEqual([
        'A','B','C','D','E','F#','G'
      ])
    });

    it('phrygian', () => {
      const phrygianScale = minorScales[2]

      expect(phrygianScale.scaleName).toEqual('phrygian')
      expect(phrygianScale.scaleNotes).toEqual([
        'A','Bb','C','D','E','F','G'
      ])
    });

    it('dorian #4', () => {
      const dorianSharpFourScale = minorScales[3]

      expect(dorianSharpFourScale.scaleName).toEqual('dorian #4')
      expect(dorianSharpFourScale.scaleNotes).toEqual([
        'A','B','C','D#','E','F#','G'
      ])
    });
  });

  describe('7 chord', () => {
    let dominantScales: Array<NamedScale>;

    beforeEach(() => {
      dominantScales = scalesForChord('G', '7')
    })

    it('gives mixolydian', () => {
      const halfWholeDiminishedScale = dominantScales[0]

      expect(halfWholeDiminishedScale.scaleName).toEqual('mixolydian')
      expect(halfWholeDiminishedScale.scaleNotes).toEqual([
        'G','A','B','C','D','E','F'
      ])
    })

    it('gives phrygian dominant', () => {
      const phrygianDominantScale = dominantScales[1]

      expect(phrygianDominantScale.scaleName).toEqual('phrygian dominant')
      expect(phrygianDominantScale.scaleNotes).toEqual([
        'G','Ab','B','C','D','Eb','F',
      ])
    })
  })

  describe('sus chord', () => {
    it('gives mixolydian', () => {
      const halfWholeDiminishedScale = scalesForChord('G', 'sus')[0]

      expect(halfWholeDiminishedScale.scaleName).toEqual('mixolydian')
      expect(halfWholeDiminishedScale.scaleNotes).toEqual([
        'G','A','B','C','D','E','F'
      ])
    })
  })

  describe('susb9 chord', () => {
    it('gives phrygian', () => {
      const phrygianScale = scalesForChord('E', 'susb9')[0]

      expect(phrygianScale.scaleName).toEqual('phrygian')
      expect(phrygianScale.scaleNotes).toEqual([
        'E','F','G','A','B','C','D'
      ])
    })

    it('gives dorian b9', () => {
      const dorianFlatNineScale = scalesForChord('D', 'susb9')[1]

      expect(dorianFlatNineScale.scaleName).toEqual('dorian b9')
      expect(dorianFlatNineScale.scaleNotes).toEqual([
        'D','Eb','F','G','A','B','C'
      ])
    })
  })

  describe('half diminished chords', () => {
    let halfDiminishedChordsScales: Array<Array<NamedScale>>;

    beforeEach(() => {
      halfDiminishedChordsScales = [
        scalesForChord('B', 'h7'),
        scalesForChord('B', '-7b5'),
      ]
    })

    it('gives locrian', () => {
      halfDiminishedChordsScales.forEach((chordScales) => {
        const locrianScale = chordScales[0]

        expect(locrianScale.scaleName).toEqual('locrian')
        expect(locrianScale.scaleNotes).toEqual([
          'B','C','D','E','F','G','A'
        ])
      })
    })

    it('gives locrian 2/half-dim', () => {
      halfDiminishedChordsScales.forEach((chordScales) => {
        const locrianTwoScale = chordScales[1]

        expect(locrianTwoScale.scaleName).toEqual('locrian 2/half-dim')
        expect(locrianTwoScale.scaleNotes).toEqual([
          'B','C#','D','E','F','G','A'
        ])
      })
    })

    it('gives locrian #6', () => {
      halfDiminishedChordsScales.forEach((chordScales) => {
        const locrianNaturalSixScale = chordScales[2]

        expect(locrianNaturalSixScale.scaleName).toEqual('locrian #6')
        expect(locrianNaturalSixScale.scaleNotes).toEqual([
          'B','C','D','E','F','G#','A'
        ])
      })
    })
  })

  describe('7b9 chord', () => {
    let dominantFlatNineScales: Array<NamedScale>;

    beforeEach(() => {
      dominantFlatNineScales = scalesForChord('G', '7b9')
    })

    it('gives phrygian dominant', () => {
      const phrygianDominantScale = dominantFlatNineScales[0]

      expect(phrygianDominantScale.scaleName).toEqual('phrygian dominant')
      expect(phrygianDominantScale.scaleNotes).toEqual([
        'G','Ab','B','C','D','Eb','F',
      ])
    })

    it('gives h/w diminished', () => {
      const halfWholeDiminishedScale = dominantFlatNineScales[1]

      expect(halfWholeDiminishedScale.scaleName).toEqual('h/w diminished')
      expect(halfWholeDiminishedScale.scaleNotes).toEqual([
        'G','Ab','A#','B','C#','D','E','F'
      ])
    })
  })

  describe('7b13 chord', () => {
    let dominantFlatThirteenScales: Array<NamedScale>;

    beforeEach(() => {
      dominantFlatThirteenScales = scalesForChord('G', '7b13')
    })

    it('gives mixolydian b13', () => {
      const phrygianDominantScale = dominantFlatThirteenScales[0]

      expect(phrygianDominantScale.scaleName).toEqual('mixolydian b13')
      expect(phrygianDominantScale.scaleNotes).toEqual([
        'G','A','B','C','D','Eb','F',
      ])
    })

    it('gives whole-tone with note', () => {
      const wholeToneScale = dominantFlatThirteenScales[1]

      expect(wholeToneScale.scaleName).toEqual('whole-tone')
      expect(wholeToneScale.scaleNotes).toEqual([
        'G','A','B','C#','D#','F',
      ])

      expect(wholeToneScale.notes).toEqual([
        '7b13 sometimes dangerously used to notate a 7#5',
      ])
    })

    it('gives altered with notes', () => {
      const alteredScale = dominantFlatThirteenScales[2]

      expect(alteredScale.scaleName).toEqual('altered')
      expect(alteredScale.scaleNotes).toEqual([
        'G','Ab','Bb','Cb','Db','Eb','F'
      ])

      expect(alteredScale.notes).toEqual([
        'musicians often prefer to substitute alt chord',
        '7b13 sometimes dangerously used to notate a 7#5',
      ])
    })
  })

  describe('diminished chord', () => {
    let diminishedScales: Array<NamedScale>;

    beforeEach(() => {
      diminishedScales = scalesForChord('G', 'o')
    })

    it('gives w/h diminished', () => {
      const phrygianDominantScale = diminishedScales[0]

      expect(phrygianDominantScale.scaleName).toEqual('w/h diminished')
      expect(phrygianDominantScale.scaleNotes).toEqual([
        'G','A','Bb','C','Db','Eb','Fb','F#',
      ])
    })

    it('gives alt dom bb7', () => {
      const alteredDominantFlatFlatSevenScale = diminishedScales[1]

      expect(alteredDominantFlatFlatSevenScale.scaleName).toEqual('alt dom bb7')
      expect(alteredDominantFlatFlatSevenScale.scaleNotes).toEqual([
        'G','Ab','Bb','Cb','Db','Eb','Fb',
      ])
    })
  })

  describe('7#5 chord', () => {
    let dominantAugmentedScales: Array<NamedScale>;

    beforeEach(() => {
      dominantAugmentedScales = scalesForChord('G', '7#5')
    })

    it('gives whole-tone', () => {
      const wholeToneScale = dominantAugmentedScales[0]

      expect(wholeToneScale.scaleName).toEqual('whole-tone')
      expect(wholeToneScale.scaleNotes).toEqual([
        'G','A','B','C#','D#','F',
      ])
    })

    it('gives altered with note', () => {
      const alteredScale = dominantAugmentedScales[1]

      expect(alteredScale.scaleName).toEqual('altered')
      expect(alteredScale.scaleNotes).toEqual([
        'G','Ab','Bb','Cb','Db','Eb','F',
      ])

      expect(alteredScale.notes).toEqual([
        'musicians often prefer to substitute alt chord',
      ])
    })
  })

  describe('minor major chord', () => {
    let minorMajorChordScales: Array<Array<NamedScale>>;

    beforeEach(() => {
      minorMajorChordScales = [
        scalesForChord('C', '-^'),
        scalesForChord('C', '-^7'),
      ]
    })

    it('gives melodic minor', () => {
      minorMajorChordScales.forEach((chordScales) => {
        const melodicMinorScale = chordScales[0]

        expect(melodicMinorScale.scaleName).toEqual('melodic minor')
        expect(melodicMinorScale.scaleNotes).toEqual([
          'C','D','Eb','F','G','A','B',
        ])
      })
    })

    it('gives harmonic minor', () => {
      minorMajorChordScales.forEach((chordScales) => {
        const harmonicMinorScale = chordScales[1]

        expect(harmonicMinorScale.scaleName).toEqual('harmonic minor')
        expect(harmonicMinorScale.scaleNotes).toEqual([
          'C','D','Eb','F','G','Ab','B',
        ])
      })
    })
  })

  describe('major #5 chords', () => {
    let majorSharpFiveScales: Array<NamedScale>;
    let majorSevenSharpFiveScales: Array<NamedScale>;

    beforeEach(() => {
      majorSharpFiveScales = scalesForChord('Eb', '^#5')
      majorSevenSharpFiveScales = scalesForChord('Eb', '^7#5')
    })

    it('gives lydian augmented', () => {
      [majorSharpFiveScales, majorSevenSharpFiveScales].forEach((scales) => {
        const wholeToneScale = scales[0]

        expect(wholeToneScale.scaleName).toEqual('lydian augmented')
        expect(wholeToneScale.scaleNotes).toEqual([
          'Eb','F','G','A','B','C','D'
        ])
      })
    })

    it('gives major #5', () => {
      [majorSharpFiveScales, majorSevenSharpFiveScales].forEach((scales) => {
        const majorSharpFiveScale = scales[1]

        expect(majorSharpFiveScale.scaleName).toEqual('major #5')
        expect(majorSharpFiveScale.scaleNotes).toEqual([
          'Eb','F','G','Ab','B','C','D'
        ])
      })
    })
  })

  describe('^7#11 chord', () => {
    it('gives lydian', () => {
      const lydianScale = scalesForChord('F', '^7#11')[0]

      expect(lydianScale.scaleName).toEqual('lydian')
      expect(lydianScale.scaleNotes).toEqual([
        'F','G','A','B','C','D','E'
      ])
    })
  })

  describe('7#11 chord', () => {
    it('gives lydian dominant', () => {
      const lydianDominantScale = scalesForChord('F', '7#11')[0]

      expect(lydianDominantScale.scaleName).toEqual('lydian dominant')
      expect(lydianDominantScale.scaleNotes).toEqual([
        'F','G','A','B','C','D','Eb'
      ])
    })
  })

  describe('7alt', () => {
    it('gives altered', () => {
      const alteredScale = scalesForChord('G', '7alt')[0]

      expect(alteredScale.scaleName).toEqual('altered')
      expect(alteredScale.scaleNotes).toEqual([
        'G','Ab','Bb','Cb','Db','Eb','F',
      ])
    })
  })
})

describe('bassNote', () => {
  describe("exclude scales that don't include bassNote", () => {
    it('-7/6 excludes aeolian, phrygian', () => {
      const minorScales: Array<NamedScale> = scalesForChord('A', '-', 'F#')

      expect(minorScales.length).toEqual(4);

      const dorianScale = minorScales[0]

      expect(dorianScale.scaleName).toEqual('dorian')
      expect(dorianScale.scaleNotes).toEqual([
        'A','B','C','D','E','F#','G'
      ])

      const dorianSharpFourScale = minorScales[2]

      expect(dorianSharpFourScale.scaleName).toEqual('dorian #4')
      expect(dorianSharpFourScale.scaleNotes).toEqual([
        'A','B','C','D#','E','F#','G'
      ])
    })

    describe('recognizes enharmonics as equal', () => {
      it('simple enharmonic', () => {
        expect(scalesForChord('A', '-', 'B#').length).toEqual(8);
      });

      it('gets double sharp', () => {
        expect(scalesForChord('A', '-', 'D##').length).toEqual(8);
      });

      it('gets mixed accidentals', () => {
        expect(scalesForChord('B', '^','Bb').length).toEqual(6);
      })
    })
  })

  describe("includes enharmonic scales based on bassNote", () => {
    it('-7/6 includes locrian and locrian #6 for bass note', () => {
      const minorScales: Array<NamedScale> = scalesForChord('A', '-', 'F#')

      expect(minorScales.length).toEqual(4);

      const dorianScale = minorScales[1]

      expect(dorianScale.scaleName).toEqual('locrian')
      expect(dorianScale.scaleNotes).toEqual([
        'F#','G','A','B','C','D','E'
      ])

      const dorianSharpFourScale = minorScales[3]

      expect(dorianSharpFourScale.scaleName).toEqual('locrian #6')
      expect(dorianSharpFourScale.scaleNotes).toEqual([
        'F#','G','A','B','C','D#','E'
      ])
    })

    it('sus/7 includes lydian for bass note', () => {
      const susScales: Array<NamedScale> = scalesForChord('G', 'sus', 'F')

      expect(susScales.length).toEqual(2);

      const mixolydianScale = susScales[0]

      expect(mixolydianScale.scaleName).toEqual('mixolydian')
      expect(mixolydianScale.scaleNotes).toEqual([
        'G','A','B','C','D','E','F'
      ])

      const lydianScale = susScales[1]

      expect(lydianScale.scaleName).toEqual('lydian')
      expect(lydianScale.scaleNotes).toEqual([
        'F','G','A','B','C','D','E'
      ])
    })

    describe('enharmonics', () => {
      it('simple enharmonic', () => {
        const minorOverThirdScales = scalesForChord('A', '-', 'B#')

        expect(minorOverThirdScales.length).toEqual(8);

        const aeolianScale = minorOverThirdScales[0]
        expect(aeolianScale.scaleName).toEqual('aeolian')
        expect(aeolianScale.scaleNotes).toEqual([
          'A','B','C','D','E','F','G'
        ])

        const relativeMajorScale = minorOverThirdScales[1]
        expect(relativeMajorScale.scaleName).toEqual('ionian')
        expect(relativeMajorScale.scaleNotes).toEqual([
          'B#','C##','D##','E#','F##','G##','A##'
        ])

        const dorianScale = minorOverThirdScales[2]
        expect(dorianScale.scaleName).toEqual('dorian')
        expect(dorianScale.scaleNotes).toEqual([
          'A','B','C','D','E','F#','G'
        ])

        const relativeLydianScale = minorOverThirdScales[3]
        expect(relativeLydianScale.scaleName).toEqual('lydian')
        expect(relativeLydianScale.scaleNotes).toEqual([
          'B#','C##','D##','E##','F##','G##','A##'
        ])

        const phrygianScale = minorOverThirdScales[4]
        expect(phrygianScale.scaleName).toEqual('phrygian')
        expect(phrygianScale.scaleNotes).toEqual([
          'A','Bb','C','D','E','F','G'
        ])

        const relativeMixolydianScale = minorOverThirdScales[5]
        expect(relativeMixolydianScale.scaleName).toEqual('mixolydian')
        expect(relativeMixolydianScale.scaleNotes).toEqual([
          'B#','C##','D##','E#','F##','G##','A#'
        ])

        const dorianSharpFourScale = minorOverThirdScales[6]
        expect(dorianSharpFourScale.scaleName).toEqual('dorian #4')
        expect(dorianSharpFourScale.scaleNotes).toEqual([
          'A','B','C','D#','E','F#','G'
        ])

        const relativeLydianSharpTwoScale = minorOverThirdScales[7]
        expect(relativeLydianSharpTwoScale.scaleName).toEqual('lydian #2')
        expect(relativeLydianSharpTwoScale.scaleNotes).toEqual([
          'B#','C###','D##','E##','F##','G##','A##'
        ])
      });

      it('gets double sharp', () => {
        const minorOverEnharmonicFifthScales = scalesForChord('A', '-', 'D##')

        expect(minorOverEnharmonicFifthScales.length).toEqual(8);

        const aeolianScale = minorOverEnharmonicFifthScales[0]
        expect(aeolianScale.scaleName).toEqual('aeolian')
        expect(aeolianScale.scaleNotes).toEqual([
          'A','B','C','D','E','F','G'
        ])

        const relativePhrygianScale = minorOverEnharmonicFifthScales[1]
        expect(relativePhrygianScale.scaleName).toEqual('phrygian')
        expect(relativePhrygianScale.scaleNotes).toEqual([
          'D##','E#','F##','G##','A##','B#','C##'
        ])

        const dorianScale = minorOverEnharmonicFifthScales[2]
        expect(dorianScale.scaleName).toEqual('dorian')
        expect(dorianScale.scaleNotes).toEqual([
          'A','B','C','D','E','F#','G'
        ])

        const relativeAeolianScale = minorOverEnharmonicFifthScales[3]
        expect(relativeAeolianScale.scaleName).toEqual('aeolian')
        expect(relativeAeolianScale.scaleNotes).toEqual([
          'D##','E##','F##','G##','A##','B#','C##'
        ])

        const phrygianScale = minorOverEnharmonicFifthScales[4]
        expect(phrygianScale.scaleName).toEqual('phrygian')
        expect(phrygianScale.scaleNotes).toEqual([
          'A','Bb','C','D','E','F','G'
        ])

        const relativeLocrianScale = minorOverEnharmonicFifthScales[5]
        expect(relativeLocrianScale.scaleName).toEqual('locrian')
        expect(relativeLocrianScale.scaleNotes).toEqual([
          'D##','E#','F##','G##','A#','B#','C##'
        ])

        const dorianSharpFourScale = minorOverEnharmonicFifthScales[6]
        expect(dorianSharpFourScale.scaleName).toEqual('dorian #4')
        expect(dorianSharpFourScale.scaleNotes).toEqual([
          'A','B','C','D#','E','F#','G'
        ])

        const relativeHarmonicMinorTwoScale = minorOverEnharmonicFifthScales[7]
        expect(relativeHarmonicMinorTwoScale.scaleName).toEqual('harmonic minor')
        expect(relativeHarmonicMinorTwoScale.scaleNotes).toEqual([
          'D##','E##','F##','G##','A##','B#','C###'
        ])
      });

      it('enharmonic of root', () => {
        const minorOverEnharmonicRootScales = scalesForChord('A', '-', 'G##')

        expect(minorOverEnharmonicRootScales.length).toEqual(8);

        const aeolianScale = minorOverEnharmonicRootScales[0]
        expect(aeolianScale.scaleName).toEqual('aeolian')
        expect(aeolianScale.scaleNotes).toEqual([
          'A','B','C','D','E','F','G'
        ])
        const enharmonicAeolianScale = minorOverEnharmonicRootScales[1]
        expect(enharmonicAeolianScale.scaleName).toEqual('aeolian')
        expect(enharmonicAeolianScale.scaleNotes).toEqual([
          'G##','A##','B#','C##','D##','E#','F##'
        ])

        const dorianScale = minorOverEnharmonicRootScales[2]
        expect(dorianScale.scaleName).toEqual('dorian')
        expect(dorianScale.scaleNotes).toEqual([
          'A','B','C','D','E','F#','G'
        ])

        const enharmonicDorianScale = minorOverEnharmonicRootScales[3]
        expect(enharmonicDorianScale.scaleName).toEqual('dorian')
        expect(enharmonicDorianScale.scaleNotes).toEqual([
          'G##','A##','B#','C##','D##','E##','F##'
        ])

        const phrygianScale = minorOverEnharmonicRootScales[4]
        expect(phrygianScale.scaleName).toEqual('phrygian')
        expect(phrygianScale.scaleNotes).toEqual([
          'A','Bb','C','D','E','F','G'
        ])

        const enharmonicPhrygianScale = minorOverEnharmonicRootScales[5]
        expect(enharmonicPhrygianScale.scaleName).toEqual('phrygian')
        expect(enharmonicPhrygianScale.scaleNotes).toEqual([
          'G##','A#','B#','C##','D##','E#','F##'
        ])

        const dorianSharpFourScale = minorOverEnharmonicRootScales[6]
        expect(dorianSharpFourScale.scaleName).toEqual('dorian #4')
        expect(dorianSharpFourScale.scaleNotes).toEqual([
          'A','B','C','D#','E','F#','G'
        ])

        const enharmonicDorianSharpFourScale = minorOverEnharmonicRootScales[7]
        expect(enharmonicDorianSharpFourScale.scaleName).toEqual('dorian #4')
        expect(enharmonicDorianSharpFourScale.scaleNotes).toEqual([
          'G##','A##','B#','C###','D##','E##','F##'
        ])
      })
    })
  })
})

describe('countSemitonesBetween', () => {
  it('natural seconds', () => {
    expect(countSemitonesBetween('E', 'F')).toEqual(1);
    expect(countSemitonesBetween('F', 'G')).toEqual(2);
  })

  it('thirds', () => {
    expect(countSemitonesBetween('C', 'Eb')).toEqual(3);
    expect(countSemitonesBetween('C', 'E')).toEqual(4);
  })

  it('sharp', () => {
    expect(countSemitonesBetween('E', 'F#')).toEqual(2);
  })

  it('flat', () => {
    expect(countSemitonesBetween('Eb', 'F')).toEqual(2);
  })

  it('sharps', () => {
    expect(countSemitonesBetween('F#', 'G#')).toEqual(2);
  })

  it('flats', () => {
    expect(countSemitonesBetween('Db', 'Eb')).toEqual(2);
  })

  it('returns 0 for unison', () => {
    expect(countSemitonesBetween('Ab', 'Ab')).toEqual(0);
  })

  it('returns 0 for enharmonics', () => {
    expect(countSemitonesBetween('Ab', 'G#')).toEqual(0);
  })

  it('returns 0 for enharmonic double sharps', () => {
    expect(countSemitonesBetween('F#', 'E##')).toEqual(0);
  })

  it('returns a positive number for accidentals of the same note', () => {
    expect(countSemitonesBetween('A', 'A#')).toEqual(1);
    expect(countSemitonesBetween('B', 'Bb')).toEqual(11);
  })
})