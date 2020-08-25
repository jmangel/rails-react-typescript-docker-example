import React, { useState } from 'react';
import {
  Button,
  Carousel,
  CarouselControl,
  CarouselIndicators,
  CarouselItem,
  Container,
  Row,
} from 'reactstrap';
import ChordRow, { ChordRowObject } from './ChordRow'

const ChordCarousel: React.FC<{
  expandedRowIndex: number,
  chordRowObjects: Array<ChordRowObject>,
  setExpandedRowIndex: (value: number) => void,
  onRowChange: (rowIndex: number, newValue: string, key: keyof ChordRowObject) => void,
  toggle: (rowIndex: number) => void,
}> = ({
  expandedRowIndex,
  chordRowObjects,
  setExpandedRowIndex,
  onRowChange,
}) => {

  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = expandedRowIndex === chordRowObjects.length - 1 ? 0 : expandedRowIndex + 1;
    setExpandedRowIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = expandedRowIndex === 0 ? chordRowObjects.length - 1 : expandedRowIndex - 1;
    setExpandedRowIndex(nextIndex);
  }

  const goToIndex = (newIndex: number) => {
    if (animating) return;
    setExpandedRowIndex(newIndex);
  }

  const slides = chordRowObjects.map((chordRowObject, rowIndex) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={`carousel--chord-${rowIndex}`}
      >
        <Container className="w-75 px-5 pb-5">
          <ChordRow
            chordRowObject={chordRowObject}
            onRowChange={(newValue: string, key: keyof ChordRowObject) => onRowChange(expandedRowIndex, newValue, key)}
          />
          <Button className="mt-2" color="info" onClick={() => setExpandedRowIndex(-1)}>Close</Button>
        </Container>
      </CarouselItem>
    );
  });

  return (
    <Carousel
      activeIndex={expandedRowIndex}
      next={next}
      previous={previous}
      interval={false}
    >
      <CarouselIndicators className="bg-secondary" items={chordRowObjects} activeIndex={expandedRowIndex} onClickHandler={goToIndex} />
        {slides}
      <CarouselControl className="bg-secondary" direction="prev" directionText="Previous" onClickHandler={previous} />
      <CarouselControl className="bg-secondary" direction="next" directionText="Next" onClickHandler={next} />
    </Carousel>
  );
}

export default ChordCarousel;
