import React from 'react';
import { Container, Button, Row, Input } from 'reactstrap';
import './App.css';
import ChordRow from './ChordRow'

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

interface ChordRowProp {
  chordNote: string;
  chordQuality: string;
}
const createChordRow = (): ChordRowProp => {
  return {
    chordNote: '',
    chordQuality: '',
  }
}

const App: React.FC = () => {
  const [content, updateContent] = React.useState('Waiting for a response from Rails...');

  const [chordRows, setChordRows] = React.useState([createChordRow()]);
  const [newChordRows, setNewChordRows] = React.useState(1);

  const handleRowChordNoteChange = (rowIndex: number, newChordNote: string) => {
    let newChordRows = chordRows.slice()
    newChordRows[rowIndex].chordNote = newChordNote
    setChordRows(newChordRows)
  }

  const handleRowChordQualityChange = (rowIndex: number, newChordQuality: string) => {
    let newChordRows = chordRows.slice()
    newChordRows[rowIndex].chordQuality = newChordQuality
    setChordRows(newChordRows)
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
        {chordRows.map(({ chordNote, chordQuality }, rowIndex) => <ChordRow
          chordNote={chordNote}
          chordQuality={chordQuality}
          onChordNoteChange={(newChordNote: string) => handleRowChordNoteChange(rowIndex, newChordNote)}
          onChordQualityChange={(newChordQuality: string) => handleRowChordQualityChange(rowIndex, newChordQuality)}
        />)}
        <Row className='w-25 mx-auto border'>
          <Button onClick={() => {
            if (newChordRows < 0) {
              setChordRows(chordRows => chordRows.slice(0,newChordRows))
            } else {
              const newChordRowsArray: Array<ChordRowProp> = [...Array(newChordRows)].map(() => createChordRow())
              setChordRows(chordRows => [...chordRows, ...newChordRowsArray])
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
