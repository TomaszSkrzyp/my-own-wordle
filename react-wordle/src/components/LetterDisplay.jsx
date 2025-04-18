import React, { useState, useRef, useEffect } from 'react';
const LetterDisplay = ({ asciiToColor })=> {
    const keyboardRows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];
    const colorLetters = () => {
        console.log(keyboardRows.find());
    }

    return (
        <div id="letterContainer">
            {keyboardRows.map((row, rowIndex) => (
                <div key={rowIndex} id={`letterRow${rowIndex + 1}`} style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    {row.map((letter) => (
                        <div key={letter}   className="letter-box">
                            {letter}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
export default LetterDisplay;
