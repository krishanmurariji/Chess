import { useState } from 'react';
import HomePage from './components/HomePage';
import GamePage from './components/GamePage';
import { PlayMode } from './types/chess';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'game'>('home');
  const [playMode, setPlayMode] = useState<PlayMode>('local');

  const handlePlayOnline = () => {
    setPlayMode('online');
    setCurrentPage('game');
  };

  const handlePlayComputer = () => {
    setPlayMode('computer');
    setCurrentPage('game');
  };

  const handlePlayLocal = () => {
    setPlayMode('local');
    setCurrentPage('game');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  return (
    <>
      {currentPage === 'home' ? (
        <HomePage
          onPlayOnline={handlePlayOnline}
          onPlayComputer={handlePlayComputer}
          onPlayLocal={handlePlayLocal}
        />
      ) : (
        <GamePage playMode={playMode} onBackToHome={handleBackToHome} />
      )}
    </>
  );
}

export default App;
