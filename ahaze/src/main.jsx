import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PlaceProvider } from './context/PlaceContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PlaceProvider>
      <App />
    </PlaceProvider>
  </StrictMode>,
)
