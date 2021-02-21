import React from 'react';
import { ChangeEvent } from 'react';
import { Col, FormText, Input, Label, Row } from "reactstrap";

const New: React.FC<{
  handleFiles: (event: ChangeEvent<HTMLInputElement>) => void,
}> = ({
  handleFiles,
}) => {

  return (
    <Row className='py-2 my-2'>
      <Col className="border py-2">
        <div className="custom-file">
          <Label className="custom-file-label" for="irealImportFile">Import song from iReal Pro</Label>
          <Input
            type="file"
            name="irealImportFile"
            id="irealImportFile"
            onChange={handleFiles}
          />
          <FormText color="muted" className="py-1">
            Export the song from iReal Pro as HTML and upload here.
          </FormText>
        </div>
      </Col>
    </Row>
  );
}

export default New;
