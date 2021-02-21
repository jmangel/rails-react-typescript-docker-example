import React from 'react';
import { ChangeEvent } from 'react';
import { Button, Col, FormText, Input, Label, Row } from "reactstrap";

const New: React.FC<{
  handleFiles: (event: ChangeEvent<HTMLInputElement>) => void,
  startNewSong: () => void,
}> = ({
  handleFiles,
  startNewSong
}) => {

  return (
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
  );
}

export default New;
