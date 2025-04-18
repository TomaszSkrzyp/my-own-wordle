import React, { useState, useRef, useEffect } from 'react';

const LetterDisplay = ({ asciiToColor }) => {
    const keyboardRows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];

    // Converts the asciiToColor string into a map like { a: 'gray', b: 'gray', ..., z: 'green' }
    const getLetterColors = () => {
        const colorEnum = {
            g: 'green',
            b: 'gray',
            y: 'gold',
        };

        const colorMap = {};
        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(97 + i); // 'a' to 'z'
            const colorCode = asciiToColor[i]; // e.g. 'b', 'g', 'y'
            colorMap[letter.toUpperCase()] = colorEnum[colorCode] || 'gray';
        }
        return colorMap;
    };

    const letterColors = getLetterColors();
    return (
        <div id="letterContainer">
            {keyboardRows.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    id={`letterRow${rowIndex + 1}`}
                    style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}
                >
                    {row.map((letter) => (
                        <div
                            key={letter}
                            className="letter-box"
                            style={{
                                backgroundColor: letterColors[letter] || 'gray',
                                color: 'white',
                                padding: '10px',
                                margin: '3px',
                                borderRadius: '5px',
                                width: '30px',
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}
                        >
                            {letter}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default LetterDisplay;
