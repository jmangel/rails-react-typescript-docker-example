import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  Button,
  Col,
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
import { MdHome, MdKeyboardArrowLeft } from 'react-icons/md';

const iRealReader = require('ireal-reader');

import './App.css';
import ChordCarousel from './ChordCarousel';
import parseChordString from './ChordParser';
import { ChordRowObject, scalesForChordRowObject } from './ChordRow'
// import ColorWheel from './ColorWheel';
import Steps, { Step } from './Steps'
import New from './Steps/New';
import ChooseKey, { TransposingKeys } from './Steps/ChooseKey';
import Edit from './Steps/Edit';
import { parseStringifiedChordRowObject, csvifyChordRowObjects, parseCsvifiedChordRowObjects } from './JsonCondenser'
import { MonochromaticPossibleRootScale, regenerateMonochromaticSchemes } from './ScaleColorer';
import { CHROMATIC_NOTES, PossibleRootScale } from './ChordMapper';
import PlayAlong from './Steps/PlayAlong';

const createChordRowObject = (): ChordRowObject => {
  return { chordQuality: '' } as ChordRowObject;
}

interface Song {
  title: string;
  key?: string;
  music: {
    measures: Array<Array<string>>;
  };
};
const createSongObject = (title: string | null): Song => {
  return { title } as Song;
}

const transposeNote = (note: string, offset: number): string => {
  const chromatic_note_index = CHROMATIC_NOTES.findIndex(chromaticNoteArray => chromaticNoteArray.includes(note));
  if (chromatic_note_index < 0) return note;

  const tranposedNote = CHROMATIC_NOTES[(12 + chromatic_note_index + offset) % 12][0];

  return tranposedNote;
}

const App: React.FC = () => {
  const [query, setQuery] = useQueryParams({
    a: withDefault(ArrayParam, undefined),
    c: withDefault(StringParam, csvifyChordRowObjects([createChordRowObject()])),
    t: withDefault(StringParam, ''),
    i: withDefault(NumberParam, -1),
    s: withDefault(NumberParam, 0),
    m: withDefault(StringParam, '0'),
    k: withDefault(StringParam, '0'),
  });
  const { a, c, t, i, s, m, k } = query;

  const startingChordRowObjects = (c) ? parseCsvifiedChordRowObjects(c) : (a as Array<string> || []).map(parseStringifiedChordRowObject);
  const [chordRowObjects, setChordRowObjects] = useState(startingChordRowObjects);
  if (a) setQuery({ a: undefined }, 'pushIn');
  if (c === '') setQuery({ c: csvifyChordRowObjects(chordRowObjects) }, 'pushIn');

  const [measures, setMeasures] = useState(m.split('.').map((index: string) => parseInt(index)));
  useEffect(() => {
    setQuery(
      { m: measures.join('.') },
      'pushIn'
    )
  }, [measures]);

  const prevChordRowObjectsCountRef: React.MutableRefObject<number> = useRef(chordRowObjects.length);
  useEffect(() => {
    setQuery(
      { c: csvifyChordRowObjects(chordRowObjects) },
      'pushIn'
    )

    if (chordRowObjects.length > prevChordRowObjectsCountRef.current) {
      const chordRowHeight = document.querySelector('.chord-row')?.clientHeight;
      chordRowHeight && window.scrollBy(0, chordRowHeight * (chordRowObjects.length - prevChordRowObjectsCountRef.current));
    }

    prevChordRowObjectsCountRef.current = chordRowObjects.length;
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

  const [transposingKey, setTranposingKey] = useState<TransposingKeys>(k as TransposingKeys);

  useEffect(() => {
    const tranpositionChange = parseInt(transposingKey) - parseInt(k);

    setQuery(
      { k: transposingKey },
      'pushIn'
    );

    let newChordRows = chordRowObjects.slice();

    newChordRows.forEach((chordRowObject) => {
      const { chordNote, bassNote, selectedScaleRoot } = chordRowObject;
      if (chordNote) {
        chordRowObject.chordNote = transposeNote(chordNote, tranpositionChange);
      }
      if (bassNote) {
        chordRowObject.bassNote = transposeNote(bassNote, tranpositionChange);
      }
      if (selectedScaleRoot) {
        chordRowObject.selectedScaleRoot = transposeNote(selectedScaleRoot, tranpositionChange);
      }
    })
    setChordRowObjects(newChordRows);
  }, [transposingKey]);


  const [rgbValues, setRgbValues] = useState([50, 241, 255]);

  const [redRgbValue, greenRgbValue, blueRgbValue] = rgbValues;

  const [monochromaticSchemes, setMonochromaticSchemes] = useState<{ [key in MonochromaticPossibleRootScale]: string }[]>(
    regenerateMonochromaticSchemes(redRgbValue, greenRgbValue, blueRgbValue)
  );

  const processGlobalKey = (keyNote: string, keyScale: string, chordRows: ChordRowObject[]) => {
    keyNote = keyNote.charAt(0).toUpperCase() + keyNote.slice(1).toLowerCase();

    if (keyNote === '' || keyScale === '') return;
    const chromatic_note_index = CHROMATIC_NOTES.findIndex(chromaticNoteArray => chromaticNoteArray.includes(keyNote!.trim()));
    if (chromatic_note_index < 0) return;
    if (!((Object.keys(PossibleRootScale) as [keyof typeof PossibleRootScale]).find(key => PossibleRootScale[key] === keyScale))) return;

    let newChordRows = chordRows.slice();
    newChordRows.forEach((chordRowObject) => {
      if (!chordRowObject.selectedScale && !chordRowObject.selectedScaleRoot) {
        const matchingScale = scalesForChordRowObject(chordRowObject)
          .find(({ rootScale, rootScaleNote }) => rootScale === keyScale && CHROMATIC_NOTES.findIndex(noteArray => noteArray.includes(rootScaleNote)) === chromatic_note_index);

        if (matchingScale != undefined) {
          chordRowObject.selectedScaleRoot = matchingScale.scaleNotes[0];
          chordRowObject.selectedScale = matchingScale.scaleName;
        }
      }

      return chordRowObject;
    });

    return newChordRows;
  };

  const fillWithKey = (keyNote: string, keyScale: string) => {
    const newChordRows = processGlobalKey(keyNote, keyScale, chordRowObjects);

    if (newChordRows) setChordRowObjects(newChordRows);
  }

  useEffect(() => {
    setMonochromaticSchemes(regenerateMonochromaticSchemes(redRgbValue, greenRgbValue, blueRgbValue));
  }, rgbValues);

  const handleRowChange = (rowIndex: number, newValue: string, key: keyof ChordRowObject): void => {
    let newChordRows = chordRowObjects.slice()
    newChordRows[rowIndex][key] = newValue
    setChordRowObjects(newChordRows)
  }

  const navigateToNextStep = () => {
    setStepIndex(stepIndex + 1);
  }

  const navigateToFirstStep = () => {
    setStepIndex(0);
  }

  const navigateToPreviousStep = () => {
    setStepIndex(stepIndex - 1);
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

        console.warn(playlist.songs);
        const newSong: Song = playlist.songs[0];
        if (newSong) {
          setSong(newSong);
          let newChordRows = newSong.music.measures.flatMap((measures) => {
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
          });

          if (newSong.key) {
            const splitKey = newSong.key.split('-');
            let keyNote = splitKey[0];
            if (splitKey[1] === '') {
              // convert to relative major
              const minorIndex = CHROMATIC_NOTES.findIndex((chromaticNote) => chromaticNote.includes(keyNote));
              const relativeMajorIndex = (minorIndex + 3) % 12;
              keyNote = CHROMATIC_NOTES[relativeMajorIndex][0];
            }

            const processedNewChordRows = processGlobalKey(keyNote, 'major', newChordRows);
            if (processedNewChordRows) newChordRows = processedNewChordRows;
          }

          const newMeasures = newSong.music.measures.map((measures) => measures.length);

          clearTransposingKey();
          setMeasures(newMeasures);
          setChordRowObjects(newChordRows);
          navigateToNextStep();
        } else alert('no song found');
      }
      reader.onerror = () => {
        alert('error reading file');
      }
    })
  }

  const clearTransposingKey = () => {
    setTranposingKey(TransposingKeys.C);
  }

  const startNewSong = () => {
    const newChordRows = [createChordRowObject()];
    clearTransposingKey();
    setChordRowObjects(newChordRows);
    setSong(createSongObject(''));
    navigateToNextStep();
  }

  const addRows = (numNewChordRows: number) => {
    if (numNewChordRows < 0) {
      setChordRowObjects(chordRowObjects => chordRowObjects.slice(0,numNewChordRows))
    } else {
      const numNewChordRowsArray: Array<ChordRowObject> = [...Array(numNewChordRows)].map(() => createChordRowObject())
      setChordRowObjects(chordRowObjects => [...chordRowObjects, ...numNewChordRowsArray])
    }
  }

  const hasSongInProgress = (chordRowObjects: ChordRowObject[]): boolean => {
    return chordRowObjects.some(({ chordNote, chordQuality, bassNote }) => !!(chordNote || chordQuality || bassNote));
  }

  const renderStep = (stepIndex: number): React.ReactElement => {
    switch(Steps[stepIndex]) {
      case Step.k:
        return (
          <ChooseKey
            navigateToNextStep={navigateToNextStep}
            setTransposingInstrument={(newKey) => setTranposingKey(newKey)}
            transposingKey={transposingKey}
          />
        );
      case Step.e:
        return (
          <Edit
            chordRowObjects={chordRowObjects}
            fillWithKey={fillWithKey}
            handleRowChange={handleRowChange}
            addRows={addRows}
            monochromaticSchemes={monochromaticSchemes}
            navigateToNextStep={navigateToNextStep}
            navigateToPreviousStep={navigateToPreviousStep}
          />
        );
      case Step.s:
        return (
          <PlayAlong
            chordRowObjects={chordRowObjects}
            measures={measures}
            monochromaticSchemes={monochromaticSchemes}
          />
        );
      default:
        return (
          <New
            allowContinue={hasSongInProgress(chordRowObjects)}
            handleFiles={handleFiles}
            startNewSong={startNewSong}
            navigateToNextStep={navigateToNextStep}
          />
        );
    }
  }

  return (
    <div className="App">
      <Container fluid className="d-flex flex-column h-100">
        <header className="App-header flex-row justify-content-center">
          {
            stepIndex > 0 && (
              <MdKeyboardArrowLeft className="mx-2" onClick={() => navigateToPreviousStep()} />
            )
          }
          <span className="mx-auto">
            {song.title || 'Untitled Song'}
          </span>
          {
            stepIndex > 0 && (
              <MdHome className="mx-2" onClick={() => navigateToFirstStep()} />
            )
          }
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
          ) : renderStep(stepIndex)
        }
      </Container>
    </div>
  );
}

export default App;
