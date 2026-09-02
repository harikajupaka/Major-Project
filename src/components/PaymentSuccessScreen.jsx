import React from 'react';

export default function PaymentSuccessScreen({ result, appointment, onDownloadInvoice, onViewHistory, onReset }) {
  return (
    <div className="status-screen card success-card">
      <div className="icon-circle success">&#10003;</div>
      <span className="section-label text-center">PAYMENT SUCCESSFUL</span>
      <h2>You're all set</h2>
      <p className="sub-text">Your appointment at Studio Nine is confirmed.</p>

      <div className="receipt-summary-grid">
        <div>
          <label>Amount paid</label>
          <strong>₹{result.paidAmount}</strong>
        </div>
        <div>
          <label>Payment reference</label>
          <strong>{result.transactionId}</strong>
        </div>
        <div>
          <label>Appointment</label>
          <strong>{appointment.dateTime.split('|')[0]}</strong>
        </div>
      </div>

      <div className="action-row">
        <button className="primary-btn" onClick={() => onDownloadInvoice(result)}>
          Download receipt &darr;
        </button>
        <button className="secondary-btn" onClick={onViewHistory}>
          View payment history
        </button>
      </div>

      <button className="text-btn" onClick={onReset}>
        &larr; Back to appointment
      </button>
    </div>
  );
}