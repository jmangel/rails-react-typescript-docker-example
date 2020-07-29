import React from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import scalesForChord, { NamedScale } from './ChordMapper'

const ChordRow: React.FC<{
  chordNote: string,
  chordQuality: string,
  onChordNoteChange: (newChordNote: string) => void,
  onChordQualityChange: (newChordQuality: string) => void,
}> = ({
  chordNote,
  chordQuality,
  onChordNoteChange,
  onChordQualityChange,
}) => {

  const scales = (chordNote && chordQuality && scalesForChord(chordNote, chordQuality)) || [];

  return (
    <Row className="border">
      <Col>
        <Form>
          <FormGroup>
            <Label for="exampleEmail">Chord Note:</Label>
            <Input
              type="text"
              name="chordNote"
              value={chordNote}
              onChange={e => onChordNoteChange(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="exampleEmail">Chord Quality:</Label>
            <Input
              type="text"
              name="chordQuality"
              value={chordQuality}
              onChange={e => onChordQualityChange(e.target.value)}
            />
          </FormGroup>
        </Form>
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
