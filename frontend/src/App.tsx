import React from 'react';
import { Container, Button, Row, Input } from 'reactstrap';
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
  const [newChordRows, setNewChordRows] = React.useState(1);

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
        <Row className='w-25 mx-auto border'>
          <Button onClick={() => setChordRows(chordRows + newChordRows)}>Add</Button>
          <Input
            type="number"
            name="newChordRows"
            value={newChordRows}
            onChange={e => setNewChordRows(parseInt(e.target.value))}
            className='w-25 mx-2'
            inline
          />
          Row(s)
        </Row>
      </Container>
    </div>
  );
}

export default App;
