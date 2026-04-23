import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import InstaMLApp from './components/InstaML/InstaMLApp.tsx'
import './index.css'

const hostname = window.location.hostname;
const isInstaML =
  hostname.startsWith('instaml') ||
  new URLSearchParams(window.location.search).has('instaml');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {isInstaML ? <InstaMLApp /> : <App />}
    </BrowserRouter>
  </React.StrictMode>,
)

