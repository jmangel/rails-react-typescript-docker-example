import React, { useState } from 'react';
import { Button, Input, Row } from "reactstrap";
import ChordRow, { ChordRowObject } from '../ChordRow';
import { MonochromaticPossibleRootScale } from '../ScaleColorer';

const Edit: React.FC<{
  chordRowObjects: ChordRowObject[],
  handleRowChange: (rowIndex: number, newValue: string, key: keyof ChordRowObject) => void,
  addRows: (numNewRows: number) => void,
  monochromaticSchemes: { [key in MonochromaticPossibleRootScale]: string }[],
}> = ({
  chordRowObjects,
  handleRowChange,
  addRows,
  monochromaticSchemes,
}) => {
  const [newChordRows, setNewChordRows] = useState(1);

  return (
    <div>
      {chordRowObjects.map((chordRowObject, rowIndex) => <ChordRow
        chordRowObject={chordRowObject}
        onRowChange={(newValue: string, key: keyof ChordRowObject) => handleRowChange(rowIndex, newValue, key)}
        monochromaticSchemes={monochromaticSchemes}
      />)}
      <Row className='w-25 mx-auto border'>
        <Button onClick={() => addRows(newChordRows)}>Add</Button>
        <Input
          type="number"
          name="newChordRows"
          value={newChordRows}
          onChange={e => setNewChordRows(parseInt(e.target.value))}
          className='w-25 mx-2'
          inline
        />
        Row(s)
      </Row>
    </div>
  );
}

export default Edit;
