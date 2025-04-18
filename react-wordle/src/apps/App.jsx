import React, { useState, useEffect } from 'react';
import '../styling/boardStyles.css';
import '../styling/modalStyles.css';
import '../styling/displayStyles.css';
import Board from '../components/Board';
import Modal from '../components/Modal';
import LetterDisplay from '../components/LetterDisplay';

const App = () => {
  const [guesses, setGuesses] = useState(Array(6).fill(Array(5).fill('')));
  const [storedAttempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [asciiToColor, setAscii] = useState(Array(26).fill('b'));
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  // Fetch initial game state from server
  useEffect(() => {
    const fetchGameState = async () => {
      const response =await fetch('http://localhost:5000/api/word/state', {
         method: 'GET',
        credentials: 'include',
        });
    
      const data = await response.json();
      console.log(data);
      setGuesses(data.guesses);
      setAttempts(data.attempts);
      setGameOver(data.gameOver);
      setAscii(data.letterColors);
    };

    fetchGameState();
  }, []);
    
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            submitGuess();
        }
    };
    // Add event listener when component mounts
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);

        // Cleanup when component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);
  const submitGuess = async () => {
 
    const currentGuess = guesses[storedAttempts].join('').toLowerCase();
    console.log("EIUFBIJNEF");
    console.log(currentGuess);
    
    // Send guess to server
   const response = await fetch('http://localhost:5000/api/word/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            
        credentials: 'include',
            body: JSON.stringify({ guess : currentGuess }),
        });

    const data = await response.json();
    if (data.error) {
      showModal(data.error);
    } else {
      setAscii(data.updatedLetterColors);
      setGuesses(data.gameState.guesses);
      setAttempts(data.gameState.attempts);
      setGameOver(data.gameState.gameOver);

      if (data.result === 'ggggg') {
        showModal('You won!');
      }
    }
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      setModalMessage('');
    }, 3500);
  };

const resetGame = () => {
  // Reset all the relevant state values
  setGuesses(Array(6).fill(Array(5).fill('')));
  setAttempts(0);
  setGameOver(false);
  setAscii(Array(26).fill('b'));
};
const resetGameOnServer = async () => {
  await fetch('http://localhost:5000/api/word/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Ensure session is included
  });

  // Optionally reset local state after the server responds
  resetGame();
};
  return (
    <div className="App">
      <h1>Wordle Game</h1>
      <Modal message={modalMessage} onClose={() => setModalVisible(false)} />
      <Board guesses={guesses} setGuesses={setGuesses} attempts={storedAttempts} />
      <LetterDisplay asciiToColor={asciiToColor} />
      <button id="submitGuess" type="submit" onClick={submitGuess}>Enter</button>
    </div>
  );
};

export default App;
