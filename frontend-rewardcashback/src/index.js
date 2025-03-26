import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Redeem from './redeem';
import leaderboard from './leaderboard';
import reportWebVitals from './reportWebVitals';
import Leaderboard from './leaderboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
