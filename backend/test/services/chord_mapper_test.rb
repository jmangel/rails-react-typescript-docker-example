class ChordMapperTest
  def test_scales_for_chord__E_lydian_sharp_2
    assert_equal(
      [
        'E',
        'F##',
        'G#',
        'A#',
        'B',
        'C#',
        'D#'
      ],
      ChordMapper.scales_for_chord(chord_note: 'E', chord_quality: '^')[1]
    )
  end
end