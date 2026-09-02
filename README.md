# Customer Registration System

A modern, responsive customer registration web application with Firebase Firestore integration, built by **Swathi**.

## Features

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

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: Firebase Firestore
- **Design**: Responsive CSS Grid & Flexbox
- **Icons**: SVG graphics
- **Validation**: Custom JavaScript validators

## Project Structure

```
customer-registration/
│
├── index.html           # Main HTML structure
├── styles.css           # Complete styling and responsive design
├── app.js              # Main application logic and CRUD operations
├── firebase-config.js  # Firebase configuration
└── README.md           # This file
```

## Setup Instructions

### Step 1: Clone or Download the Project

Download all project files to your local directory.

### Step 2: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter a project name (e.g., "customer-registration")
4. Follow the setup wizard to create your project

### Step 3: Enable Firestore Database

1. In your Firebase project, click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
   - **Note**: For production, configure proper security rules
4. Select a Cloud Firestore location (choose closest to your users)
5. Click **"Enable"**

### Step 4: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Customer Registration Web")
5. Copy the Firebase configuration object

### Step 5: Configure the Application

1. Open `firebase-config.js` in your text editor
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### Step 6: Run the Application

Since this application uses ES6 modules, you need to run it through a web server (not directly by opening the HTML file).

**Option 1: Using Python (Recommended)**
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

**Option 2: Using Node.js**
```bash
# Install http-server globally
npm install -g http-server

# Run the server
http-server -p 8000

# Then open: http://localhost:8000
```

**Option 3: Using VS Code**
- Install "Live Server" extension
- Right-click on `index.html`
- Select "Open with Live Server"

### Step 7: Configure Firestore Security Rules (Important!)

For development, the test mode rules work fine. For production, update your Firestore security rules:

1. Go to **Firestore Database** > **Rules** tab
2. Use these rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /customers/{customerId} {
      // Allow read and write access to authenticated users
      // Adjust based on your authentication requirements
      allow read, write: if true; // Change this for production!
    }
  }
}
```

**Note**: The above rule allows all access. Implement proper authentication and authorization for production use.

## How to Use

### Register a New Customer

1. Fill in all required fields (marked with *)
2. The form validates in real-time as you type
3. Fix any validation errors shown in red
4. Click **"Register Customer"** button
5. Success message will appear, and the form will reset
6. New customer appears in the "Registered Customers" section

### Edit Customer Profile

1. Scroll to the "Registered Customers" section
2. Find the customer card you want to edit
3. Click the **"Edit Profile"** button
4. Update the information in the modal dialog
5. Click **"Update Profile"** to save changes
6. The customer card updates automatically

### Delete a Customer

1. Find the customer card in the "Registered Customers" section
2. Click the **"Delete"** button
3. Confirm the deletion in the popup dialog
4. The customer is removed from the database and UI

## Form Validation Rules

| Field   | Validation Rules                                    |
|---------|---------------------------------------------------|
| Name    | Required, min 2 chars, letters and spaces only    |
| Age     | Required, number between 1-150                    |
| Gender  | Required, one of: Male, Female, Other             |
| Email   | Required, valid email format                      |
| Phone   | Required, min 10 digits, valid phone format       |
| Address | Optional                                          |

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Modern mobile browsers

**Note**: Requires a browser that supports ES6 modules and modern JavaScript features.

## Troubleshooting

### Firebase Connection Issues

**Problem**: "Failed to load customers" or Firebase errors

**Solutions**:
1. Verify your Firebase configuration in `firebase-config.js`
2. Check that Firestore is enabled in your Firebase project
3. Ensure you're running the app through a web server (required for ES6 modules)
4. Check browser console for specific error messages
5. Verify Firestore security rules allow access

### CORS Errors

**Problem**: Module loading errors or CORS issues

**Solution**: You must run the application through a web server, not by directly opening the HTML file. See Step 6 above.

### Form Not Submitting

**Problem**: Submit button doesn't work

**Solutions**:
1. Check that all required fields are filled
2. Fix any validation errors shown in red
3. Check browser console for JavaScript errors
4. Ensure Firebase is properly configured

## Future Enhancements

- 🔐 Add user authentication
- 📊 Add customer analytics dashboard
- 🔍 Add search and filter functionality
- 📄 Add pagination for large customer lists
- 📱 Create mobile app version (Flutter/React Native)
- 📧 Add email notifications
- 🖼️ Add profile picture upload
- 📊 Export customer data to CSV/Excel

## File Descriptions

### index.html
Main HTML structure containing:
- Registration form with all input fields
- Customer cards display section
- Edit modal for profile updates
- SVG icons and success/error messages

### styles.css
Complete styling including:
- Modern purple gradient theme
- Responsive grid layouts
- Form styling and validation states
- Modal dialog styling
- Customer card designs
- Mobile-responsive breakpoints
- Smooth animations and transitions

### app.js
Main application logic including:
- Form validation (real-time and on submit)
- Firebase CRUD operations (Create, Read, Update, Delete)
- Customer data management
- Modal controls
- Success/error message handling
- Event listeners and DOM manipulation

### firebase-config.js
Firebase initialization:
- Firebase app configuration
- Firestore database initialization
- Exports database instance for use in app.js

## Security Notes

⚠️ **Important for Production Use**:

1. **Never commit your Firebase config** with real credentials to public repositories
2. **Implement proper authentication** before deploying to production
3. **Configure Firestore security rules** to restrict access appropriately
4. **Enable App Check** to protect your Firebase resources
5. **Monitor usage** in Firebase Console to detect unusual activity
6. **Use environment variables** for sensitive configuration in production

## Author

**Swathi**

Project created as part of customer registration system development.

## License

This project is created for educational and portfolio purposes.

---

**Need Help?** Check the browser console for detailed error messages or refer to the [Firebase Documentation](https://firebase.google.com/docs/firestore).
