import React from 'react';
import './App.css';
import { useInit } from './utils/useInit';

const App: React.FC = () => {
    const { isLoading, isInitialized, error, session } = useInit();

    if (isLoading) {
        return (
            <div className="app">
                <h1>Loading p2panda...</h1>
                <p>Initializing connection...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app">
                <h1>Error</h1>
                <p style={{ color: 'red' }}>Failed to initialize: {error}</p>
            </div>
        );
    }

    if (!isInitialized || !session) {
        return (
            <div className="app">
                <h1>Error</h1>
                <p>Failed to initialize session</p>
            </div>
        );
    }

    return (
        <div className="app">
            <h1>Hello p2panda!</h1>
            <p>✅ Successfully connected to p2panda node</p>
        </div>
    );
};

export default App;