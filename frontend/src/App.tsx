import React, { ChangeEvent, useEffect } from 'react';
import { Container, Button, Row, Input } from 'reactstrap';
import {
  useQueryParams,
  ArrayParam,
  withDefault,
} from 'use-query-params';

const iRealReader = require('ireal-reader');

import './App.css';
import ChordRow, { ChordRowObject } from './ChordRow'

const createChordRowObject = (): ChordRowObject => {
  return { chordQuality: '' } as ChordRowObject;
}

interface Song {
  title: string;
  music: {
    measures: Array<Array<string>>;
  };
};
const createSongObject = (): Song => {
  return {} as Song;
}

const chordParserRegex = /(^[A-G]+[b|#]*)([^/]*)(\/?[A-G]+[b|#]*)?$/gm;

const App: React.FC = () => {
  const [newChordRows, setNewChordRows] = React.useState(1);

  const [query, setQuery] = useQueryParams({
    chordRowObjectStrings: withDefault(ArrayParam, [JSON.stringify(createChordRowObject())]),
  });
  const { chordRowObjectStrings } = query;

  const [chordRowObjects, setChordRowObjects] = React.useState(
    (chordRowObjectStrings as Array<string>).map(
      (stringifiedObject: string): ChordRowObject => JSON.parse(stringifiedObject)
    )
  );

  useEffect(() => {
    setQuery(
      { chordRowObjectStrings: chordRowObjects.map((newChordRow) => JSON.stringify(newChordRow)) },
      'push'
    )
  }, [chordRowObjects]);


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

        const newSong: Song = playlist.songs[0];
        if (newSong) {
          setSong(newSong);
          const newChordRows = newSong.music.measures.flatMap((measures) => {
            return measures.map((measure) => {
              let m;
              let chordNote = '';
              let chordQuality = '';

              while ((m = chordParserRegex.exec(measure)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === chordParserRegex.lastIndex) {
                  chordParserRegex.lastIndex++;
                }

                // The result can be accessed through the `m`-variable.
                chordNote = m[1] || '';
                chordQuality = m[2] || '';
                // TODO: get root from m[3]
              }

              return {
                chordNote,
                chordQuality,
                selectedScale: '',
              }
            });
          })
          setChordRowObjects(newChordRows)
        } else alert('no song found');
      }
      reader.onerror = () => {
        alert('error reading file');
      }
    })
  }
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
