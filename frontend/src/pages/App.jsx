import React, { useState, useEffect, useContext } from 'react';
import '../styling/boardStyles.css';
import '../styling/modalStyles.css';
import '../styling/displayStyles.css';
import Board from '../components/Board';
import Modal from '../components/Modal';
import LetterDisplay from '../components/LetterDisplay';
import SolveDisplay from '../components/SolveDisplay';
import { CsrfContext } from '../csrf/CsrfContext';

import { useNavigate } from 'react-router-dom';

const App = () => {

    const [guesses, setGuesses] = useState(Array(6).fill(Array(5).fill('')));
    const [storedAttempts, setAttempts] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [asciiToColor, setAscii] = useState(Array(26).fill('o'));
    const [modalMessage, setModalMessage] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const [solveResult, setSolveResult] = useState(null);

    const [solutionShown, setSolutionShown] = useState(false);




    const navigate = useNavigate();
    const { csrfToken, refreshCsrfToken } = useContext(CsrfContext);

    useEffect(() => {
        if (!csrfToken) {
            console.log("FAILED"); return;
        }
        console.log("CSRF:");
        console.log(csrfToken);
        const fetchGameState = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/word/state', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.status === 403) {
                    console.warn("Access denied. Redirecting to home.");
                    navigate('/'); // or show a message first
                    return;
                }

                const data = await response.json();

                setGuesses(data.gameState.guesses);
                setAttempts(data.gameState.attempts);
                setGameOver(data.gameState.gameOver);
                setAscii(data.gameState.letterColors);
                setIsLoggedIn(data.loggedIn);
            } catch (error) {
                console.error("Error fetching game state:", error);
            }
        };

        fetchGameState();
    }, [csrfToken]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key;
            handleLetterInput(key);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [guesses, storedAttempts, gameOver]);

    const fetchSolve = async () => {

        // Fetch and show
        const response = await fetch('http://localhost:5000/api/word/solve', {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        setSolveResult({ word: data.bestWord, number: data.numberOfWords });

    };
    const toggleSolution = async () => {
        if (!solutionShown) {
            await fetchSolve();
            console.log(solveResult);
            setSolutionShown(true);
        }
        else {

            setSolutionShown(false);
            setSolveResult(null);
        }
    }


    const handleLetterInput = (key) => {

        if (gameOver) return;
        console.log(key);
        // Copy guesses so we can mutate
        const updatedGuesses = guesses.map(row => [...row]);
        const row = updatedGuesses[storedAttempts];

        if (key === 'Backspace') {
            const lastFilled = row.slice().reverse().findIndex(c => c !== '');
            const index = lastFilled !== -1 ? 4 - lastFilled : 4;
            row[index] = '';
        } else if (key === 'Enter') {
            submitGuess();

        } else if (/^[a-zA-Z]$/.test(key)) {
            // Find the next empty spot
            const index = row.findIndex(c => c === '');
            if (index !== -1) {
                row[index] = key.toUpperCase();
            }
        }
        console.log(updatedGuesses);
        updatedGuesses[storedAttempts] = row;
        setGuesses(updatedGuesses);
    };

    const submitGuess = async () => {
        console.log("Enter pressed:", guesses);
        console.log("Button clicked:", guesses[storedAttempts]);
        const currentGuess = guesses[storedAttempts].join('').toLowerCase();
        console.log("Sent guess");
        console.log(currentGuess);


        // Send guess to server
        const response = await fetch('http://localhost:5000/api/word/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },

            credentials: 'include',
            body: JSON.stringify({ guess: currentGuess }),
        });
        if (response.status === 403) {
            // CSRF mismatch or unauthorized session
            navigate('/'); // Redirect to homepage/login
            return;
        }

        const data = await response.json();
        if (data.error) {
            showModal(data.error);
        } else {
            setAscii(data.gameState.letterColors);
            setGuesses(data.gameState.guesses);
            setAttempts(data.gameState.attempts);
            setGameOver(data.gameState.gameOver);
        }
        if (data.result === 'ggggg') {
            showModal('You won!');
        } else if (data.gameState.attempts > 5) {
            showModal('You ran out of guesses!');
        }
        if (solveResult.word) {
            fetchSolve();
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
        setAscii(Array(26).fill('o'));
    };

    const handleLogout = async () => {
        await fetch('http://localhost:5000/api/login/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
        });
        await refreshCsrfToken();


        navigate('/');
    };
    const resetGameOnServer = async () => {
        await fetch('http://localhost:5000/api/word/reset', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },

        });

    };
    const navigateHome = () => {
        
        if (isLoggedIn) {

            navigate('/profile');
        }
        else {
            handleLogout();
            navigate('/');
        }
    };
    return (
        <div className="App">


            <div className="button-container">
                <button className="home-button" onClick={navigateHome}>
                    Home
                </button>
                {isLoggedIn && (
                    <button
                        className="logout-button"
                        onClick={() => setShowLogoutConfirm(true)}
                    >
                        Logout
                    </button>
                )}
            </div>

            <h1>Wordle Game</h1>

            {showLogoutConfirm ? (
                <Modal
                    message="Are you sure you want to log out?"
                    onConfirm={() => {
                        handleLogout();
                        setShowLogoutConfirm(false);
                    }}
                    onClose={() => setShowLogoutConfirm(false)}
                    confirmLabel="Logout"
                    cancelLabel="Cancel"
                />
            ) : (
                <Modal
                    message={modalMessage}
                    onClose={() => setModalVisible(false)}
                />
            )}
            <div className="input-hint-wrapper">
                <Board
                    guesses={guesses}
                    setGuesses={setGuesses}
                    attempts={storedAttempts}
                    submitGuess={submitGuess}
                    gameOver={gameOver}
                />
                <div className="solve-container">
                    <button className="solve-button" onClick={toggleSolution}>
                        {solutionShown ? 'Hide hint' : 'Show hint'}
                    </button>

                    {solutionShown && (
                        <div className="solve-result">
                            <SolveDisplay word={solveResult.word} number={solveResult.number} />
                        </div>
                    )}
                </div>
            </div>
            <LetterDisplay
                asciiToColor={asciiToColor}
                onKeyClick={handleLetterInput}
            />

        </div>
    );
}
export default App;
