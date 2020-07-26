import scalesForChord from '../ChordMapper'

it('gets double sharp', () => {
  expect(
    scalesForChord('E', '^')[1].scaleNotes
  ).toEqual([
    'E', 'F##', 'G#', 'A#', 'B', 'C#', 'D#'
  ])
});

it('gives dorian and aeolian for minor', () => {
  expect(
    scalesForChord('A', '-')
  ).toEqual([
    {
      scaleName: 'aeolian',
      scaleNotes: [
        'A','B','C','D','E','F','G'
      ]
    },
    {
      scaleName: 'dorian',
      scaleNotes: [
        'A','B','C','D','E','F#','G'
      ]
    },
  ])
});
