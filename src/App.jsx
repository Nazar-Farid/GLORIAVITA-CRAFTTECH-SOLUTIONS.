import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Quiz from './Components/Quiz';
import ReviewPage from './Components/ReviewPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Quiz />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
