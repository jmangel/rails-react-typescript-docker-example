import React from 'react';
import { Container, Button, Row, Input } from 'reactstrap';
import './App.css';
import ChordRow, { ChordRowObject } from './ChordRow'

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://backend.localhost';

const fetchContent = async (updateContent: (content: string) => void) => {
  const response = await fetch(`${BACKEND_API_URL}/greetings/hello`,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  updateContent(data.content);
};

const createChordRowObject = (): ChordRowObject => {
  return {} as ChordRowObject;
}

const App: React.FC = () => {
  const [content, updateContent] = React.useState('Waiting for a response from Rails...');

  const [chordRowObjects, setChordRowObjects] = React.useState([createChordRowObject()]);
  const [newChordRows, setNewChordRows] = React.useState(1);

  const handleRowChange = (rowIndex: number, newValue: string, key: keyof ChordRowObject): void => {
    let newChordRows = chordRowObjects.slice()
    newChordRows[rowIndex][key] = newValue
    setChordRowObjects(newChordRows)
  }

  React.useEffect(() => {
    fetchContent(updateContent);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {content}
        </p>
      </header>
      <Container>
        {chordRowObjects.map(({ chordNote, chordQuality }, rowIndex) => <ChordRow
          chordNote={chordNote}
          chordQuality={chordQuality}
          onRowChange={(newValue: string, key: keyof ChordRowObject) => handleRowChange(rowIndex, newValue, key)}
        />)}
        <Row className='w-25 mx-auto border'>
          <Button onClick={() => {
            if (newChordRows < 0) {
              setChordRowObjects(chordRowObjects => chordRowObjects.slice(0,newChordRows))
            } else {
              const newChordRowsArray: Array<ChordRowObject> = [...Array(newChordRows)].map(() => createChordRowObject())
              setChordRowObjects(chordRowObjects => [...chordRowObjects, ...newChordRowsArray])
            }
          }}>Add</Button>
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
      </Container>
    </div>
  );
}

export default App;
