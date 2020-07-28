import React from 'react';
import { Container, Row, Col, FormGroup, Label, Input } from 'reactstrap';
import './App.css';
import scalesForChord, { NamedScale } from './ChordMapper'

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://backend.localhost';

const fetchContent = async (updateContent: (content: string) => void) => {
  const response = await fetch(`${BACKEND_API_URL}/greetings/hello`,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  updateContent(data.content);
};

const chords = [
  ['A', '-'],
  ['A', '^'],
]

const App: React.FC = () => {
  const [content, updateContent] = React.useState('Waiting for a response from Rails...');

  const [chordNote, setChordNote] = React.useState('A');
  const [chordQuality, setChordQuality] = React.useState('-');

  React.useEffect(() => {
    fetchContent(updateContent);
  }, []);

  const scales = (chordNote && chordQuality && scalesForChord(chordNote, chordQuality)) || [];

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {content}
        </p>
      </header>
      <Container>
        <Row>
          <Col>
            <form onSubmit={() => {}}>
              <div>
                <label>
                  Chord Note:
                  <input
                    type="text"
                    value={chordNote}
                    onChange={e => setChordNote(e.target.value)}
                  />
                </label>
              </div>
              <div>
                <label>
                  Chord:
                  <input
                    type="text"
                    value={chordQuality}
                    onChange={e => setChordQuality(e.target.value)}
                  />
                </label>
              </div>
            </form>
          </Col>
          <Col>
            {scales.map(
              (namedScale: NamedScale, index: number) => (
                <div key={`scale-${index}`}>
                  <p>
                    {chordNote}{chordQuality} {namedScale.scaleName}: {namedScale.scaleNotes.join(',')}
                    <br />
                    <small>{namedScale.rootScaleNote} {namedScale.rootScale}</small>
                  </p>
                </div>
              )
            )}
          </Col>
          <Col>
            <FormGroup>
              <Label for="exampleSelect">Select</Label>
              <Input type="select" name="select" id="exampleSelect">
                <option>--</option>
                {scales.map(
                  (namedScale: NamedScale, index: number) => (
                    <option key={`option--scale-${index}`}>
                      {namedScale.rootScaleNote} {namedScale.rootScale}: {chordNote} {namedScale.scaleName}: {namedScale.scaleNotes.join(',')}
                    </option>
                  )
                )}
              </Input>
            </FormGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
