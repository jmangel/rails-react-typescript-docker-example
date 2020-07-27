import scalesForChord, { NamedScale } from '../ChordMapper'

it('gets double sharp', () => {
  expect(
    scalesForChord('E', '^')[1].scaleNotes
  ).toEqual([
    'E', 'F##', 'G#', 'A#', 'B', 'C#', 'D#'
  ])
});

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

describe.only('7b9 chord', () => {
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

  // TODO: 7b9 requires diminished primary scale, not yet implemented
  // it('returns melodic minor for melodic minor modes', () => {
  //   const dominantFlatNineScales = scalesForChord('A', '7b9')

  //   const phrygianDominantScale = dominantFlatNineScales[0]
  //   expect(phrygianDominantScale.rootScale).toEqual('melodic minor')
  // })

  it('returns harmonic minor for harmonic minor modes', () => {
    const majorScales = scalesForChord('A', '^')

    const lydianSharpTwoScale = majorScales[1]
    expect(lydianSharpTwoScale.rootScale).toEqual('harmonic minor')
  })

  // TODO: 7b9 requires diminished primary scale, not yet implemented
  // it('returns diminished for diminished modes', () => {
  //   const dominantFlatNineScales = scalesForChord('A', '7b9')

  //   const halfWholeDiminishedScale = dominantFlatNineScales[1]
  //   expect(halfWholeDiminishedScale.rootScale).toEqual('diminished')
  // })
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
    expect(scalesForChord('Ab', '^')[1].rootScaleNote).toEqual('C')
    expect(scalesForChord('D', '^')[1].rootScaleNote).toEqual('F#')
    expect(scalesForChord('Bbb', '^')[1].rootScaleNote).toEqual('Db')
  })
})