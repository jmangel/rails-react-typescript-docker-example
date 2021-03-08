import React from 'react';
import { IoPauseSharp, IoPlayBackSharp, IoPlayForwardSharp, IoPlaySharp } from 'react-icons/io5';
import { GiMetronome } from 'react-icons/gi';
import { BiMinus, BiPlus } from 'react-icons/bi';
import { Col, Row } from "reactstrap";

const PlaybackControls: React.FC<{
  bpm: number,
  incrementBpm: (amount: number) => void,
  isPlaying: boolean,
  play: () => void,
  pause: () => void,
}> = ({
  bpm,
  incrementBpm,
  isPlaying,
  play,
  pause,
}) => {
  return (
    <Col className="pt-4">
      <Row className="playback-controls--row">
          <BiMinus onClick={() => incrementBpm(-1)} />
          <div className="align-items-center d-flex">
            <GiMetronome size="2em" />
            <span>
              {bpm} BPM
            </span>
          </div>
          <BiPlus onClick={() => incrementBpm(1)} />
      </Row>
      <Row className="playback-controls--row">
        <IoPlayBackSharp size="2em" />
        { isPlaying ? (
            <IoPauseSharp onClick={() => pause()} size="2em" />
          ) : (
            <IoPlaySharp onClick={() => play()}size="2em" />
          )
        }
        <IoPlayForwardSharp size="2em" />
      </Row>
    </Col>
  );
}

export default PlaybackControls;
