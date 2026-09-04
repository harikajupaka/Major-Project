import React, { useState } from 'react';

export default function PaymentCheckout({ appointment, onInitiatePayment }) {
  const [paymentOption, setPaymentOption] = useState('full');
  const [simulateFailure, setSimulateFailure] = useState(false);

  const amountToPay = paymentOption === 'full' ? appointment.totalAmount : appointment.advanceAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    onInitiatePayment({
      option: paymentOption,
      amount: amountToPay,
      simulateFailure,
    });
  };

  return (
    <div className="card checkout-card">
      <span className="section-label">SELECT PAYMENT OPTION</span>
      
      <div className="options-group">
        <label className={`option-box ${paymentOption === 'full' ? 'selected' : ''}`}>
          <input 
            type="radio" 
            name="paymentOpt" 
            checked={paymentOption === 'full'} 
            onChange={() => setPaymentOption('full')} 
          />
          <div className="option-details">
            <strong>Pay in full</strong>
            <small>Pay once, enjoy your visit</small>
          </div>
          <span className="price">₹{appointment.totalAmount}</span>
        </label>

        <label className={`option-box ${paymentOption === 'advance' ? 'selected' : ''}`}>
          <input 
            type="radio" 
            name="paymentOpt" 
            checked={paymentOption === 'advance'} 
            onChange={() => setPaymentOption('advance')} 
          />
          <div className="option-details">
            <strong>Pay advance</strong>
            <small>Pay 40% now, rest at salon</small>
          </div>
          <span className="price">₹{appointment.advanceAmount}</span>
        </label>
      </div>

      <div className="breakdown-table">
        <div className="breakdown-row">
          <span>Service total</span>
          <span>₹{appointment.totalAmount}</span>
        </div>
        <div className="breakdown-row highlight">
          <span>Due today</span>
          <strong>₹{amountToPay}</strong>
        </div>
        <small className="due-note">
          {paymentOption === 'full' ? 'Pay the full amount today' : 'Pay remaining amount after service completion'}
        </small>
      </div>

      <div className="razorpay-placeholder">
        <div className="razorpay-brand">
          <span className="rzp-logo">razorpay</span>
          <span className="rzp-text">Razorpay secure checkout<br/><small>Cards, UPI, Netbanking, Wallets</small></span>
        </div>
      </div>

      <button className="primary-btn" onClick={handleSubmit}>
        Pay ₹{amountToPay} &rarr;
      </button>

      <div className="dev-toggle">
        <label>
          <input 
            type="checkbox" 
            checked={simulateFailure} 
            onChange={(e) => setSimulateFailure(e.target.checked)} 
          />
          Simulate payment failure
        </label>
      </div>
    </div>
  );
}