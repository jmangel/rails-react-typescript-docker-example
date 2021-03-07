import React, { useState } from 'react';
import { MdAddCircle, MdRemoveCircle } from 'react-icons/md';
import { Alert, Button, Col, Row } from "reactstrap";
import ChordRow, { ChordRowObject } from '../ChordRow';
import { MonochromaticPossibleRootScale } from '../ScaleColorer';

const Edit: React.FC<{
  chordRowObjects: ChordRowObject[],
  handleRowChange: (rowIndex: number, newValue: string, key: keyof ChordRowObject) => void,
  addRows: (numNewRows: number) => void,
  monochromaticSchemes: { [key in MonochromaticPossibleRootScale]: string }[],
  navigateToNextStep: () => void,
  fillWithKey: (keyNote: string, keyScale: string) => void,
}> = ({
  chordRowObjects,
  handleRowChange,
  addRows,
  monochromaticSchemes,
  navigateToNextStep,
  fillWithKey,
}) => {
  const [alertVisible, setAlertVisible] = useState(false);

  const onDismiss = () => setAlertVisible(false);

  return (
    <div>
      <Alert isOpen={alertVisible} toggle={onDismiss}>
        Key filled!
      </Alert>
      {chordRowObjects.map((chordRowObject, rowIndex) => <ChordRow
        chordRowObject={chordRowObject}
        onRowChange={(newValue: string, key: keyof ChordRowObject) => handleRowChange(rowIndex, newValue, key)}
        monochromaticSchemes={monochromaticSchemes}
        fillWithKey={(keyNote: string, keyScale: string) => { fillWithKey(keyNote, keyScale); setAlertVisible(true); setTimeout(onDismiss, 3000); } }
      />)}
      <Row className='pt-2 flex-row justify-content-center align-items-center'>
        <MdAddCircle color="#EF532B" size="3em" onClick={() => addRows(1)} />
        { chordRowObjects.length > 1 && <MdRemoveCircle color="#EF532B" size="3em" onClick={() => addRows(-1)} />}
      </Row>
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
    </div>
  );
}

export default Edit;
