import React, { useState, useRef, useEffect } from 'react';

import { colorEnum } from '../helpers/colorEnum.js'
const Board = ({ guesses, setGuesses, attempts,submitGuess,gameOver }) => {
    const inputRefs = useRef([]); // For managing focus on input fields
    ;
    // Initialize the refs array only once
    if (inputRefs.current.length === 0) {
            inputRefs.current = Array(6).fill().map(() => Array(5).fill().map(() => React.createRef()));
        }
    
    useEffect(() => {
    if (gameOver) return;

    const row = guesses[attempts];
    if (!row) return;

    const firstEmptyIndex = row.findIndex(letter => letter === '');
    const focusIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 4; // fallback to last box if all filled

    const inputToFocus = inputRefs.current[attempts][focusIndex];
    if (inputToFocus && inputToFocus.current) {
        inputToFocus.current.focus();
    }
    }, [guesses, attempts, gameOver]);
    const handleKeyDown = (e, rowIndex, colIndex) => {


        
        
        if (gameOver) {
            return;
        }
        const isBackspace = e.key === "Backspace";
        const currentValue = guesses[rowIndex][colIndex];

        if (isBackspace && currentValue === "" && colIndex > 0) {
            inputRefs.current[rowIndex][colIndex - 1].current.focus();
        }

        

    };
    

    return (
        <div id="boardContainer">
            {guesses.map((row, rowIndex) => (
                <div key={rowIndex} className="inputBoxContainer" id={`boardRowContainer${rowIndex + 1}`}>
                    {row.map((tile, colIndex) => (
                        <div key={colIndex} className="tile">
                            <div className="tile-inner" style={{ transform: tile.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', transition: 'transform 0.2s' }}>
                                

                                <div className="tile-front">
                                    <input
                                        ref={inputRefs.current[rowIndex][colIndex]}
                                        type="text"
                                        className="tile-input"
                                        value={!tile.flipped ? (tile || '') : ''}
                                        readOnly //!!!!!. i handle the input myself with handle letter input
                                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                        disabled={rowIndex > attempts || gameOver}
                                    />
                                </div>
                                <div className="tile-back" style={{ backgroundColor: colorEnum[tile.color] || 'gray' }}>
                                    {tile.letter ? tile.letter.toUpperCase() : ''}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Board;
