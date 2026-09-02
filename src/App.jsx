import React, { useState, useEffect } from 'react';
import NavigationHeader from './components/NavigationHeader';
import AppointmentSummary from './components/AppointmentSummary';
import PaymentCheckout from './components/PaymentCheckout';
import PaymentProcessingScreen from './components/PaymentProcessingScreen';
import PaymentSuccessScreen from './components/PaymentSuccessScreen';
import PaymentFailureScreen from './components/PaymentFailureScreen';
import PaymentHistoryScreen from './components/PaymentHistoryScreen';
import { fetchAppointmentDetails, processPaymentApi } from './api/paymentApi';
import { generateInvoicePDF } from './components/InvoiceReceipt';
import './App.css';

export default function App() {
  const [currentTab, setCurrentTab] = useState('checkout');
  const [paymentState, setPaymentState] = useState('IDLE');
  const [appointment, setAppointment] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [history, setHistory] = useState([
    {
      invoiceId: 'INV-3570',
      transactionId: 'pay_w5qsoc',
      serviceName: 'Signature Haircut & Beard',
      paidAmount: 1499,
      date: '12 Sep 2024',
    }
  ]);

  useEffect(() => {
    fetchAppointmentDetails().then(setAppointment);
  }, []);

  const handlePaymentInitiation = async (paymentData) => {
    setPaymentState('PROCESSING');
    try {
      const result = await processPaymentApi(paymentData);
      const record = { ...result, serviceName: appointment.serviceName };
      setPaymentResult(record);
      setHistory((prev) => [record, ...prev]);
      setPaymentState('SUCCESS');
    } catch (err) {
      setErrorDetails(err);
      setPaymentState('FAILURE');
    }
  };

  if (!appointment) return <div className="loading-app">Loading booking details...</div>;

  return (
    <div className="app-container">
      <NavigationHeader currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="main-content">
        {currentTab === 'history' ? (
          <PaymentHistoryScreen 
            history={history} 
            onDownloadInvoice={(item) => generateInvoicePDF(item, appointment)}
            onBack={() => setCurrentTab('checkout')}
          />
        ) : (
          <>
            {paymentState === 'IDLE' && (
              <div className="page-layout">
                <div className="header-banner">
                  <span className="section-label">APPOINTMENT PAYMENT</span>
                  <h1>Complete your booking</h1>
                  <p className="sub-text">Your appointment is reserved. Choose how you'd like to pay.</p>
                </div>
                <div className="checkout-grid">
                  <AppointmentSummary appointment={appointment} />
                  <PaymentCheckout 
                    appointment={appointment} 
                    onInitiatePayment={handlePaymentInitiation} 
                  />
                </div>
              </div>
            )}

            {paymentState === 'PROCESSING' && <PaymentProcessingScreen />}

            {paymentState === 'SUCCESS' && (
              <PaymentSuccessScreen 
                result={paymentResult}
                appointment={appointment}
                onDownloadInvoice={(item) => generateInvoicePDF(item, appointment)}
                onViewHistory={() => setCurrentTab('history')}
                onReset={() => setPaymentState('IDLE')}
              />
            )}

            {paymentState === 'FAILURE' && (
              <PaymentFailureScreen 
                error={errorDetails}
                onRetry={() => setPaymentState('IDLE')}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}