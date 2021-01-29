import React, { ChangeEvent, useEffect, useState, Dispatch, SetStateAction } from 'react';
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from 'reactstrap';
import {
  useQueryParams,
  ArrayParam,
  NumberParam,
  StringParam,
  withDefault,
} from 'use-query-params';

const iRealReader = require('ireal-reader');

import './App.css';
import ChordCarousel from './ChordCarousel';
import parseChordString from './ChordParser';
import ChordRow, { ChordRowObject } from './ChordRow'
import ColorWheel from './ColorWheel';
import { parseStringifiedChordRowObject, csvifyChordRowObjects, parseCsvifiedChordRowObjects } from './JsonCondenser'
import { MonochromaticPossibleRootScale, regenerateMonochromaticSchemes } from './ScaleColorer';

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

const App: React.FC = () => {
  const [newChordRows, setNewChordRows] = useState(1);

  const [query, setQuery] = useQueryParams({
    a: withDefault(ArrayParam, undefined),
    c: withDefault(StringParam, csvifyChordRowObjects([createChordRowObject()])),
    t: withDefault(StringParam, ''),
    i: withDefault(NumberParam, -1)
  });
  const { a, c, t, i } = query;

  const startingChordRowObjects = (c) ? parseCsvifiedChordRowObjects(c) : (a as Array<string> || []).map(parseStringifiedChordRowObject);
  const [chordRowObjects, setChordRowObjects] = useState(startingChordRowObjects);
  if (a) setQuery({ a: undefined }, 'pushIn');
  if (c === '') setQuery({ c: csvifyChordRowObjects(chordRowObjects) }, 'pushIn');

  useEffect(() => {
    setQuery(
      { c: csvifyChordRowObjects(chordRowObjects) },
      'pushIn'
    )
  }, [chordRowObjects]);

  const [song, setSong] = useState(createSongObject(t));

  useEffect(() => {
    setQuery(
      { t: song.title },
      'pushIn'
    )

    document.title = `Song Scaler - ${song.title}`

  }, [song]);

  const [expandedRowIndex, setExpandedRowIndex] = useState(i);
  const toggle = (rowIndex: number) => {
    if (expandedRowIndex > -1) setExpandedRowIndex(-1);
    else setExpandedRowIndex(rowIndex);
  }

  useEffect(() => {
    setQuery(
      { i: expandedRowIndex },
      'pushIn'
    )
  }, [expandedRowIndex]);

  const expandedChordRow = (expandedRowIndex > -1) && chordRowObjects[expandedRowIndex];

  const [redRgbValue, setRedRgbValue] = useState(42);
  const [greenRgbValue, setGreenRgbValue] = useState(214);
  const [blueRgbValue, setBlueRgbValue] = useState(255);

  const [monochromaticSchemes, setMonochromaticSchemes] = useState<{ [key in MonochromaticPossibleRootScale]: string }[]>(
    regenerateMonochromaticSchemes(redRgbValue, greenRgbValue, blueRgbValue)
  );

  useEffect(() => {
    setMonochromaticSchemes(regenerateMonochromaticSchemes(redRgbValue, greenRgbValue, blueRgbValue));
  }, [redRgbValue, greenRgbValue, blueRgbValue]);

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
              const parsedChordString = parseChordString(measure);

              return {
                chordNote: parsedChordString[0],
                chordQuality: parsedChordString[1],
                bassNote: parsedChordString[2],
                selectedScale: '',
                selectedScaleRoot: '',
                availableTensions: '',
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
        <Container fluid>
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
            monochromaticSchemes={monochromaticSchemes}
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
          <Row>
            <Form inline className="w-100 pt-3">
              <Col xs={4}>
                <Label for="red" >Red:</Label>
                <Input
                  type="number"
                  name="red"
                  value={redRgbValue}
                  onChange={(e) => setRedRgbValue(parseInt(e.target.value))}
                  />
              </Col>
              <Col xs={4}>
                <Label for="green" >Green:</Label>
                <Input
                  type="number"
                  name="green"
                  value={greenRgbValue}
                  onChange={(e) => setGreenRgbValue(parseInt(e.target.value))}
                  />
              </Col>
              <Col xs={4}>
                <Label for="blue" >Blue:</Label>
                <Input
                  type="number"
                  name="blue"
                  value={blueRgbValue}
                  onChange={(e) => setBlueRgbValue(parseInt(e.target.value))}
                  />
              </Col>
            </Form>
          </Row>
          <ColorWheel monochromaticSchemes={monochromaticSchemes} />
        </Container>
        )
      }
    </div>
  );
}

export default App;
