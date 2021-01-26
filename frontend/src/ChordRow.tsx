import React, { ChangeEvent, useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import scalesForChord, { NamedScale } from './ChordMapper'
import parseChordString from './ChordParser'
import scaleToHexColor from './ScaleColorer';
export interface ChordRowObject {
  chordNote: string;
  chordQuality: string;
  bassNote: string;
  selectedScale: string;
  selectedScaleRoot: string;
  availableTensions: string;
}

export const QUERY_STRING_KEY_MAPPINGS: { [key in keyof ChordRowObject]: string } = {
  'chordNote': 'cn',
  'chordQuality': 'cq',
  'bassNote': 'bn',
  'selectedScale': 'ss',
  'selectedScaleRoot': 'r',
  'availableTensions': 'at',
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
  const { chordNote, chordQuality, bassNote, selectedScale, selectedScaleRoot, availableTensions } = chordRowObject;

  const scales = (chordNote && scalesForChord(chordNote, chordQuality, bassNote.replace(/\//g,''), availableTensions)) || [];

  const handleChordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsedChordString = parseChordString(e.target.value);

    onRowChange(parsedChordString[0], 'chordNote');
    onRowChange(parsedChordString[1], 'chordQuality');
    onRowChange(parsedChordString[2], 'bassNote');
  }

  const selectedNamedScale = scales.find((namedScale: NamedScale) => namedScale.scaleName === selectedScale && (
    namedScale.scaleNotes[0] === (selectedScaleRoot || chordNote)
  ));

  console.warn(selectedNamedScale);
  let backgroundColor = '';
  if (selectedNamedScale) backgroundColor = scaleToHexColor(selectedNamedScale.rootScale, selectedNamedScale.rootScaleNote);

  return (
    <Row className="border" style={{ backgroundColor }}>
      <Col xs={6}>
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
        <Form>
          <FormGroup>
            <Label for="exampleEmail">Other Known Scale Tones <small>(e.g. melody notes, notes that sound good to you)</small>:</Label>
            <Input
              type="text"
              name="availableTensions"
              value={availableTensions}
              onChange={e => onRowChange(e.target.value, 'availableTensions')}
            />
          </FormGroup>
        </Form>
        <FormGroup>
          <Label for="exampleSelect">Preferred Scale</Label>
          <Input type="select"
            name="select"
            id="exampleSelect"
            onChange={e => {
              const [selectedScaleRoot, selectedScale] = e.target.value.split(/ (.+)/)
              onRowChange(selectedScale, 'selectedScale')
              onRowChange(selectedScaleRoot, 'selectedScaleRoot')
            }}
          >
            <option>--</option>
            {scales.map(
              (namedScale: NamedScale, index: number) => (
                <option
                  key={`option--scale-${index}`}
                  value={`${namedScale.scaleNotes[0]} ${namedScale.scaleName}`}
                  selected={namedScale.scaleName === selectedScale && (
                    namedScale.scaleNotes[0] === (selectedScaleRoot || chordNote)
                  )}
                >
                  {namedScale.scaleNotes[0]} {namedScale.scaleName} ({namedScale.rootScaleNote} {namedScale.rootScale}): {namedScale.scaleNotes.join(',')}
                </option>
              )
            )}
          </Input>
        </FormGroup>
        {
          onRowExpand && (
            <Button color="info" className="mb-2" onClick={onRowExpand}>Expand</Button>
          )
        }
      </Col>
      <Col xs={6}>
        {scales.map(
          (namedScale: NamedScale, index: number) => (
            <div key={`scale-${index}`}>
              <p>
                {namedScale.scaleNotes[0]} {namedScale.scaleName}: {namedScale.scaleNotes.join(',')}
                <br />
                <small>{namedScale.rootScaleNote} {namedScale.rootScale}</small>
              </p>
            </div>
          )
        )}
      </Col>
    </Row>
  );
}

export default ChordRow;
