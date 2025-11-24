import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import Games from './pages/Games';
import Quiz from './pages/Quiz';
import ManageWords from './pages/ManageWords';
import Learn from './pages/Learn';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Redirect from "/" to "/learn" */}
          <Route index element={<Navigate to="learn" />} />
          <Route path="learn" element={<Learn />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="managewords" element={<ManageWords />} />
          <Route path="games" element={<Games />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
