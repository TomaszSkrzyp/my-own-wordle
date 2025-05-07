import React, { useEffect, useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { CsrfContext } from '../csrf/CsrfContext';

const UserHome = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const { csrfToken, refreshCsrfToken } = useContext(CsrfContext);
    useEffect(() => {
        // Fetch user data from backend
        const fetchUserData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/user/data', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log("sdf");
                    console.log(data)
                    setUserData(data);
                } else {
                    navigate('/login'); // Redirect to login if session is invalid
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

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
        return <div className="text-white text-center mt-10">Loading...</div>;
    }
    return (
        <div className="userHome">
            <div className="userContainer">
                <h1 className="welcome">Welcome, {userData.username}!</h1>
                <p className="gamesStats"> Games Played: {userData.gamesPlayed} Games Won: {userData.gamesWon} Last game date: {userData.lastPlayedDate}</p>

                <button className="newGameButton" onClick={handleNewGame}>Play New Game </button>
            </div>
        </div>
    );
};

export default UserHome;
