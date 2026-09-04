import React from 'react';

export default function AppointmentSummary({ appointment }) {
  return (
    <div className="card appointment-card">
      <div className="card-header-row">
        <span className="section-label">YOUR APPOINTMENT</span>
        <span className="appointment-id">{appointment.id}</span>
      </div>
      
      <div className="stylist-info-box">
        <div className="avatar-placeholder">SN</div>
        <div>
          <h3>{appointment.serviceName}</h3>
          <p className="sub-text">with {appointment.stylist}</p>
        </div>
      </div>

      <div className="info-group">
        <span className="icon">🕒</span>
        <div>
          <label>DATE & TIME</label>
          <p>{appointment.dateTime}</p>
        </div>
      </div>

      <div className="info-group">
        <span className="icon">📍</span>
        <div>
          <label>LOCATION</label>
          <p>{appointment.location}</p>
          <span className="sub-text">{appointment.addressDetail}</span>
        </div>
      </div>

      <button className="text-btn">Edit appointment &rarr;</button>
    </div>
  );
}