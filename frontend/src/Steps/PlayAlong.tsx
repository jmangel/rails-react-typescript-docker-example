import React from 'react';
import { MdAddCircle, MdRemoveCircle } from 'react-icons/md';
import { Col, Modal, ModalBody, Row } from "reactstrap";
import { MeasureInfo } from '../App';
import { NamedScale } from '../ChordMapper';
import ChordRow, { ChordRowObject, scalesForChordRowObject } from '../ChordRow';
import scaleToHexColor, { MonochromaticPossibleRootScale } from '../ScaleColorer';

const PlayAlong: React.FC<{
  chordRowObjects: ChordRowObject[],
  measureInfos: MeasureInfo[],
  monochromaticSchemes: { [key in MonochromaticPossibleRootScale]: string }[],
  measurePlaybackIndex: number,
  metronomeCountIn: number,
  isPlaying: boolean,
  pause: () => void,
}> = ({
  chordRowObjects,
  measureInfos,
  monochromaticSchemes,
  measurePlaybackIndex,
  metronomeCountIn,
  isPlaying,
  pause,
}) => {
let copiedChordRows = chordRowObjects.slice();
  return (
    <div
      className="d-flex flex-grow-1 align-items-center"
    >
      <Row
        style={{minWidth: '100%'}} // unclear why this is needed Play-Along step on desktop, it's a lazy hack
      >
        {
          (isPlaying && metronomeCountIn > 0) && (
            <Modal
              toggle={() => pause()}
              isOpen
              fade={false}
              centered
              backdropClassName="play-along--count-in-modal--backdrop"
              contentClassName="play-along--count-in-modal--content"
            >
              <ModalBody
                className="d-flex justify-content-center border-0"
                style={{ fontSize: '19em' }}
              >
                  {metronomeCountIn}
              </ModalBody>
            </Modal>
          )
        }

        {
          measureInfos.map((memoizedMeasure: MeasureInfo, index: number) => {
            const { chordCount, beatsPerMeasure } = memoizedMeasure;
            const measureChords = copiedChordRows.slice(0, chordCount);
            copiedChordRows = copiedChordRows.slice(chordCount);

            let uniformColumnSize: number | null;
            if (measureChords.every((measureChord: ChordRowObject) => measureChord.beats === measureChords[0].beats)) uniformColumnSize = 12 / measureChords.length;

            return (
              <Col xs={3}>
                <Row className="p-1 h-100">
                  {measureChords.map((chordRowObject: ChordRowObject) => {
                    const { chordNote, chordQuality, bassNote, selectedScale, selectedScaleRoot, beats } = chordRowObject;
                    const scales = scalesForChordRowObject(chordRowObject);

                    const selectedNamedScale = scales.find((namedScale: NamedScale) => namedScale.scaleName === selectedScale && (
                      namedScale.scaleNotes[0] === (selectedScaleRoot || chordNote)
                    ));

                    let borderColor = '';
                    if (selectedNamedScale) {
                      borderColor = scaleToHexColor(selectedNamedScale.rootScale, selectedNamedScale.rootScaleNote, monochromaticSchemes);
                    }

                    const style = borderColor ? { borderTop: `3px solid ${borderColor}` } : { borderTop: `3px solid transparent`};

                    const activeMeasureStyle = measurePlaybackIndex === index ? {
                      backgroundColor: 'white', color: 'black'
                    } : {
                      backgroundColor: 'rgb(255,255,255,0.2)'
                    }

                    const parsedNumSpaces = parseInt(beats);
                    // use uniformColumnSize if present, otherwise calculate against beatsPerMeasure
                    // TODO: the expression `(parsedNumSpaces * (12 / beatsPerMeasure))` doesn't work as
                    // expected because a 12-beat measure might still only have 4 chords in iReal Pro
                    const colProps = parsedNumSpaces ? { xs: (uniformColumnSize || (parsedNumSpaces * (12 / beatsPerMeasure))) } : {}

                    return (
                      <Col className="px-0 play-along--chord" style={{...style, ...activeMeasureStyle }} {...colProps}>
                        <Row className="d-flex flex-row-reverse mr-1" style={{ fontSize: '1em', lineHeight: 1 }}>
                          <div>
                            {chordQuality}
                          </div>
                        </Row>
                        <Row className="d-flex justify-content-center py-0" style={{ fontSize: '1.5em', lineHeight: 1 }}>
                          {/* <div> */}
                            {chordNote}
                          {/* </div> */}
                        </Row>
                        <Row className="d-flex flex-row-reverse mr-1" style={{ fontSize: '1em', lineHeight: 1 }}>
                          {bassNote || (<br />) }
                        </Row>
                      </Col>
                    );
                  })}
                </Row>
              </Col>
            );
          })
        }
      </Row>
    </div>
  );
}

export default PlayAlong;
