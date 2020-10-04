import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import ChordRow, { ChordRowObject } from '../ChordRow';

describe('ChordRow', () => {
  let chordRowObject: ChordRowObject;

  beforeEach(() => {
    chordRowObject = {
      chordNote: 'A',
      chordQuality: '-',
      selectedScale: 'aeolian',
      bassNote: '/E',
      selectedScaleRoot: ''
    };
  });


  it('renders without crashing', () => {
    const wrapper = shallow(
      <ChordRow
        chordRowObject={chordRowObject}
        onRowChange={() => {}}
      />
    );

    expect(wrapper.find('option').length).toEqual(9)
  });

  describe('select', () => {
    describe('onChange', () => {
      it('splits value into selectedScale and root', () => {
        chordRowObject.chordQuality = '7b9'
        chordRowObject.bassNote = ''

        const wrapper = shallow(<ChordRow
          chordRowObject={chordRowObject}
          onRowChange={(value, key) => {
            chordRowObject[key] = value
          }}
        />);

        const selectField = wrapper.find('Input[type="select"]');
        selectField.simulate('change', { target: { value: 'A h/w diminished' } });

        expect(chordRowObject.selectedScale).toEqual('h/w diminished');
        expect(chordRowObject.selectedScaleRoot).toEqual('A');
      })
    })

    describe('selected', () => {
      it('selected is true for selectedScale based on root', () => {
        chordRowObject.selectedScale = 'aeolian'
        chordRowObject.selectedScaleRoot = 'A';


        const wrapper = shallow(<ChordRow
          chordRowObject={chordRowObject}
          onRowChange={() => {}}
        />);

        // const selectField = wrapper.find('Input[type="select"]')// as HTMLSelectElement
        const selectedOptions = wrapper.find('option[selected=true]');
        expect(selectedOptions.length).toEqual(1);
        expect(selectedOptions.at(0).props().value).toEqual('A aeolian');
      })

      it('selects selectedScale based on root by default if root is empty string', () => {
        chordRowObject.selectedScale = 'aeolian';
        chordRowObject.selectedScaleRoot = '';


        const wrapper = shallow(<ChordRow
          chordRowObject={chordRowObject}
          onRowChange={() => {}}
        />);

        const selectedOptions = wrapper.find('option[selected=true]');
        expect(selectedOptions.length).toEqual(1);
        expect(selectedOptions.at(0).props().value).toEqual('A aeolian');
      });

      it('sets selected=true for selectedScale based on bass note if specified', () => {
        chordRowObject.selectedScale = 'aeolian'
        chordRowObject.selectedScaleRoot = 'E';

        const wrapper = shallow(<ChordRow
          chordRowObject={chordRowObject}
          onRowChange={() => {}}
        />);

        const selectedOptions = wrapper.find('option[selected=true]');
        expect(selectedOptions.length).toEqual(1);
        expect(selectedOptions.at(0).props().value).toEqual('E aeolian');
      });
    });
  })
})
