import React from 'react';
import { useInit } from './utils/useInit';

const App: React.FC = () => {
    const { isLoading, isInitialized, error, session } = useInit();

    if (isLoading) {
        return (
            <>
                <h1>Loading p2panda...</h1>
                <p>Initializing connection...</p>
            </>
        );
    }

    if (error) {
        return (
            <>
                <h1>Error</h1>
                <p style={{ color: 'red' }}>Failed to initialize: {error}</p>
            </>
        );
    }

    if (!isInitialized || !session) {
        return (
            <>
                <h1>Error</h1>
                <p>Failed to initialize session</p>
            </>
        );
    }

    return (
        <>
            <h1>Hello p2panda!</h1>
            <p>✅ Successfully connected to p2panda node</p>
        </>
    );
};

export default App;