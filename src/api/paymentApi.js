// Simulated REST API Service Layer
export const fetchAppointmentDetails = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "#APT-2048",
        serviceName: "Signature Haircut & Beard",
        stylist: "Rhea Kapoor",
        dateTime: "Thursday, 12 September 2024 | 10:30 AM - 11:30 AM",
        location: "Indiranagar, Bengaluru",
        addressDetail: "3rd Floor, 12th Main Road",
        totalAmount: 1499,
        advanceAmount: 599,
      });
    }, 300);
  });
};

export const processPaymentApi = async (paymentData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (paymentData.simulateFailure) {
        reject({ message: "Transaction declined by bank." });
      } else {
        resolve({
          status: "SUCCESS",
          transactionId: "pay_" + Math.random().toString(36).substr(2, 9),
          invoiceId: "INV-" + Math.floor(1000 + Math.random() * 9000),
          paidAmount: paymentData.amount,
          date: new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        });
      }
    }, 2000);
  });
};