import React, { ChangeEvent } from 'react';
import { Container, Button, Row, Input } from 'reactstrap';

const iRealReader = require('ireal-reader');

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

interface Song {
  title: string;
};
const createSongObject = (): Song => {
  return {} as Song;
}

const App: React.FC = () => {
  const [content, updateContent] = React.useState('Waiting for a response from Rails...');

  const [chordRowObjects, setChordRowObjects] = React.useState([createChordRowObject()]);
  const [newChordRows, setNewChordRows] = React.useState(1);

  const [song, setSong] = React.useState(createSongObject());

  const handleRowChange = (rowIndex: number, newValue: string, key: keyof ChordRowObject): void => {
    let newChordRows = chordRowObjects.slice()
    newChordRows[rowIndex][key] = newValue
    setChordRowObjects(newChordRows)
  }

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    Array.from((event.target as HTMLInputElement).files as FileList).forEach((file: File) => {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt: ProgressEvent<FileReader>) => {
        if (!evt.target?.result) {
          return alert('error reading file: no result')
        }
        const playlist = iRealReader(evt.target?.result);

        const newSong = playlist.songs[0]
        if (newSong) setSong(newSong);
        else alert('no song found');
      }
      reader.onerror = () => {
        alert('error reading file');
      }
    })
  }

  React.useEffect(() => {
    fetchContent(updateContent);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {song.title}
        </p>
      </header>
      <Container>
        <Row className='w-25 mx-auto border'>
          <Input
            type="file"
            name="irealImportFile"
            id="irealImportFile"
            onChange={handleFiles}
          />
        </Row>
        {chordRowObjects.map((chordRowObject, rowIndex) => <ChordRow
          chordRowObject={chordRowObject}
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
