import React from 'react';
import { MdAddCircle, MdRemoveCircle } from 'react-icons/md';
import { Col, Modal, ModalBody, Row } from "reactstrap";
import { NamedScale } from '../ChordMapper';
import ChordRow, { ChordRowObject, scalesForChordRowObject } from '../ChordRow';
import scaleToHexColor, { MonochromaticPossibleRootScale } from '../ScaleColorer';

const PlayAlong: React.FC<{
  chordRowObjects: ChordRowObject[],
  measures: number[],
  monochromaticSchemes: { [key in MonochromaticPossibleRootScale]: string }[],
  measurePlaybackIndex: number,
  metronomeCountIn: number,
  isPlaying: boolean,
  pause: () => void,
}> = ({
  chordRowObjects,
  measures,
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
          measures.map((chordCount: number, index: number) => {
            const measureChords = copiedChordRows.slice(0, chordCount);
            copiedChordRows = copiedChordRows.slice(chordCount);

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

                    const alignmentClassNames = 'd-flex align-items-center justify-content-center'

                    const className = `px-0 border-left border-right border-bottom ${alignmentClassNames} ${!borderColor ? 'border-top' : ''}`;
                    const style = borderColor ? { borderTop: `3px solid ${borderColor}` } : {};

                    const activeMeasureStyle = measurePlaybackIndex === index ? {
                      backgroundColor: 'white', color: 'black'
                    } : {
                      backgroundColor: 'rgb(255,255,255,0.2)'
                    }

                    const colProps = beats ? { xs: beats*3 } : {} // TODO: make sure `xs: beats*3` is made flexible to other time signatures

                    return (
                      <Col className={className} style={{...style, ...activeMeasureStyle}} {...colProps}>
                        {chordNote}
                        <br />
                        {chordQuality}
                        <br />
                        {bassNote}
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
