import React from 'react';
import { MdAddCircle, MdRemoveCircle } from 'react-icons/md';
import { Col, Row } from "reactstrap";
import { NamedScale } from '../ChordMapper';
import ChordRow, { ChordRowObject, scalesForChordRowObject } from '../ChordRow';
import scaleToHexColor, { MonochromaticPossibleRootScale } from '../ScaleColorer';

const PlayAlong: React.FC<{
  chordRowObjects: ChordRowObject[],
  measures: number[],
  monochromaticSchemes: { [key in MonochromaticPossibleRootScale]: string }[],
}> = ({
  chordRowObjects,
  measures,
  monochromaticSchemes,
}) => {
let copiedChordRows = chordRowObjects.slice();
  return (
    <div className="d-flex flex-wrap flex-grow-1">
      <Row>

      {
        measures.map((chordCount: number, index: number) => {
          const measureChords = copiedChordRows.slice(0, chordCount);
          copiedChordRows = copiedChordRows.slice(chordCount);

          return (
            <Col xs={3}>
              {measureChords.map((chordRowObject: ChordRowObject) => {
                const { chordNote, chordQuality, bassNote, selectedScale, selectedScaleRoot } = chordRowObject;
                const scales = scalesForChordRowObject(chordRowObject);

                const selectedNamedScale = scales.find((namedScale: NamedScale) => namedScale.scaleName === selectedScale && (
                  namedScale.scaleNotes[0] === (selectedScaleRoot || chordNote)
                ));

                let borderColor = '';
                if (selectedNamedScale) {
                  borderColor = scaleToHexColor(selectedNamedScale.rootScale, selectedNamedScale.rootScaleNote, monochromaticSchemes);
                }

                const className = `border-left border-right border-bottom ${!borderColor ? 'border-top' : ''}`;
                const style = borderColor ? { borderTop: `2px solid ${borderColor}` } : {};

                return (
                  <div className={className} style={style}>
                    {`${chordNote || ""}${chordQuality || ""}${bassNote || ""}`}
                  </div>
                );
              })}
            </Col>
          );
        })
      }
      </Row>
    </div>
  );
}

export default PlayAlong;
