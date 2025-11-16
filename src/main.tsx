import React from 'react'
import ReactDOM from 'react-dom/client'
import { initWebAssembly } from 'shirokuma'
import App from './App.tsx'
import './index.css'
import { AppContainer } from './uikit/layout.tsx'

const init = async () => {
    await initWebAssembly()

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <AppContainer>
                <App />
            </AppContainer>
        </React.StrictMode>,
    )
}

init().catch(console.error)