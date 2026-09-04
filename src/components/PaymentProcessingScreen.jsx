import React from 'react';

export default function PaymentProcessingScreen() {
  return (
    <div className="status-screen">
      <div className="spinner"></div>
      <h2>Processing Payment</h2>
      <p>Please wait while we confirm your transaction with Razorpay...</p>
    </div>
  );
}