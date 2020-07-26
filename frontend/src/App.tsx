import React, { Fragment } from 'react';
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

  React.useEffect(() => {
    fetchContent(updateContent);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {content}
        </p>
        {
          chords.map((chord) => (
            <Fragment>
              <h4>{chord}</h4>
              {scalesForChord(chord[0], chord[1]).map((namedScale: NamedScale) => {return (
                <p>{chord} {namedScale.scaleName}: {namedScale.scaleNotes.join(',')}</p>
              )})}
            </Fragment>
          ))
        }
      </header>
    </div>
  );
}

export default App;
