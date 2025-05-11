import React from 'react';

const SolveDisplay = ({ word, number, onClose }) => {
    
    return (
        <div className="solve-display">
            
            <h2 style={{ marginBottom: '10px' }}>Best Word:</h2>
            <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '10px'
            }}>'{word}'</div>
            <div style={{
                fontSize: '18px'
            }}>Number of possible words left: {number}</div>
        </div>
    );
};

export default SolveDisplay;
