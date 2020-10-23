import { ChordRowObject } from '../ChordRow';
import { parseStringifiedChordRowObject, csvifyChordRowObject, csvifyChordRowObjects, parseCsvifiedChordRowObjects } from '../JsonCondenser';

describe('parseStringifiedChordRowObject', () => {
  it('rebuilds ChordRowObject from shortened keys', () => {
    const objectToStringify = {
      'cn': 'myChordNote',
      'cq': 'myQuality',
      'bn': 'myBassNote',
      'ss': 'mySelectedScale',
      'r': 'myRoot',
    }

    const expectedChordRowObject: ChordRowObject = {
      chordNote: 'myChordNote',
      chordQuality: 'myQuality',
      bassNote: 'myBassNote',
      selectedScale: 'mySelectedScale',
      selectedScaleRoot: 'myRoot',
      availableTensions: '',
    }

    expect(parseStringifiedChordRowObject(JSON.stringify(objectToStringify))).toEqual(expectedChordRowObject);
  })

  it('rebuilds ChordRowObject with encoded scale', () => {
    const objectToStringify = {
      'cn': 'myChordNote',
      'cq': 'myQuality',
      'bn': 'myBassNote',
      'ss': 'hm5',
      'r': 'myRoot',
    }

    const expectedChordRowObject: ChordRowObject = {
      chordNote: 'myChordNote',
      chordQuality: 'myQuality',
      bassNote: 'myBassNote',
      selectedScale: 'phrygian dominant',
      selectedScaleRoot: 'myRoot',
      availableTensions: '',
    }

    expect(parseStringifiedChordRowObject(JSON.stringify(objectToStringify))).toEqual(expectedChordRowObject);
  });

  it('handles strings that include short keys', () => {
    const objectToStringify = {
      'cn': 'my cn',
      'cq': 'my cq',
      'bn': 'my bn',
      'ss': 'my ss',
      'r': 'my r',
      'at': 'my at',
    }

    const expectedChordRowObject: ChordRowObject = {
      chordNote: 'my cn',
      chordQuality: 'my cq',
      bassNote: 'my bn',
      selectedScale: 'my ss',
      selectedScaleRoot: 'my r',
      availableTensions: 'my at',
    }

    expect(parseStringifiedChordRowObject(JSON.stringify(objectToStringify))).toEqual(expectedChordRowObject);
  })

  it('handles strings that include full keys', () => {
    const objectToStringify = {
      'cn': 'my chordNote',
      'cq': 'my chordQuality',
      'bn': 'my bassNote',
      'ss': 'my selectedScale',
      'r': 'my selectedScaleRoot',
      'at': 'my availableTensions',
    }

    const expectedChordRowObject: ChordRowObject = {
      chordNote: 'my chordNote',
      chordQuality: 'my chordQuality',
      bassNote: 'my bassNote',
      selectedScale: 'my selectedScale',
      selectedScaleRoot: 'my selectedScaleRoot',
      availableTensions: 'my availableTensions',
    }

    expect(parseStringifiedChordRowObject(JSON.stringify(objectToStringify))).toEqual(expectedChordRowObject);
  })

  it('rebuilds ChordRowObject from removed keys', () => {
    const expectedChordRowObject: ChordRowObject = {
      chordNote: '',
      chordQuality: '',
      bassNote: '',
      selectedScale: '',
      selectedScaleRoot: '',
      availableTensions: '',
    }

    expect(parseStringifiedChordRowObject(JSON.stringify({}))).toEqual(expectedChordRowObject);
  })

  describe('backward compatibility', () => {
    it('keeps backward compatibility for ssr', () => {
      const objectToStringify = {
        'cn': 'myChordNote',
        'cq': 'myQuality',
        'bn': 'myBassNote',
        'ss': 'mySelectedScale',
        'ssr': 'myRoot',
        'at': 'myAvailableTensions'
      }

      const expectedChordRowObject: ChordRowObject = {
        chordNote: 'myChordNote',
        chordQuality: 'myQuality',
        bassNote: 'myBassNote',
        selectedScale: 'mySelectedScale',
        selectedScaleRoot: 'myRoot',
        availableTensions: 'myAvailableTensions'
      }

      expect(parseStringifiedChordRowObject(JSON.stringify(objectToStringify))).toEqual(expectedChordRowObject);
    })

    it('ignores ssr if r present', () => {
      const objectToStringify = {
        'cn': 'myChordNote',
        'cq': 'myQuality',
        'bn': 'myBassNote',
        'ss': 'mySelectedScale',
        'at': 'myAvailableTensions',
        'r': 'newRoot',
        'ssr': 'oldRoot',
      }

      const expectedChordRowObject: ChordRowObject = {
        chordNote: 'myChordNote',
        chordQuality: 'myQuality',
        bassNote: 'myBassNote',
        selectedScale: 'mySelectedScale',
        selectedScaleRoot: 'newRoot',
        availableTensions: 'myAvailableTensions',
      }

      expect(parseStringifiedChordRowObject(JSON.stringify(objectToStringify))).toEqual(expectedChordRowObject);
    })

    it('rebuilds ChordRowObject with unencoded scale', () => {
      const objectToStringify = {
        'cn': 'myChordNote',
        'cq': 'myQuality',
        'bn': 'myBassNote',
        'ss': 'phrygian dominant',
        'r': 'myRoot',
      }

      const expectedChordRowObject: ChordRowObject = {
        chordNote: 'myChordNote',
        chordQuality: 'myQuality',
        bassNote: 'myBassNote',
        selectedScale: 'phrygian dominant',
        selectedScaleRoot: 'myRoot',
        availableTensions: '',
      }

      expect(parseStringifiedChordRowObject(JSON.stringify(objectToStringify))).toEqual(expectedChordRowObject);
    });
  })
})

describe('csvifyChordRowObject', () => {
  it('shortens each key of ChordRowObject', () => {
    const chordRowObject: ChordRowObject = {
      chordNote: 'myChordNote',
      chordQuality: 'myQuality',
      bassNote: 'myBassNote',
      selectedScale: 'phrygian dominant',
      selectedScaleRoot: 'myRoot',
      availableTensions: '',
    }

    const expectedCsv = 'myChordNote.myQuality.myBassNote.hm5.myRoot.'

    expect(csvifyChordRowObject(chordRowObject)).toEqual(expectedCsv);
  })

  it('sorts keys correctly', () => {
    const chordRowObject: ChordRowObject = {
      chordQuality: 'myQuality',
      availableTensions: '',
      selectedScale: 'phrygian dominant',
      chordNote: 'myChordNote',
      selectedScaleRoot: 'myRoot',
      bassNote: 'myBassNote',
    }

    const expectedCsv = 'myChordNote.myQuality.myBassNote.hm5.myRoot.'

    expect(csvifyChordRowObject(chordRowObject)).toEqual(expectedCsv);
  })

  it('handles strings that include short keys', () => {
    const chordRowObject: ChordRowObject = {
      chordNote: 'my cn',
      chordQuality: 'my cq',
      bassNote: 'my bn',
      selectedScale: 'my ss',
      selectedScaleRoot: 'my r',
      availableTensions: 'my at',
    }

    const expectedCsv = 'my cn.my cq.my bn.my ss.my r.my at'

    expect(csvifyChordRowObject(chordRowObject)).toEqual(expectedCsv);
  })

  it('handles strings that include full keys', () => {
    const chordRowObject: ChordRowObject = {
      chordNote: 'my chordNote',
      chordQuality: 'my chordQuality',
      bassNote: 'my bassNote',
      selectedScale: 'my selectedScale',
      selectedScaleRoot: 'my selectedScaleRoot',
      availableTensions: 'my availableTensions',
    }

    const expectedCsv = 'my chordNote.my chordQuality.my bassNote.my selectedScale.my selectedScaleRoot.my availableTensions'

    expect(csvifyChordRowObject(chordRowObject)).toEqual(expectedCsv);
  })

  it('supports empty ChordRowObject values', () => {
    const chordRowObject: ChordRowObject = {
      chordNote: '',
      chordQuality: '',
      bassNote: '',
      selectedScale: '',
      selectedScaleRoot: '',
      availableTensions: '',
    }

    const expectedCsv = '.....'

    expect(csvifyChordRowObject(chordRowObject)).toEqual(expectedCsv);
  })
})

describe('csvifyChordRowObjects', () => {
  it('csvifies all chordRowObjects', () => {
    const chordRowObjects: ChordRowObject[] = [
      {
        chordNote: 'myChordNote',
        chordQuality: 'myQuality',
        bassNote: 'myBassNote',
        selectedScale: 'phrygian dominant',
        selectedScaleRoot: 'myRoot',
        availableTensions: '',
      },
      {
        chordNote: 'my cn',
        chordQuality: 'my cq',
        bassNote: 'my bn',
        selectedScale: 'my ss',
        selectedScaleRoot: 'my r',
        availableTensions: 'my at',
      },
      {
        chordNote: 'my chordNote',
        chordQuality: 'my chordQuality',
        bassNote: 'my bassNote',
        selectedScale: 'my selectedScale',
        selectedScaleRoot: 'my selectedScaleRoot',
        availableTensions: 'my availableTensions',
      },
      {
        chordNote: '',
        chordQuality: '',
        bassNote: '',
        selectedScale: '',
        selectedScaleRoot: '',
        availableTensions: '',
      },
    ]

    let expectedCsv = `myChordNote.myQuality.myBassNote.hm5.myRoot.
    my cn.my cq.my bn.my ss.my r.my at
    my chordNote.my chordQuality.my bassNote.my selectedScale.my selectedScaleRoot.my availableTensions
    .....`.replace(/\n  +/g, '\n');

    expect(csvifyChordRowObjects(chordRowObjects)).toEqual(expectedCsv);
  })
})

describe('parseCsvifiedChordRowObjects', () => {
  it('parses all csv-ified chordRowObjects', () => {
    const expectedChordRowObjects: ChordRowObject[] = [
      {
        chordNote: 'myChordNote',
        chordQuality: 'myQuality',
        bassNote: 'myBassNote',
        selectedScale: 'phrygian dominant',
        selectedScaleRoot: 'myRoot',
        availableTensions: '',
      },
      {
        chordNote: 'my cn',
        chordQuality: 'my cq',
        bassNote: 'my bn',
        selectedScale: 'my ss',
        selectedScaleRoot: 'my r',
        availableTensions: 'my at',
      },
      {
        chordNote: 'my chordNote',
        chordQuality: 'my chordQuality',
        bassNote: 'my bassNote',
        selectedScale: 'my selectedScale',
        selectedScaleRoot: 'my selectedScaleRoot',
        availableTensions: 'my availableTensions',
      },
      {
        chordNote: '',
        chordQuality: '',
        bassNote: '',
        selectedScale: '',
        selectedScaleRoot: '',
        availableTensions: '',
      },
    ]

    let csv = `myChordNote.myQuality.myBassNote.hm5.myRoot.
    my cn.my cq.my bn.my ss.my r.my at
    my chordNote.my chordQuality.my bassNote.my selectedScale.my selectedScaleRoot.my availableTensions
    .....`.replace(/\n  +/g, '\n');

    expect(parseCsvifiedChordRowObjects(csv)).toEqual(expectedChordRowObjects);
  })

  it('backwards compatible with | delimiter', () => {
    const expectedChordRowObjects: ChordRowObject[] = [
      {
        chordNote: 'myChordNote',
        chordQuality: 'myQuality',
        bassNote: 'myBassNote',
        selectedScale: 'phrygian dominant',
        selectedScaleRoot: 'myRoot',
        availableTensions: '',
      },
      {
        chordNote: 'my cn',
        chordQuality: 'my cq',
        bassNote: 'my bn',
        selectedScale: 'my ss',
        selectedScaleRoot: 'my r',
        availableTensions: 'my at',
      },
      {
        chordNote: 'my chordNote',
        chordQuality: 'my chordQuality',
        bassNote: 'my bassNote',
        selectedScale: 'my selectedScale',
        selectedScaleRoot: 'my selectedScaleRoot',
        availableTensions: 'my availableTensions',
      },
      {
        chordNote: '',
        chordQuality: '',
        bassNote: '',
        selectedScale: '',
        selectedScaleRoot: '',
        availableTensions: '',
      },
    ]

    let csv = `myChordNote|myQuality|myBassNote|hm5|myRoot|
    my cn|my cq|my bn|my ss|my r|my at
    my chordNote|my chordQuality|my bassNote|my selectedScale|my selectedScaleRoot|my availableTensions
    |||||`.replace(/\n  +/g, '\n');

    expect(parseCsvifiedChordRowObjects(csv)).toEqual(expectedChordRowObjects);
  })
})