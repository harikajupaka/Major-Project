# Major-Project & Customer Registration System

## Customer Registration System

A modern, responsive customer registration web application with Firebase Firestore integration, built by **Swathi**.

### Features

✅ **Customer Registration Form**
- Name, Age, Gender, Email, Phone, and Address fields
- Real-time form validation
- Clean, intuitive user interface

✅ **Form Validations**
- Name: Minimum 2 characters, letters and spaces only
- Age: Must be between 1-150
- Email: Valid email format required
- Phone: Valid phone number with minimum 10 digits
- Gender: Required selection
- Real-time error messages for immediate feedback

✅ **Firebase Firestore Database**
- Store customer details securely
- Real-time data synchronization
- Automatic timestamps for created/updated records

✅ **Profile Management**
- View all registered customers in card format
- Edit customer profiles through modal dialog
- Delete customer records with confirmation
- Responsive grid layout for customer cards

✅ **Modern UI/UX**
- Responsive design for all screen sizes
- Smooth animations and transitions
- Success and error message notifications
- Purple gradient background with professional styling

### Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: Firebase Firestore
- **Design**: Responsive CSS Grid & Flexbox
- **Icons**: SVG graphics
- **Validation**: Custom JavaScript validators

### Project Structure

```
customer-registration/
│
├── index.html           # Main HTML structure
├── styles.css           # Complete styling and responsive design
├── app.js              # Main application logic and CRUD operations
├── firebase-config.js  # Firebase configuration
└── README.md           # This file
```

---

## Authentication Setup

The backend supports password login followed by SMS OTP verification. Configure Twilio Verify with environment variables before starting the backend:

```bash
export TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
export TWILIO_AUTH_TOKEN=your_auth_token
export TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The values come from the Twilio Console:

- `TWILIO_ACCOUNT_SID`: Account SID
- `TWILIO_AUTH_TOKEN`: Auth Token
- `TWILIO_VERIFY_SERVICE_SID`: the Verify Service SID, created under Verify > Services

Phone numbers must use E.164 format, such as `+919876543210`. Twilio trial accounts can send only to verified recipient numbers. Never commit the Auth Token or place it in frontend code.

When the three Twilio values are absent, the backend uses a local in-memory OTP valid for five minutes and returns the code in the response for development. Set `OTP_EXPOSE_CODE=false` when testing without the development code response.

