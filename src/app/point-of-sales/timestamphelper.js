import React, { useState, useEffect } from 'react';

const TimeSpent = ({ timestamp }) => {
    const [timeSpent, setTimeSpent] = useState('');

    useEffect(() => {
        const startTimestamp = new Date(timestamp).getTime();

        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            const timeDifference = Math.floor((currentTime - startTimestamp) / (1000 * 60)); // Difference in minutes
            setTimeSpent(`${timeDifference} minutes`);
        }, 1000);

        return () => clearInterval(interval);
    }, [timestamp]);

    return <div>{timeSpent}</div>;
};

export default TimeSpent;