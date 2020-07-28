import React from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import scalesForChord, { NamedScale } from './ChordMapper'

const ChordRow: React.FC = () => {
  const [chordNote, setChordNote] = React.useState('');
  const [chordQuality, setChordQuality] = React.useState('');

  const scales = (chordNote && chordQuality && scalesForChord(chordNote, chordQuality)) || [];

  return (
    <Row className="border">
      <Col>
        <form onSubmit={() => {}}>
          <div>
            <label>
              Chord Note:
              <input
                type="text"
                value={chordNote}
                onChange={e => setChordNote(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Chord Quality:
              <input
                type="text"
                value={chordQuality}
                onChange={e => setChordQuality(e.target.value)}
              />
            </label>
          </div>
        </form>
      </Col>
      <Col>
        {scales.map(
          (namedScale: NamedScale, index: number) => (
            <div key={`scale-${index}`}>
              <p>
                {chordNote}{chordQuality} {namedScale.scaleName}: {namedScale.scaleNotes.join(',')}
                <br />
                <small>{namedScale.rootScaleNote} {namedScale.rootScale}</small>
              </p>
            </div>
          )
        )}
      </Col>
      <Col>
        <FormGroup>
          <Label for="exampleSelect">Select</Label>
          <Input type="select" name="select" id="exampleSelect">
            <option>--</option>
            {scales.map(
              (namedScale: NamedScale, index: number) => (
                <option key={`option--scale-${index}`}>
                  {namedScale.rootScaleNote} {namedScale.rootScale}: {chordNote} {namedScale.scaleName}: {namedScale.scaleNotes.join(',')}
                </option>
              )
            )}
          </Input>
        </FormGroup>
      </Col>
    </Row>
  );
}

export default ChordRow;
