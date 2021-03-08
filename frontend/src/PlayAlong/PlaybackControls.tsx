import React from 'react';
import { IoPlayBackSharp, IoPlayForwardSharp, IoPlaySharp } from 'react-icons/io5';
import { GiMetronome } from 'react-icons/gi';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { Col, Row } from "reactstrap";

const PlaybackControls: React.FC = () => {
  const bpm = 100;
  return (
    <Col className="pt-4">
      <Row className="playback-controls--row">
          <BiMinus />
          <div className="align-items-center d-flex">
            <GiMetronome size="2em" />
            <span>
              {bpm} BPM
            </span>
          </div>
          <BiPlus/>
      </Row>
      <Row className="playback-controls--row">
        <IoPlayBackSharp size="2em" />
        <IoPlaySharp size="2em" />
        <IoPlayForwardSharp size="2em" />
      </Row>
    </Col>
  );
}

export default PlaybackControls;
