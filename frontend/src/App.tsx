import React from 'react';
import { Container, Row, Col, FormGroup, Label, Input } from 'reactstrap';
import './App.css';
import ChordRow from './ChordRow'

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

const App: React.FC = () => {
  const [content, updateContent] = React.useState('Waiting for a response from Rails...');

  const [chordRows, setChordRows] = React.useState(1);

  React.useEffect(() => {
    fetchContent(updateContent);
  }, []);

  React.useEffect(() => {
    fetchContent(updateContent);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {content}
        </p>
      </header>
      <Container>
        {[...Array(chordRows)].map(() => <ChordRow></ChordRow>)}
      </Container>
      <button onClick={() => setChordRows(chordRows + 1)}>
        Add a Row
      </button>
    </div>
  );
}

export default App;
