import React from 'react';
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

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {content}
        </p>
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
          {chordNote && chordQuality && scalesForChord(chordNote, chordQuality).map(
            (namedScale: NamedScale, index: number) => (
              <div key={`scale-${index}`}>
                <p>{chordNote}{chordQuality} {namedScale.scaleName}: {namedScale.scaleNotes.join(',')}</p>
                <small>{namedScale.rootScaleNote} {namedScale.rootScale}</small>
              </div>
            )
          )}
      </header>
    </div>
  );
}

export default App;
