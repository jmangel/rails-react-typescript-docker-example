import scalesForChord, { NamedScale } from '../ChordMapper'

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
  it('gives dorian and aeolian for minor', () => {
    const minorScales = scalesForChord('A', '-')

    const aeolianScale = minorScales[0]
    const dorianScale = minorScales[1]

    expect(aeolianScale.scaleName).toEqual('aeolian')
    expect(aeolianScale.scaleNotes).toEqual([
      'A','B','C','D','E','F','G'
    ])

    expect(dorianScale.scaleName).toEqual('dorian')
    expect(dorianScale.scaleNotes).toEqual([
      'A','B','C','D','E','F#','G'
    ])
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
})