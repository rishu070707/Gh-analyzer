import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, delay = 50, onComplete }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, delay);
            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, delay, text, onComplete]);

    return (
        <span>
            {displayText}
            <span className="inline-block w-2.5 h-4 bg-neon-green ml-1 animate-pulse" />
        </span>
    );
};

export default Typewriter;
