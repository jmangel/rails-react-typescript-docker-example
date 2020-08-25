import React from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import scalesForChord, { NamedScale } from './ChordMapper'

export interface ChordRowObject {
  chordNote: string;
  chordQuality: string;
  selectedScale: string;
}

export const QUERY_STRING_KEY_MAPPINGS: { [key in keyof ChordRowObject]: string } = {
  'chordNote': 'cn',
  'chordQuality': 'cq',
  'selectedScale': 'ss',
}

const ChordRow: React.FC<{
  chordRowObject: ChordRowObject,
  onRowChange: (newValue: string, key: keyof ChordRowObject) => void,
  onRowExpand?: () => void,
}> = ({
  chordRowObject,
  onRowChange,
  onRowExpand,
}) => {

  const { chordNote, chordQuality, selectedScale } = chordRowObject

  const scales = (chordNote && scalesForChord(chordNote, chordQuality)) || [];

  return (
    <Row className="border">
      <Col xs={3}>
        <Form>
          <FormGroup>
            <Label for="exampleEmail">Chord Note:</Label>
            <Input
              type="text"
              name="chordNote"
              value={chordNote}
              onChange={e => onRowChange(e.target.value, 'chordNote')}
            />
          </FormGroup>
          <FormGroup>
            <Label for="exampleEmail">Chord Quality:</Label>
            <Input
              type="text"
              name="chordQuality"
              value={chordQuality}
              onChange={e => onRowChange(e.target.value, 'chordQuality')}
            />
          </FormGroup>
        </Form>
      </Col>
      <Col xs={4}>
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
      <Col xs={5}>
        <FormGroup>
          <Label for="exampleSelect">Select</Label>
          <Input type="select"
            name="select"
            id="exampleSelect"
            onChange={e => onRowChange(e.target.value, 'selectedScale')}
          >
            <option>--</option>
            {scales.map(
              (namedScale: NamedScale, index: number) => (
                <option
                  key={`option--scale-${index}`}
                  value={namedScale.scaleName}
                  selected={namedScale.scaleName === selectedScale}
                >
                  {namedScale.rootScaleNote} {namedScale.rootScale}: {chordNote} {namedScale.scaleName}: {namedScale.scaleNotes.join(',')}
                </option>
              )
            )}
          </Input>
        </FormGroup>
        {
          onRowExpand && (
            <Button color="info" onClick={onRowExpand}>Expand</Button>
          )
        }
        </Col>
    </Row>
  );
}

export default ChordRow;
