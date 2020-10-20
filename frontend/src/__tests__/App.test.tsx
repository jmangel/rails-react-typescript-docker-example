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
      selectedScale: 'mySelectedScale',
      selectedScaleRoot: 'myRoot',
      availableTensions: '',
    }

    const expectedObjectToStringify = {
      'cn': 'myChordNote',
      'cq': 'myQuality',
      'bn': 'myBassNote',
      'ss': 'mySelectedScale',
      'r': 'myRoot',
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
  })
})

