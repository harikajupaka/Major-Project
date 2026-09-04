import React from 'react';

export default function PaymentFailureScreen({ error, onRetry }) {
  return (
    <div className="status-screen card failure-card">
      <div className="icon-circle failure">&#10005;</div>
      <span className="section-label text-center">PAYMENT FAILED</span>
      <h2>Transaction Unsuccessful</h2>
      <p className="error-text">{error?.message || "We couldn't process your payment. Please try again."}</p>

      <button className="primary-btn" onClick={onRetry}>
        Try Payment Again
      </button>
    </div>
  );
}