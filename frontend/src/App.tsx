import React, { ChangeEvent, useEffect, useRef, useState, Fragment } from 'react';
import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';
import {
  useQueryParams,
  ArrayParam,
  NumberParam,
  StringParam,
  withDefault,
} from 'use-query-params';
// import { SketchPicker } from 'react-color';
import { MdCheck, MdHome, MdKeyboardArrowLeft } from 'react-icons/md';
import useSound from 'use-sound';

const iRealReader = require('ireal-reader');

import './App.css';
import ChordCarousel from './ChordCarousel';
import parseChordString from './ChordParser';
import { ChordRowObject, ChordRowObjectRequiredKeys, scalesForChordRowObject } from './ChordRow'
// import ColorWheel from './ColorWheel';
import Steps, { Step } from './Steps'
import New from './Steps/New';
import ChooseKey, { TransposingKeys } from './Steps/ChooseKey';
import Edit from './Steps/Edit';
import { parseStringifiedChordRowObject, csvifyChordRowObjects, parseCsvifiedChordRowObjects } from './JsonCondenser'
import { MonochromaticPossibleRootScale, regenerateMonochromaticSchemes } from './ScaleColorer';
import { CHROMATIC_NOTES, PossibleRootScale } from './ChordMapper';
import PlayAlong from './Steps/PlayAlong';
import PlaybackControls from './PlayAlong/PlaybackControls';
import { rawToMeasures } from './RawIRealParser';
import rawToSong from './RawParser';

const HighClickFile = '../static/AudioClips/high_click.mp3';
const LowClickFile = '../static/AudioClips/low_click.mp3';

const defaultBpm = 100;

const createChordRowObject = (): ChordRowObject => {
  return { chordQuality: '' } as ChordRowObject;
}

interface Song {
  title: string;
  key?: string;
  bpm?: number;
  music: {
    measures: Array<Array<string>>;
    raw: string;
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

export interface MeasureInfo {
  beatsPerMeasure: number;
  subdivisions: number;
  chordCount: number;
}

const mapMemoizedMeasuresToMeasureInfos = (memoizedMeasures: number[]): MeasureInfo[] => {
  return memoizedMeasures.map((memoizedMeasure) => {
    if (memoizedMeasure < 10) return {
      chordCount: memoizedMeasure,
      beatsPerMeasure: 4,
      subdivisions: 4
    }; // backward compatibility
    const memoizedMeasureString = memoizedMeasure.toString();
    const chordCount = parseInt(memoizedMeasureString.slice(0, -2));
    const memoizedTimeSignature = memoizedMeasureString.slice(-2);
    const [beatsPerMeasure, subdivisions] = memoizedTimeSignature.startsWith('12') ? [12, 8] : [parseInt(memoizedTimeSignature[0]), parseInt(memoizedTimeSignature[1])];
    return {
      beatsPerMeasure,
      subdivisions,
      chordCount,
    };
  });
}

const beatIndexToMeasureIndex = (measureInfos: MeasureInfo[], beatIndex: number): number => {
  let runningBeatIndex = 0;
  return measureInfos.findIndex((measureInfo: MeasureInfo) => {
    runningBeatIndex += measureInfo.beatsPerMeasure;
    return beatIndex < runningBeatIndex;
  })
}

const beatIsOnNewMeasure = (measureInfos: MeasureInfo[], beatIndex: number): boolean => {
  if (beatIndex === 0) return true;
  let runningBeatIndex = 0;
  return measureInfos.some((measureInfo: MeasureInfo) => {
    runningBeatIndex += measureInfo.beatsPerMeasure;
    return beatIndex === runningBeatIndex;
  })
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
    b: withDefault(NumberParam, defaultBpm),
  });
  const { a, c, t, i, s, m, k, b } = query;

  const startingChordRowObjects = (c) ? parseCsvifiedChordRowObjects(c) : (a as Array<string> || []).map(parseStringifiedChordRowObject);
  const [chordRowObjects, setChordRowObjects] = useState(startingChordRowObjects);
  if (a) setQuery({ a: undefined }, 'pushIn');
  if (c === '') setQuery({ c: csvifyChordRowObjects(chordRowObjects) }, 'pushIn');

  const [measures, setMeasures] = useState(m.split('.').map((index: string) => parseInt(index)));
  const [measureInfos, setMeasureInfos] = useState(mapMemoizedMeasuresToMeasureInfos(measures));
  let runningSum = 0;
  measureInfos.forEach((measureInfo) => {
    runningSum += measureInfo.beatsPerMeasure;
  })
  const [totalSongBeatCount, setTotalSongBeatCount] = useState(runningSum);
  useEffect(() => {
    const newMeasureInfos = mapMemoizedMeasuresToMeasureInfos(measures);
    setMeasureInfos(newMeasureInfos);
    let runningSum = 0;
    newMeasureInfos.forEach((measureInfo) => {
      runningSum += measureInfo.beatsPerMeasure;
    })
    setTotalSongBeatCount(runningSum);
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

    if (tranpositionChange == 0) return;

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

  const beatsPerMeasure = 4 // TODO: get from import

  const [bpm, setBpm] = useState(b);

  const [isPlaying, setIsPlaying] = useState(false);
  const [metronomeInterval, setMetronomeInterval] = useState<NodeJS.Timeout | undefined>(undefined);
  const startingMetronomeBeat = -1
  const [metronomeBeatCount, setMetronomeBeatCount] = useState(startingMetronomeBeat);

  const [metronomeMeasureCount, setMetronomeMeasureCount] = useState(beatIndexToMeasureIndex(measureInfos, metronomeBeatCount));
  useEffect(() => {
    setMetronomeMeasureCount(beatIndexToMeasureIndex(measureInfos, metronomeBeatCount));
  }, [metronomeBeatCount, measureInfos])

  const [metronomeCountIn, setMetronomeCountIn] = useState(0);

  const [playHighClick] = useSound(HighClickFile);
  const [playLowClick] = useSound(LowClickFile);

  const incrementMetronomeCount = () => {
    setMetronomeCountIn((oldCountIn: number) => {
      if (oldCountIn > 1) {
        playLowClick();
        return (oldCountIn - 1);
      } else {
        setMetronomeBeatCount((beat: number) => {
          const newBeat = (beat + 1) % totalSongBeatCount;
          beatIsOnNewMeasure(measureInfos, newBeat) ? playHighClick() : playLowClick();
          return newBeat;
        });
        return 0;
      }
    })
  }

  const startPlayback = () => {
    setIsPlaying(true);
    setMetronomeCountIn(measureInfos[0].beatsPerMeasure || 4);
    const newInterval = setInterval(incrementMetronomeCount, (60 / bpm) * 1000);
    setMetronomeInterval(newInterval);
    playLowClick();
  }
  const pausePlayback = () => {
    setIsPlaying(false);
    if (metronomeInterval) clearInterval(metronomeInterval);
  }

  useEffect(() => {
    if (metronomeInterval) clearInterval(metronomeInterval);
    if (isPlaying) {
      const newInterval = setInterval(incrementMetronomeCount, (60 / bpm) * 1000);
      setMetronomeInterval(newInterval);
    }
    setQuery({
      b: bpm
    }, 'pushIn');
  }, [bpm]);

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

  const handleRowChange = (rowIndex: number, newValue: string, key: ChordRowObjectRequiredKeys): void => {
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
          const parsedSongCustom = rawToSong(newSong.music.raw);
          console.warn(parsedSongCustom);
          let newChordRows = parsedSongCustom.measures.flatMap(({ chords }): ChordRowObject[] => {
            return chords.map(({ chordString, beats }) => {
              const parsedChordString = chordString ? parseChordString(chordString) : ['N.C', '', ''];

              const result = beats ? { beats } : {}

              return {
                chordNote: parsedChordString[0],
                chordQuality: parsedChordString[1],
                bassNote: parsedChordString[2],
                selectedScale: '',
                selectedScaleRoot: '',
                availableTensions: '',
                ...result
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

          const newMeasures = parsedSongCustom.measures.map(({ chords, timeSignature }) => parseInt(`${chords.length}${timeSignature}`));

          clearTransposingKey();
          setMeasures(newMeasures);
          setChordRowObjects(newChordRows);
          if (newSong.bpm) setBpm(newSong.bpm);
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
    setBpm(defaultBpm);
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
            measureInfos={measureInfos}
            monochromaticSchemes={monochromaticSchemes}
            measurePlaybackIndex={metronomeMeasureCount}
            metronomeCountIn={metronomeCountIn}
            isPlaying={isPlaying}
            pause={() => pausePlayback()}
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

  const renderFooter = (stepIndex: number): React.ReactElement | null => {
    switch(Steps[stepIndex]) {
      case Step.e:
        return (
          <Fragment>
            <MdKeyboardArrowLeft className="mx-2" onClick={() => navigateToPreviousStep()} />
            <span className="mx-auto">
              <div className="py-2">
                Edit the keys
              </div>
            </span>
            <MdCheck className="mx-2" onClick={() => navigateToNextStep()} />
          </Fragment>
        );
      case Step.s:
        return (
          <PlaybackControls
            bpm={bpm}
            incrementBpm={(amount) => { setBpm(bpm + amount)}}
            isPlaying={isPlaying}
            play={() => startPlayback()}
            pause={() => pausePlayback()}
            restartMetronome={() => setMetronomeBeatCount(startingMetronomeBeat)}
          />
        );
      default:
        return null;
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
        <Row className="App-footer flex-row justify-content-center">
          {renderFooter(stepIndex)}
        </Row>

      </Container>
    </div>
  );
}

export default App;
