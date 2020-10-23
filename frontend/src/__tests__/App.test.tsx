import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import App, { stringifyChordRowObject, parseStringifiedChordRowObject } from '../App';
import { ChordRowObject } from '../ChordRow';

it('renders without crashing', () => {
  const div = document.createElement('div');
  shallow(<App />);
});

describe('stringifyChordRowObject', () => {
  it('shortens each key of ChordRowObject', () => {
    const chordRowObject: ChordRowObject = {
      chordNote: 'myChordNote',
      chordQuality: 'myQuality',
      bassNote: 'myBassNote',
      selectedScale: 'phrygian dominant',
      selectedScaleRoot: 'myRoot',
      availableTensions: '',
    }

    const expectedObjectToStringify = {
      'cn': 'myChordNote',
      'cq': 'myQuality',
      'bn': 'myBassNote',
      'ss': 'hm5',
      'r': 'myRoot',
    }

    expect(stringifyChordRowObject(chordRowObject)).toEqual(JSON.stringify(expectedObjectToStringify));
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

    const expectedObjectToStringify = {
      'cn': 'my cn',
      'cq': 'my cq',
      'bn': 'my bn',
      'ss': 'my ss',
      'r': 'my r',
      'at': 'my at',
    }

    expect(stringifyChordRowObject(chordRowObject)).toEqual(JSON.stringify(expectedObjectToStringify));
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

    const expectedObjectToStringify = {
      'cn': 'my chordNote',
      'cq': 'my chordQuality',
      'bn': 'my bassNote',
      'ss': 'my selectedScale',
      'r': 'my selectedScaleRoot',
      'at': 'my availableTensions',
    }

    expect(stringifyChordRowObject(chordRowObject)).toEqual(JSON.stringify(expectedObjectToStringify));
  })

  it('excludes empty keys of ChordRowObject', () => {
    const chordRowObject: ChordRowObject = {
      chordNote: '',
      chordQuality: '',
      bassNote: '',
      selectedScale: '',
      selectedScaleRoot: '',
      availableTensions: '',
    }

    expect(stringifyChordRowObject(chordRowObject)).toEqual(JSON.stringify({}));
  })
})

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

