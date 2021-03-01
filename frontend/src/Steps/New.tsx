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
    <Col>
      <Row className='py-2'>
        <Button
          color="link"
          outline
          className="w-75 ml-auto mr-auto btn-outline-light"
          onClick={() => navigateToNextStep()}
        >
          Continue
        </Button>
      </Row>
      <Row className='py-2'>
        <Button
          color="light"
          className="w-75 ml-auto mr-auto"
          onClick={() => startNewSong()}
        >
          New
        </Button>
      </Row>
      <Row className='py-2'>
        <Input
          type="file"
          name="irealImportFile"
          id="irealImportFile"
          onChange={handleFiles}
          className="d-none"
        />
        <Button
          color="primary"
          className="w-75 ml-auto mr-auto"
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
      </Row>
    </Col>
  );
}

export default New;
