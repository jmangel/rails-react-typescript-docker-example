import React, { ChangeEvent, useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import scalesForChord, { NamedScale } from './ChordMapper'
import parseChordString from './ChordParser'
import scaleToHexColor, { MonochromaticPossibleRootScale } from './ScaleColorer';
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

export const scalesForChordRowObject = (chordRowObject: ChordRowObject): Array<NamedScale> => {
  const { chordNote, chordQuality, bassNote, availableTensions } = chordRowObject;
  return (chordNote && scalesForChord(chordNote, chordQuality, bassNote.replace(/\//g,''), availableTensions)) || [];
}

const ChordRow: React.FC<{
  chordRowObject: ChordRowObject,
  onRowChange: (newValue: string, key: keyof ChordRowObject) => void,
  onRowExpand?: () => void,
  monochromaticSchemes: { [key in MonochromaticPossibleRootScale]: string }[],
}> = ({
  chordRowObject,
  onRowChange,
  onRowExpand,
  monochromaticSchemes,
}) => {
  const { chordNote, chordQuality, bassNote, selectedScale, selectedScaleRoot, availableTensions } = chordRowObject;

  const scales = scalesForChordRowObject(chordRowObject);

  const handleChordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsedChordString = parseChordString(e.target.value);

    onRowChange(parsedChordString[0], 'chordNote');
    onRowChange(parsedChordString[1], 'chordQuality');
    onRowChange(parsedChordString[2], 'bassNote');
  }

  const selectedNamedScale = scales.find((namedScale: NamedScale) => namedScale.scaleName === selectedScale && (
    namedScale.scaleNotes[0] === (selectedScaleRoot || chordNote)
  ));

  let backgroundColor = '';
  if (selectedNamedScale) backgroundColor = scaleToHexColor(selectedNamedScale.rootScale, selectedNamedScale.rootScaleNote, monochromaticSchemes);

  return (
    <div>
      <Row className="border row__color-coded" style={{ backgroundColor }}>
        <Col>
          <Form inline>
            <Row className="w-100">
              <Col xs={6}>
                <Label for="chordNote" className="color-coded--text">Chord:</Label>
                <Input
                  type="text"
                  name="chordNote"
                  value={`${chordNote || ""}${chordQuality || ""}${bassNote || ""}`}
                  onChange={handleChordChange}
                  className="w-100"
                />
              </Col>
              <Col xs={6}>
                <Label for="exampleEmail" className="color-coded--text"><text>Other Scale Tones:</text></Label>
                <Input
                  type="text"
                  name="availableTensions"
                  value={availableTensions}
                  placeholder="(e.g. melody, notes you like)"
                  onChange={e => onRowChange(e.target.value, 'availableTensions')}
                  className="w-100"
                />
              </Col>
            </Row>
            <Row className="w-100">
              <Col xs={12}>

                <Label for="exampleSelect" className="color-coded--text">Preferred Scale</Label>
                <Input type="select"
                  name="select"
                  id="exampleSelect"
                  onChange={e => {
                    const [selectedScaleRoot, selectedScale] = e.target.value.split(/ (.+)/)
                    onRowChange(selectedScale, 'selectedScale')
                    onRowChange(selectedScaleRoot, 'selectedScaleRoot')
                  }}
                  className="w-100"
                  >
                  <option value="">--</option>
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
              </Col>
            </Row>
            <Row className="w-100 pt-3">
              <Col xs={12}>
                {
                  onRowExpand && (
                    <Button color="info" className="mb-2 border-dark" onClick={onRowExpand}>Expand</Button>
                  )
                }
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          {scales.map(
            (namedScale: NamedScale, index: number) => (
              <div key={`scale-${index}`}>
                <p className="color-coded--text">
                  {namedScale.scaleNotes[0]} {namedScale.scaleName}: {namedScale.scaleNotes.join(',')}
                  <br />
                  <small className="color-coded--text">{namedScale.rootScaleNote} {namedScale.rootScale}</small>
                </p>
              </div>
            )
          )}
        </Col>
      </Row>
    </div>
  );
}

export default ChordRow;
