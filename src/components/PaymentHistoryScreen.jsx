import React from 'react';

export default function PaymentHistoryScreen({ history, onDownloadInvoice, onBack }) {
  return (
    <div className="history-wrapper">
      <div className="history-header">
        <div>
          <span className="section-label">YOUR RECEIPTS</span>
          <h2>Payment history</h2>
          <p className="sub-text">Every payment, safely kept in one place.</p>
        </div>
        <button className="secondary-btn" onClick={onBack}>&larr; Back to payment</button>
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>TRANSACTION</th>
            <th>DATE</th>
            <th>AMOUNT</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No past payments recorded.</td>
            </tr>
          ) : (
            history.map((item) => (
              <tr key={item.transactionId}>
                <td>
                  <strong>{item.serviceName}</strong>
                  <br />
                  <small>{item.invoiceId} &bull; {item.transactionId}</small>
                </td>
                <td>{item.date}</td>
                <td>₹{item.paidAmount}</td>
                <td><span className="status-badge paid">Paid</span></td>
                <td>
                  <button className="icon-btn" title="Download Receipt" onClick={() => onDownloadInvoice(item)}>
                    &darr;
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}