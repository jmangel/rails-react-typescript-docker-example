import React, { useState } from 'react';
import { Alert, Button, Col, FormText, Input, Label, Row } from "reactstrap";

const ChooseKey: React.FC<{
  setGlobalKeyNote: React.Dispatch<React.SetStateAction<string>>,
  setGlobalKeyScale: React.Dispatch<React.SetStateAction<string>>,
  applyGlobalKey: () => void,
  navigateToNextStep: () => void,
}> = ({
  setGlobalKeyNote,
  setGlobalKeyScale,
  applyGlobalKey,
  navigateToNextStep,
}) => {
  const [alertVisible, setAlertVisible] = useState(false);

  const onDismiss = () => setAlertVisible(false);

  return (
    <div>
      <Alert isOpen={alertVisible} toggle={onDismiss}>
        Key applied!
      </Alert>
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
            Any keys applied will set the key on any unselected chords with a possible scale in the applied key.
          </FormText>
          <Button
            className="ml-auto mr-3"
            color="primary"
            onClick={() => { applyGlobalKey(); setAlertVisible(true); setTimeout(onDismiss, 3000) } }
          >
            Apply
          </Button>
        </Col>
      </Row>
      <Row>
      <Col className="py-2">
        <Button
          className="ml-auto mr-3"
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

