import React, { useState, useRef, useEffect } from 'react';
import { colorEnum } from '../helpers/colorEnum.js';
const LetterDisplay = ({ asciiToColor,onKeyClick }) => {
    const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
];

    // Converts the asciiToColor string into a map like { a: 'gray', b: 'gray', ..., z: 'green' }
    const getLetterColors = () => {
        

        const colorMap = {};
        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(97 + i);
            const colorCode = asciiToColor[i]; 
            colorMap[letter.toUpperCase()] = colorEnum[colorCode] ;
        }
        return colorMap;
    };

    const letterColors = getLetterColors();
    return (
        <div id="letterContainer">
            {keyboardRows.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className="keyboard-row"
                    style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}
                >
                    {row.map((letter) => {
                        const displayText = letter;
                        const isSpecialKey = letter === 'Enter' || letter === 'Backspace';

                        return (
                            <div
                                key={letter}
                                onClick={() => onKeyClick(letter)}
                                className="letter-box"
                                style={{
                                    backgroundColor: letterColors[letter] || 'gray',
                                    color: 'white',
                                    padding: '10px',
                                    margin: '3px',
                                    borderRadius: '5px',
                                    width: isSpecialKey ? '80px' : '30px',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                }}
                            >
                                {displayText}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default LetterDisplay;
