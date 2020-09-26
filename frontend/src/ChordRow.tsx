import React, { ChangeEvent, useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import scalesForChord, { NamedScale } from './ChordMapper'
import parseChordString from './ChordParser'
export interface ChordRowObject {
  chordNote: string;
  chordQuality: string;
  bassNote?: string;
  selectedScale: string;
}

export const QUERY_STRING_KEY_MAPPINGS: { [key in keyof ChordRowObject]: string } = {
  'chordNote': 'cn',
  'chordQuality': 'cq',
  'bassNote': 'bn',
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

  const { chordNote, chordQuality, bassNote, selectedScale } = chordRowObject;

  const scales = (chordNote && scalesForChord(chordNote, chordQuality)) || [];

  const handleChordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsedChordString = parseChordString(e.target.value);

    onRowChange(parsedChordString[0], 'chordNote');
    onRowChange(parsedChordString[1], 'chordQuality');
    onRowChange(parsedChordString[2], 'bassNote');
  }

  return (
    <Row className="border">
      <Col xs={3}>
        <Form>
          <FormGroup>
            <Label for="exampleEmail">Chord:</Label>
            <Input
              type="text"
              name="chordNote"
              value={`${chordNote || ""}${chordQuality || ""}${bassNote || ""}`}
              onChange={handleChordChange}
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
