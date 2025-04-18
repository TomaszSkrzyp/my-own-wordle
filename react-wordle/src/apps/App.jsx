//PROJEKT
import React, { useState, useEffect, useRef } from 'react';
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
    const guessesRef = useRef(guesses);

    const attemptsRef = useRef(storedAttempts);
   


    useEffect(() => {
        console.log('Updated attempts in App:',storedAttempts);
        attemptsRef.current = storedAttempts;
    }, [storedAttempts]);
    useEffect(() => {
        console.log('Updated guesses in App:', guesses[storedAttempts]);
        guessesRef.current = guesses;
    }, [guesses]);
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            submitGuess();
        }
    };
    useEffect(() => {
        guessesRef.current = guesses;
    }, [guesses]);

    // Add event listener when component mounts
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);

        // Cleanup when component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);
    // Function to submit the guess
    const submitGuess = async () => {
        // Ensure you're accessing the guesses for the current attempt
         // Log the current attempt guesses
        const attempts = attemptsRef.current;
        const currentGuesses = guessesRef.current;

        const guess = currentGuesses[attempts].join('').toLowerCase();
       
        console.log(storedAttempts);
        if (attempts >= 6 || gameOver) return;
          // Join the current attempt into a word
        if (!guessValidate(guess)) {
            showModal('Not a valid word: '+guess);
            return;
        }

        // Send the guess to the server for validation
        const response = await fetch('http://localhost:5000/api/word/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ guess }),
        });
        

        const data = await response.json();
        console.log("DATA");
        console.log(data);
        if (data.error) {
                showModal(data.error);
        } else {
            colorGuess(data.result, attempts);
            console.log("PO KOLORZE");
            console.log(guessesRef.current);
            if (data.result === 'ggggg') {
                showModal('You won!');
                setGameOver(true);
            } else {
                setAttempts(attempts + 1);
            }
        }
    };
    
    const showModal = (message) => {
        setModalMessage(message);
        setModalVisible(true);

        // Close modal after 1.5 seconds
        setTimeout(() => {
            setModalVisible(false);
            setModalMessage(''); // Reset the message when modal closes
        }, 3500);
    };
    // Function to validate the guess
    const guessValidate = (guess) => {
        //PROJEKT
        const regex = /^[a-z]{5}$/;
        return regex.test(guess);
    };

    const colorGuess = (feedback,attempts) => {
        const colorEnum = {
            g: 'green',
            b: 'gray',
            y: 'yellow',
        };
        const newGuesses = [...guessesRef.current];
        newGuesses[attempts] = newGuesses[attempts].map((letter, index) => ({
            letter: letter,
            color: colorEnum[feedback[index]],
            flipped: true,// Assign color based on feedback

        }));
        setGuesses(newGuesses);
    };
  
  
    

    return (
        <div className="App">
            <h1>Wordle Game</h1>
            <Modal message={modalMessage} onClose={() => setModalVisible(false)} />
            <Board guesses={guesses} setGuesses={setGuesses} attempts={storedAttempts} />

            <LetterDisplay asciiToColor={asciiToColor}  />
            <button id="submitGuess" type="submit" onClick={submitGuess}> Enter </button>
        </div>



    );
};

export default App;
