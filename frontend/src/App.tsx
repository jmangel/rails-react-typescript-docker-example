import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Button,
  Col,
  Container,
  FormText,
  Input,
  Label,
  Row,
} from 'reactstrap';
import {
  useQueryParams,
  ArrayParam,
  StringParam,
  withDefault,
} from 'use-query-params';

const iRealReader = require('ireal-reader');

import './App.css';
import ChordRow, { ChordRowObject, QUERY_STRING_KEY_MAPPINGS } from './ChordRow'
import ChordCarousel from './ChordCarousel';

const createChordRowObject = (): ChordRowObject => {
  return { chordQuality: '' } as ChordRowObject;
}

interface Song {
  title: string;
  music: {
    measures: Array<Array<string>>;
  };
};
const createSongObject = (title: string | null): Song => {
  return { title } as Song;
}

const stringifyChordRowObject = (chordRowObject: ChordRowObject): string => {
  let stringified = JSON.stringify(chordRowObject);
  Object.keys(QUERY_STRING_KEY_MAPPINGS).forEach((fullKeyName) => {
    stringified = stringified.replace(new RegExp(fullKeyName, 'g'), QUERY_STRING_KEY_MAPPINGS[fullKeyName as keyof ChordRowObject])
  })
  return stringified;
}

const parseStringifiedChordRowObject = (stringifiedObject: string): ChordRowObject => {
  let parsedObject = JSON.parse(stringifiedObject)
  Object.keys(QUERY_STRING_KEY_MAPPINGS).forEach((fullKeyName) => {
    const shortKey = QUERY_STRING_KEY_MAPPINGS[fullKeyName as keyof ChordRowObject];
    parsedObject[fullKeyName] = parsedObject[shortKey];
    delete parsedObject[shortKey];
  })
  return parsedObject;
}

const chordParserRegex = /(^[A-G]+[b|#]*)([^/]*)(\/?[A-G]+[b|#]*)?$/gm;

const App: React.FC = () => {
  const [newChordRows, setNewChordRows] = useState(1);

  const [query, setQuery] = useQueryParams({
    a: withDefault(ArrayParam, [stringifyChordRowObject(createChordRowObject())]),
    t: withDefault(StringParam, ''),
  });
  const { a, t } = query;

  const [chordRowObjects, setChordRowObjects] = useState(
    (a as Array<string>).map(parseStringifiedChordRowObject)
  );

  useEffect(() => {
    setQuery(
      { a: chordRowObjects.map(stringifyChordRowObject) },
      'pushIn'
    )
  }, [chordRowObjects]);

  const [song, setSong] = useState(createSongObject(t));

  useEffect(() => {
    setQuery(
      { t: song.title },
      'pushIn'
    )
  }, [song]);

  const [expandedRowIndex, setExpandedRowIndex] = useState(-1);
  const toggle = (rowIndex: number) => {
    if (expandedRowIndex > -1) setExpandedRowIndex(-1);
    else setExpandedRowIndex(rowIndex);
  }

  const expandedChordRow = (expandedRowIndex > -1) && chordRowObjects[expandedRowIndex];

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
      <header className="App-header flex-row justify-content-between">
        {song.title &&
          <span className="ml-3">
            {song.title}
          </span>
        }
        <Button
          className="ml-auto mr-3"
          color="primary"
          onClick={() => {
            const el = document.createElement('textarea');
            el.value = window.location.href;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }}>Copy Share link to clipboard</Button>
      </header>
      {
        expandedChordRow ? (
          <ChordCarousel
            expandedRowIndex={expandedRowIndex}
            chordRowObjects={chordRowObjects}
            setExpandedRowIndex={setExpandedRowIndex}
            onRowChange={handleRowChange}
            toggle={toggle}
          />
        ) : (
        <Container>
          <Row className='mx-auto py-2 mb-3'>
            <Col>
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
          {chordRowObjects.map((chordRowObject, rowIndex) => <ChordRow
            chordRowObject={chordRowObject}
            onRowExpand={ () => toggle(rowIndex) }
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
        )
      }
    </div>
  );
}

export default App;
