import scalesForChord from '../ChordMapper'

it.only('gets double sharp', () => {
  expect(
    scalesForChord('E', '^')[1]
  ).toEqual([
    'E',
    'F##',
    'G#',
    'A#',
    'B',
    'C#',
    'D#'
  ])
});

it('gives dorian and aeolian for minor', () => {
  expect(
    scalesForChord('A', '-')
  ).toEqual([
    [
      'A','B','C','D','E','F','G'
    ],
    [
      'A','B','C','D','E','F#','G'
    ]
  ])
});
