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
/*
Main Wordle game component responsible for gameplay logic, state management,
and interaction with backend game APIs.
Features:
 - Displays the Wordle board and handles user input
 - Fetches and validates guesses
 - Manages game state, win/loss conditions, and hints
 - Shows modals for game end and error messages
 */
const App = () => {

    // State variables to track guesses, attempts, game over flag,
    // keyboard letter coloring, modal visibility, and authentication status
    const [guesses, setGuesses] = useState(Array(6).fill(Array(5).fill('')));
    const [hintAvailable, setHintAvailable] = useState(false);
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
    /*
     useEffect - Runs once on component mount.
      Fetches current game state and login status from backend.
      Sets up initial state accordingly.
    */
    useEffect(() => {
        if (!csrfToken) {
            return;
        }
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

                setHintAvailable(data.gameState.hintAvailable);
            } catch (error) {
                console.error("Error fetching game state:", error);
            }
        };

        fetchGameState();
    }, [csrfToken]);

    /*
     useEffect - Adds keyboard event listener to capture key presses for gameplay input.
      Removes listener on cleanup.
    */
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key;
            handleLetterInput(key);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [guesses, storedAttempts, gameOver]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            // Prepare logout URL
            const logoutUrl = 'http://localhost:5000/api/login/logout';

            // Send logout request using sendBeacon (no headers possible)
            navigator.sendBeacon(logoutUrl, '');

            // Optionally, show a confirmation dialog (not recommended UX):
            // event.preventDefault();
            // event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    /*
     fetchSolve - Fetches a solver hint from the backend and stores the best guess and word count.
    */
    const fetchSolve = async () => {
        const response = await fetch('http://localhost:5000/api/solve', {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();

        setSolveResult({ word: data.bestWord, number: data.numberOfWords });
    };

    /*
     toggleSolution - Toggles the display of the solver hint.
      Fetches the hint if not already available and hints are allowed.
      Shows modal if no hints available.
    */
    const toggleSolution = async () => {
        if (!solutionShown) {
            if (!hintAvailable) {
                showModal("No hints available.");
                return;
            } else if (!solveResult) {
                await fetchSolve();
            }
            setSolutionShown(true);
        } else {
            setSolutionShown(false);
        }
    };

    /*
     handleLetterInput - Handles keyboard input for letters, backspace, and enter.
      Updates guesses state accordingly.
      Ignores input if game is over.
    */
    const handleLetterInput = (key) => {
        if (gameOver) return;

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

        updatedGuesses[storedAttempts] = row;
        setGuesses(updatedGuesses);
    };

    /* 
     submitGuess - Sends the current guess to the backend to validate correctness. 
      Updates state with new game info or shows error messages. 
      Handles win/lose condition modals. 
    */
    const submitGuess = async () => {
        const currentGuess = guesses[storedAttempts].join('').toLowerCase();

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
            setHintAvailable(data.gameState.hintAvailable);
        }
        if (data.result === 'ggggg') {
            showModal('You won!');
        } else if (data.gameState.attempts > 5) {
            showModal('You ran out of guesses!');
        }
        if (solutionShown) {
            toggleSolution();
        }
    };

    /*
     showModal - Displays a modal with the given message for 3.5 seconds.
    */
    const showModal = (message) => {
        setModalMessage(message);
        setModalVisible(true);
        setTimeout(() => {
            setModalVisible(false);
            setModalMessage('');
        }, 3500);
    };

    /*
     resetGame - Resets the game state locally to initial conditions.
    */
    const resetGame = () => {
        setGuesses(Array(6).fill(Array(5).fill('')));
        setAttempts(0);
        setGameOver(false);
        setAscii(Array(26).fill('o'));
    };

    /*
     handleLogout - Calls backend logout endpoint, refreshes CSRF token, and navigates to home.
    */
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

    /*
     resetGameOnServer - Sends a request to backend to reset game state on server.
    */
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

    /*
     navigateProfile - Navigates to profile page if logged in, otherwise logs out and redirects home.
    */
    const navigateProfile = () => {
        if (isLoggedIn) {
            navigate('/profile');
        } else {
            handleLogout();
            navigate('/');
        }
    };
    return (
        <div className="App">


            

            <h1>Wordle Game</h1>
            <div className="button-container">
                <button className="profile-button" onClick={navigateProfile}>
                    {isLoggedIn ? 'Profile' : 'Home'}
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
                    {!solutionShown &&
                        <div className="solve-availability">
                            {(hintAvailable) ? 'One solver token available' : 'The solver tokens are not available'}
                        </div>
                    }
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
