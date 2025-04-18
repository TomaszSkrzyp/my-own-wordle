import React, { useState, useRef, useEffect } from 'react';

const Board = ({ guesses, setGuesses, attempts }) => {
    const inputRefs = useRef([]); // For managing focus on input fields
    ;
    // Initialize the refs array only once
    if (inputRefs.current.length === 0) {
            inputRefs.current = Array(6).fill().map(() => Array(5).fill().map(() => React.createRef()));
        }
    

    // Handle changes in an individual input field
    const handleInputChange = (e, rowIndex, colIndex) => {

        console.log(guesses[0]);
        const inputValue = e.target.value.slice(0, 1);
        console.log(inputValue);

        setGuesses((prevGuesses) => {
            const newGuesses = [...prevGuesses];
            const row = [...newGuesses[rowIndex]];  // Copy the row
            row[colIndex] = inputValue;  // Update the specific tile

            newGuesses[rowIndex] = row;  // Assign the updated row back
            return newGuesses;  // Return the updated state
        });;
        
        // Focus next input if there is one
        if (inputValue && colIndex < 4) {
            const nextInput = inputRefs.current[rowIndex][colIndex + 1];
            if (nextInput && nextInput.current) {
                nextInput.current.focus();
            }
        }
        console.log(guesses[0]);
    };

    // Handle backspace to move focus to previous input
    const handleKeyDown = (e, rowIndex, colIndex) => {
        const isBackspace = e.key === "Backspace";
        const currentValue = guesses[rowIndex][colIndex];

        if (isBackspace && currentValue === "" && colIndex > 0) {
            // Move focus to previous input if the current one is empty
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
                                        ref={inputRefs.current[rowIndex][colIndex]} // Attach ref for each input
                                        type="text"
                                        maxLength="1"
                                        className="tile-input"
                                        value={tile}
                                        onChange={(e) => handleInputChange(e, rowIndex, colIndex)} // Handle text input
                                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)} // Handle key events like Backspace
                                        disabled={rowIndex > attempts} // Disable inputs in rows after the current attempt
                                    />
                                </div>
                                <div className="tile-back" style={{ backgroundColor: tile.color }}>
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
