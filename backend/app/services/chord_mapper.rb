class ChordMapper
  CHROMATIC_NOTES = [
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

  NAMED_NOTES = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
  ]

  INTERVALS = [
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

  PRIMARY_SCALES = [
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

  MODES = [
    {
      name: 'ionian',
      related_scale: {
        name: 'major',
        starting_degree: 1,
      },
    },
    {
      name: 'dorian',
      related_scale: {
        name: 'major',
        starting_degree: 2,
      },
    },
    {
      name: 'phrygian',
      related_scale: {
        name: 'major',
        starting_degree: 3,
      },
    },
    {
      name: 'lydian',
      related_scale: {
        name: 'major',
        starting_degree: 4,
      },
    },
    {
      name: 'mixolydian',
      related_scale: {
        name: 'major',
        starting_degree: 5,
      },
    },
    {
      name: 'aeolian',
      related_scale: {
        name: 'major',
        starting_degree: 6,
      },
    },
    {
      name: 'locrian',
      related_scale: {
        name: 'major',
        starting_degree: 7,
      },
    },
    {
      name: 'mixolydian b6',
      related_scale: {
        name: 'melodic minor',
        starting_degree: 5,
      },
    },
    {
      name: 'locrian 2/half-dim',
      related_scale: {
        name: 'melodic minor',
        starting_degree: 6,
      },
    },
    {
      name: 'altered',
      related_scale: {
        name: 'melodic minor',
        starting_degree: 7,
      },
    },
    {
      name: 'locrian #6',
      related_scale: {
        name: 'harmonic minor',
        starting_degree: 2,
      },
    },
    {
      name: 'phrygian dominant',
      related_scale: {
        name: 'harmonic minor',
        starting_degree: 5,
      },
    },
    {
      name: 'lydian #2',
      related_scale: {
        name: 'harmonic minor',
        starting_degree: 6,
      },
    },
    {
      name: 'Alt dom bb7',
      related_scale: {
        name: 'harmonic minor',
        starting_degree: 7,
      },
    },
    {
      name: 'w/h diminished',
      related_scale: {
        name: 'diminished',
        starting_degree: 1,
      },
    },
    {
      name: 'h/w diminished',
      related_scale: {
        name: 'diminshed',
        starting_degree: 2,
      },
    },
    {
      name: 'whole-tone',
      related_scale: {
        name: 'whole-tone',
        starting_degree: 1,
      },
    },
  ]

  CHORD_MAPPINGS = [
    {
      quality: '-',
      possible_modes: [
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
      possible_modes: [
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
      possible_modes: [
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

  def self.scales_for_chord(chord_note:, chord_quality:)
    # chord_note_index = CHROMATIC_NOTES.index { |enharmonics| enharmonics.include? chord_note }
    chord_note_index = enharmonic_note_index(note: chord_note, enharmonic_notes: CHROMATIC_NOTES)
    rotated_chromatic_notes = CHROMATIC_NOTES.rotate chord_note_index

    named_note_index = NAMED_NOTES.index { |note| chord_note.include? note }
    rotated_named_notes = NAMED_NOTES.rotate named_note_index

    possible_modes = CHORD_MAPPINGS.find { |chord| chord[:quality] == chord_quality }[:possible_modes]

    possible_scales_intervals = possible_modes.map do |possible_mode|
      mode = MODES.find { |mode| mode[:name] == possible_mode[:name] }

      primary_scale = PRIMARY_SCALES.find { |scale| scale[:name] == mode[:related_scale][:name] }

      starting_degree = mode[:related_scale][:starting_degree]

      mode_degrees = primary_scale[:degrees].rotate(starting_degree - 1)
      starting_semitones = nil
      mode_intervals_semitones = mode_degrees.map do |mode_degree|
        semitones = INTERVALS.find do |interval|
          [interval[:degree], interval[:quality]] == [mode_degree[:degree], mode_degree[:quality]]
        end[:semitones]

        starting_semitones ||= semitones

        (semitones - starting_semitones) % 12
      end

      starting_semitones = mode_intervals_semitones[0]

      # chord_note should be one or two letters like A or Ab
      # previous_note_accidental = chord_note[1]
      # all scales start at the beginning of the rotated chromatic scale
      scale_notes = []
      rotated_named_notes.each_with_index do |named_note, index|
        # if index == 0
        #   chord_note
        # end

        desired_semitones = mode_intervals_semitones[index]

        enharmonic_note = rotated_chromatic_notes[desired_semitones]

        scale_notes << enharmonic_note.find { |note_name| note_name.include? named_note }

        # named_note[:accidentals].each do |accidental|
        #   qualified_named_note = named_note[:note] + accidental
        #   if enharmonic_note.include? (qualified_named_note)
        #     scale_notes << qualified_named_note
        #     break
        #   end
        # end

        # maximum_enharmonic
        # maximum_semitones_in_step =

      end

      scale_notes
    end
  end

  def self.enharmonic_note_index(note:, enharmonic_notes:)
    enharmonic_notes.index { |enharmonics| enharmonics.include? note }
  end
end