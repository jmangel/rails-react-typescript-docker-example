import React from 'react';
import { Button, Col, FormText, Input, Label, Row } from "reactstrap";

const ChooseKey: React.FC<{
  setGlobalKeyNote: React.Dispatch<React.SetStateAction<string>>,
  setGlobalKeyScale: React.Dispatch<React.SetStateAction<string>>,
  applyGlobalKey: () => void,
}> = ({
  setGlobalKeyNote,
  setGlobalKeyScale,
  applyGlobalKey,
}) => {

  return (
    <Row className='py-2 my-2'>
      <Col className="border py-2">
        <Row>
          <Col>
            <div>
              <Label for="globalKeyNote">Root of global key</Label>
              <Input
                type="text"
                name="globalKeyNote"
                id="globalKeyNote"
                onChange={(e) => setGlobalKeyNote(e.target.value)}
              />
            </div>
          </Col>
          <Col>
            <Label for="globalKeyScale">Quality of global key</Label>
            <Input
              type="text"
              name="globalKeyScale"
              id="globalKeyScale"
              onChange={(e) => setGlobalKeyScale(e.target.value)}
            />
          </Col>
        </Row>
        <FormText color="muted" className="py-1">
          The key chosen here will apply to any unselected chords.
        </FormText>
        <Button
          className="ml-auto mr-3"
          color="primary"
          onClick={applyGlobalKey}
        >
          Apply
        </Button>
      </Col>
    </Row>

  );
}

export default ChooseKey;

