import React, { useState } from 'react';
import { Alert, Button, Col, FormText, Input, Label, Row } from "reactstrap";
import { PossibleRootScale } from '../ChordMapper';

export enum TransposingKeys {
  C = '0',
  Bb = '2',
  Eb = '-3',
  F = '-5',
  G = '5',
};

const ChooseKey: React.FC<{
  setGlobalKeyNote: React.Dispatch<React.SetStateAction<string>>,
  setGlobalKeyScale: React.Dispatch<React.SetStateAction<string>>,
  applyGlobalKey: () => void,
  navigateToNextStep: () => void,
  setTransposingInstrument: (key: TransposingKeys) => void,
  transposingKey: TransposingKeys,
}> = ({
  setGlobalKeyNote,
  setGlobalKeyScale,
  applyGlobalKey,
  navigateToNextStep,
  setTransposingInstrument,
  transposingKey,
}) => {
  const [alertVisible, setAlertVisible] = useState(false);

  const onDismiss = () => setAlertVisible(false);

  return (
    <div>
      <Alert isOpen={alertVisible} toggle={onDismiss}>
        Key filled!
      </Alert>
      <Row className="pt-3 border-top justify-content-center">
        <h4 className="mb-0">Fill by key</h4>
      </Row>
      <Row className="py-3">
        <Col className="border-top border-bottom py-3">
          <Row>
            <Col>
              <div>
                <Label for="globalKeyNote">Root</Label>
                <Input
                  type="text"
                  name="globalKeyNote"
                  id="globalKeyNote"
                  onChange={(e) => setGlobalKeyNote(e.target.value)}
                />
              </div>
            </Col>
            <Col>
            <Label for="globalKeyScale">Quality</Label>
              <Input type="select"
                name="globalKeyScale"
                id="globalKeyScale"
                onChange={(e) => setGlobalKeyScale(e.target.value)}
              >
                <option value="">--</option>
                {Object.values(PossibleRootScale).map(
                  (value: string, index: number) => (
                    <option
                    key={`option--scale-${index}`}
                    value={`${value}`}
                    >
                      {value}
                    </option>
                  )
                )}
              </Input>
            </Col>
          </Row>
          <FormText color="muted" className="py-2">
            Any unfilled chords with an available scale matching the key entered will have that scale selected.
            <br />
            (You can enter multiple keys, and they will fill unfilled chords in the order they are entered.)
          </FormText>
          <Button
            color="primary"
            onClick={() => { applyGlobalKey(); setAlertVisible(true); setTimeout(onDismiss, 3000) } }
          >
            Fill
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            onClick={() => navigateToNextStep()}
          >
            Continue
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Label for="transposingKey">Tranposing Key</Label>
          <Input type="select"
            name="transposingKey"
            id="transposingKey"
            onChange={(e) => setTransposingInstrument(e.target.value as TransposingKeys)}
          >
            {Object.entries(TransposingKeys).map(
              (entryArray, index: number) => {
                const [name, value] = entryArray;
                return (
                  <option
                  key={`option--transposing-key-${index}`}
                  selected={value === transposingKey}
                  value={value}
                  >
                    {name}
                  </option>
                );
              }
            )}
          </Input>
        </Col>
      </Row>
    </div>
  );
}

export default ChooseKey;

