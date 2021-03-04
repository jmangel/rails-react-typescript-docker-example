import React from 'react';
import { Button, Col, Input, Row } from "reactstrap";

export enum TransposingKeys {
  C = '0',
  Bb = '2',
  Eb = '-3',
  F = '-5',
  G = '5',
};

const ChooseKey: React.FC<{
  navigateToNextStep: () => void,
  setTransposingInstrument: (key: TransposingKeys) => void,
  transposingKey: TransposingKeys,
}> = ({
  navigateToNextStep,
  setTransposingInstrument,
  transposingKey,
}) => {
  return (
    <div>
      <Row className="pt-3 border-top justify-content-center">
        <h4 className="mb-0">Transposing Key</h4>
      </Row>
      <Row className="py-3">
        <Col>
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
      <Row>
        <Col>
          <Button
            onClick={() => navigateToNextStep()}
          >
            Continue
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default ChooseKey;

