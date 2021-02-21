import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Button,
  Container,
} from 'reactstrap';
import {
  useQueryParams,
  ArrayParam,
  NumberParam,
  StringParam,
  withDefault,
} from 'use-query-params';
// import { SketchPicker } from 'react-color';
import { MdKeyboardArrowLeft } from 'react-icons/md';

const iRealReader = require('ireal-reader');

import './App.css';
import ChordCarousel from './ChordCarousel';
import parseChordString from './ChordParser';
import { ChordRowObject, scalesForChordRowObject } from './ChordRow'
// import ColorWheel from './ColorWheel';
import Steps, { Step } from './Steps'
import New from './Steps/New';
import ChooseKey from './Steps/ChooseKey';
import Edit from './Steps/Edit';
import { parseStringifiedChordRowObject, csvifyChordRowObjects, parseCsvifiedChordRowObjects } from './JsonCondenser'
import { MonochromaticPossibleRootScale, regenerateMonochromaticSchemes } from './ScaleColorer';
import { CHROMATIC_NOTES, PossibleRootScale } from './ChordMapper';

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
  const [query, setQuery] = useQueryParams({
    a: withDefault(ArrayParam, undefined),
    c: withDefault(StringParam, csvifyChordRowObjects([createChordRowObject()])),
    t: withDefault(StringParam, ''),
    i: withDefault(NumberParam, -1),
    s: withDefault(NumberParam, 0),
  });
  const { a, c, t, i, s } = query;

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

  const [stepIndex, setStepIndex] = useState(s);

  useEffect(() => {
    setQuery(
      { s: stepIndex },
      'pushIn'
    )
  }, [stepIndex]);

  const [rgbValues, setRgbValues] = useState([50, 241, 255]);

  const [redRgbValue, greenRgbValue, blueRgbValue] = rgbValues;

  const [monochromaticSchemes, setMonochromaticSchemes] = useState<{ [key in MonochromaticPossibleRootScale]: string }[]>(
    regenerateMonochromaticSchemes(redRgbValue, greenRgbValue, blueRgbValue)
  );

  const [globalKeyNote, setGlobalKeyNote] = useState('');
  const [globalKeyScale, setGlobalKeyScale] = useState('');

  const applyGlobalKey = () => {
    if (globalKeyNote === '' || globalKeyScale === '') return;
    if (CHROMATIC_NOTES.find(chromaticNoteArray => chromaticNoteArray.includes(globalKeyNote)) == undefined) return;
    if (!((Object.keys(PossibleRootScale) as [keyof typeof PossibleRootScale]).find(key => PossibleRootScale[key] === globalKeyScale))) return;

    let newChordRows = chordRowObjects.slice();
    newChordRows.forEach((chordRowObject) => {
      if (!chordRowObject.selectedScale && !chordRowObject.selectedScaleRoot) {
        const matchingScale = scalesForChordRowObject(chordRowObject)
          .find(({ rootScale, rootScaleNote }) => rootScale === globalKeyScale && rootScaleNote === globalKeyNote);

        if (matchingScale != undefined) {
          chordRowObject.selectedScaleRoot = matchingScale.scaleNotes[0];
          chordRowObject.selectedScale = matchingScale.scaleName;
        }
      }

      return chordRowObject;
    });

    setChordRowObjects(newChordRows);
  };

  useEffect(() => {
    setMonochromaticSchemes(regenerateMonochromaticSchemes(redRgbValue, greenRgbValue, blueRgbValue));
  }, rgbValues);

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
          setChordRowObjects(newChordRows);
          setStepIndex(1);
        } else alert('no song found');
      }
      reader.onerror = () => {
        alert('error reading file');
      }
    })
  }

  const addRows = (numNewChordRows: number) => {
    if (numNewChordRows < 0) {
      setChordRowObjects(chordRowObjects => chordRowObjects.slice(0,numNewChordRows))
    } else {
      const numNewChordRowsArray: Array<ChordRowObject> = [...Array(numNewChordRows)].map(() => createChordRowObject())
      setChordRowObjects(chordRowObjects => [...chordRowObjects, ...numNewChordRowsArray])
    }
  }

  const renderStep = (stepIndex: number): React.ReactElement => {
    switch(Steps[stepIndex]) {
      case Step.k:
        return (
          <ChooseKey
            setGlobalKeyNote={setGlobalKeyNote}
            setGlobalKeyScale={setGlobalKeyScale}
            applyGlobalKey={applyGlobalKey}
          />
        );
      case Step.e:
        return (
          <Edit
            chordRowObjects={chordRowObjects}
            handleRowChange={handleRowChange}
            toggleExpandedRow={toggle}
            addRows={addRows}
            monochromaticSchemes={monochromaticSchemes}
          />
        );
      default:
        return (
          <New handleFiles={handleFiles} />
        );
    }
  }

  return (
    <div className="App">
      <header className="App-header flex-row justify-content-between">
        {
          stepIndex > 0 && (
            <MdKeyboardArrowLeft onClick={() => setStepIndex(stepIndex - 1) } />
          )
        }
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
            monochromaticSchemes={monochromaticSchemes}
            setExpandedRowIndex={setExpandedRowIndex}
            onRowChange={handleRowChange}
            toggle={toggle}
          />
        ) : (
        <Container fluid>
          {renderStep(stepIndex)}
          {/* <Row>
            <Col xs={2}>
              <SketchPicker
                width="100"
                className="m-0"
                color={ `rgb(${redRgbValue},${greenRgbValue},${blueRgbValue})` }
                onChangeComplete={(color, _) => setRgbValues([color.rgb.r, color.rgb.g, color.rgb.b])}
              />
            </Col>
            <ColorWheel monochromaticSchemes={monochromaticSchemes} />
          </Row> */}
        </Container>
        )
      }
    </div>
  );
}

export default App;
