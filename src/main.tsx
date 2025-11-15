import React from 'react'
import ReactDOM from 'react-dom/client'
import { initWebAssembly } from 'shirokuma'
import App from './App.tsx'
import './index.css'

const init = async () => {
    await initWebAssembly()

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    )
}

init().catch(console.error)