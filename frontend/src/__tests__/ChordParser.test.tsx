import parseChordString from '../ChordParser'

it('gets simple chord', () => {
  expect(
    parseChordString('E^')
  ).toEqual([
    'E', '^', ''
  ])
});

describe('bass note', () => {
  it('gets simple bass note', () => {
    expect(
      parseChordString('E^/G')
    ).toEqual([
      'E', '^', '/G'
    ])
  });
})

describe('chordQuality', () => {
  it('gets complicated chordQuality', () => {
    expect(
      parseChordString('E#^7b9')
    ).toEqual([
      'E#', '^7b9', ''
    ])
  });
})
