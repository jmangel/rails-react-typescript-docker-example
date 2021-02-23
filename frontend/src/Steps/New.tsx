import React from 'react';
import { ChangeEvent } from 'react';
import { Button, Col, FormText, Input, Row } from "reactstrap";

const New: React.FC<{
  handleFiles: (event: ChangeEvent<HTMLInputElement>) => void,
  startNewSong: () => void,
  navigateToNextStep: () => void,
}> = ({
  handleFiles,
  startNewSong,
  navigateToNextStep,
}) => {

  return (
    <div>
      <Row className='py-2 my-2'>
        <Col className="border py-2">
          <Button
            onClick={() => startNewSong()}
          >
            New
          </Button>
        </Col>
        <Col className="border py-2">
          <Input
            type="file"
            name="irealImportFile"
            id="irealImportFile"
            onChange={handleFiles}
            className="d-none"
          />
          <Button
            onClick={() => {
              const fileInput = document.getElementById('irealImportFile');
              fileInput && fileInput.click();
            }}
          >
            Import
          </Button>
          <FormText color="muted" className="py-1">
            Export the song from iReal Pro as HTML and upload here.
          </FormText>
        </Col>
      </Row>
      <Col className="py-2">
        <Button
          className="ml-auto mr-3"
          onClick={() => navigateToNextStep()}
        >
          Continue
        </Button>
      </Col>
    </div>
  );
}

export default New;
