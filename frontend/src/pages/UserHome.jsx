import React, { useEffect, useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { checkProperVisit } from '../helpers/checkProper.js';

import { isSameDate } from '../helpers/date.js';
import { CsrfContext } from '../csrf/CsrfContext';
import '../styling/userHomeStyles.css';
import '../styling/modalStyles.css';
import Modal from '../components/Modal';
const UserHome = () => {
    const [userData, setUserData] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();
    const { csrfToken, refreshCsrfToken } = useContext(CsrfContext);

    useEffect(() => {
        const initialize = async () => {

            await fetchUserData();
            await checkProperVisit(navigate, refreshCsrfToken);
            
        };
        initialize();
    }, [navigate]);
    useEffect(() => {
        if (userData) {
        }
    }, [userData]);
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
                navigate('/login'); // Redirect to login if session is invalid
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            navigate('/login');
        }
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
    const handleNewGame = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/user/startNew', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
            });

            if (!res.ok) {
                navigate('/login'); // Redirect to login if session is invalid
            } 
        } catch (err) {
            console.error('Error fetching user data:', err);
            navigate('/login');
        }
        navigate('/game');
    }
    if (!userData) {
        return <div>Loading...</div>;
    }
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
                    <div>Last Game:<span className="statTag">
                        {userData.isLastPlayedToday ? 'Today' : userData.lastPlayedDate}
                    </span></div>
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
