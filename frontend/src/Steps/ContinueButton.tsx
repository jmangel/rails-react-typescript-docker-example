import React from 'react';
import {
  Button,
  Row,
} from 'reactstrap';

const ContinueButton: React.FC<{
  navigateToNextStep: () => void,
}> = ({
  navigateToNextStep,
}) => {
  return (
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
  );
}

export default ContinueButton;
