export const generateInvoicePDF = (payment, appointment) => {
  const content = `
===============================================
                    SALON
                OFFICIAL RECEIPT
===============================================
Invoice ID   : ${payment.invoiceId}
Transaction  : ${payment.transactionId}
Date         : ${payment.date}

Service      : ${payment.serviceName || appointment.serviceName}
Stylist      : ${appointment.stylist}
Date & Time  : ${appointment.dateTime}
Location     : ${appointment.location}

-----------------------------------------------
Total Amount Paid : ₹${payment.paidAmount}
Status            : SUCCESSFUL
-----------------------------------------------
Thank you for booking with StudioNine!
===============================================
  `;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${payment.invoiceId}_Receipt.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};