import React from 'react';
import { data } from '../data';
import './ReviewPage.css';

const ReviewPage = () => {
  return (
    <div className="review-page">
      <h1>Review Your Answers</h1>
      <div className="review-grid">
        {data.map((item, index) => (
          <div key={index} className="review-card">
            <p className="question">{index + 1}. {item.question}</p>
            <div className="options-container">
              {Object.keys(item)
                .filter((key) => key.startsWith('option'))
                .map((option, idx) => (
                  <p
                    key={idx}
                    className={`option ${
                      item.ans === idx + 1 ? 'correct' : 'incorrect'
                    }`}
                  >
                    {item[option]}
                  </p>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewPage;
