import React, { useEffect, useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkProperVisit } from '../helpers/checkProper.js';
import { CsrfContext } from '../csrf/CsrfContext';
import '../styling/userHomeStyles.css';
import '../styling/modalStyles.css';
import Modal from '../components/Modal';/*
  UserHome Component:
  - Displays user profile and game stats.
  - Allows starting a new game or resuming today's game.
  - Supports logout with confirmation modal.
  - Fetches user data and verifies session on mount.
*/

const UserHome = () => {
    const [userData, setUserData] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();
    const { csrfToken, refreshCsrfToken } = useContext(CsrfContext);

    /*
      useEffect to initialize the component:
      - Fetches user data on component mount.
      - Verifies proper session and redirects if necessary.
    */
    useEffect(() => {
        const initialize = async () => {
            await fetchUserData();
            await checkProperVisit(navigate, refreshCsrfToken);
        };
        initialize();
    }, [navigate]);

    /*
      fetchUserData - Fetches the user's profile and game statistics
      from the backend API. If the session is invalid, redirects
      user to the login page.
    */
    const fetchUserData = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/user/data', {
                method: 'GET',
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setUserData(data);
            } else {
                navigate('/login');
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            navigate('/login');
        }
    };

    /*
      handleLogout - Sends logout request to the backend,
      refreshes the CSRF token, and redirects the user to
      the home page.
    */
    const handleLogout = async () => {
        await fetch('http://localhost:5000/api/login/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
        });
        await refreshCsrfToken();
        navigate('/');
    };

    /*
      handleNewGame - Requests to start a new game from the backend.
      If the session is invalid, redirects to login.
      Navigates user to the game page after successful request.
    */
    const handleNewGame = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/user/startNew', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
            });
            if (!res.ok) {
                navigate('/login');
            }
        } catch (err) {
            console.error('Error starting new game:', err);
            navigate('/login');
        }
        navigate('/game');
    };

    if (!userData) {
        return <div>Loading...</div>;
    }
    //Variable containing the result of user's winning percentage
    const winningPercentage =
        userData.gamesPlayed > 0
            ? ((userData.gamesWon / userData.gamesPlayed) * 100).toFixed(1)
            : '0.0';

    return (
        <div className="userHome">
            <div className="button-container">
                <button
                    className="logout-button"
                    onClick={() => setShowLogoutConfirm(true)}
                >
                    Logout
                </button>
            </div>

            <Modal
                message={showLogoutConfirm ? "Are you sure you want to log out?" : modalMessage}
                onConfirm={showLogoutConfirm ? () => { handleLogout(); setShowLogoutConfirm(false); } : undefined}
                onClose={() => setShowLogoutConfirm(false)}
                confirmLabel={showLogoutConfirm ? "Logout" : undefined}
                cancelLabel={showLogoutConfirm ? "Cancel" : undefined}
            />

            <div className="userContainer">
                <h1 className="welcome">Welcome, {userData.username}!</h1>
                <div className="gamesStats">
                    <div>Games Played:<span className="statTag">{userData.gamesPlayed}</span> Games Won:<span className="statTag">{userData.gamesWon}</span></div>
                    <div>Win Rate:<span className="statTag">{winningPercentage}%</span></div>
                    <div>Last Game:<span className="statTag">{userData.isLastPlayedToday ? 'Today' : userData.lastPlayedDate}</span></div>
                </div>
                <button
                    className="newGameButton"
                    onClick={handleNewGame}
                >
                    {userData.isLastPlayedToday ? 'Load Game' : 'Play New Game'}
                </button>
            </div>
        </div>
    );
};

export default UserHome;

