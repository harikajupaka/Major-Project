require('dotenv').config();

const path = require('path');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

const app = express();
const port = Number(process.env.PORT || 8081);
const jwtSecret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_saloon_which_must_be_long_enough';
const users = new Map();
const staticDirectory = path.join(__dirname, 'src', 'main', 'resources', 'static');

app.use(express.json());
app.use(express.static(staticDirectory));

const apiResponse = (success, message, extra = {}) => ({ success, message, ...extra });

function normalizeMobileNumber(value) {
  const mobileNumber = String(value || '').trim();
  return /^\d{10}$/.test(mobileNumber) ? `+91${mobileNumber}` : mobileNumber;
}

function required(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validRegistration(body) {
  return required(body.mobileNumber) && required(body.password) && required(body.name)
    && Number.isInteger(body.age) && required(body.gender);
}

function twilioConfigured() {
  return process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SERVICE_SID;
}

function twilioClient() {
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

function authMiddleware(req, res, next) {
  if (!req.path.startsWith('/api/') || req.path.startsWith('/api/auth/')) return next();
  const header = req.get('Authorization') || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Please provide a valid Bearer token.' });
  }
  try {
    const payload = jwt.verify(header.slice(7), jwtSecret);
    req.authenticatedMobileNumber = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized. Token is invalid or expired.' });
  }
}

app.use(authMiddleware);

app.post('/api/auth/register', async (req, res) => {
  if (!validRegistration(req.body)) {
    return res.status(400).json(apiResponse(false, 'Validation failed: required registration fields are missing.'));
  }
  const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);
  if (users.has(mobileNumber)) {
    return res.status(400).json(apiResponse(false, 'User already exists with this mobile number.'));
  }
  users.set(mobileNumber, {
    mobileNumber,
    password: await bcrypt.hash(req.body.password, 10),
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender
  });
  return res.json(apiResponse(true, 'Registration successful. You can now login.'));
});

app.post('/api/auth/login', async (req, res) => {
  if (!required(req.body.mobileNumber) || !required(req.body.password)) {
    return res.status(400).json(apiResponse(false, 'Validation failed: mobile number and password are required.'));
  }
  const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);
  const user = users.get(mobileNumber);
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json(apiResponse(false, 'Invalid mobile number or password.'));
  }
  const token = jwt.sign({ name: user.name, mobileNumber }, jwtSecret, { subject: mobileNumber, expiresIn: '1d' });
  return res.json(apiResponse(true, 'Login successful', {
    token,
    tokenType: 'Bearer',
    name: user.name,
    mobileNumber
  }));
});

app.post('/api/auth/otp/send', async (req, res) => {
  if (!required(req.body.mobileNumber)) {
    return res.status(400).json(apiResponse(false, 'Validation failed: mobile number is required.'));
  }
  const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);
  if (!users.has(mobileNumber)) {
    return res.status(404).json(apiResponse(false, 'No account exists with this mobile number.'));
  }
  if (!twilioConfigured()) {
    return res.status(503).json(apiResponse(false, 'Twilio is not configured. Set the Twilio environment variables and restart the server.'));
  }
  try {
    await twilioClient().verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: mobileNumber, channel: 'sms' });
    return res.json(apiResponse(true, 'OTP sent successfully.'));
  } catch {
    return res.status(502).json(apiResponse(false, 'The OTP provider could not send a code.'));
  }
});

app.post('/api/auth/otp/verify', async (req, res) => {
  if (!required(req.body.mobileNumber) || !/^\d{6}$/.test(String(req.body.otp || ''))) {
    return res.status(400).json(apiResponse(false, 'Validation failed: mobile number and a 6-digit OTP are required.'));
  }
  const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);
  if (!twilioConfigured()) {
    return res.status(503).json(apiResponse(false, 'Twilio is not configured. Set the Twilio environment variables and restart the server.'));
  }
  try {
    const check = await twilioClient().verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: mobileNumber, code: req.body.otp });
    return check.status === 'approved'
      ? res.json(apiResponse(true, 'OTP verified successfully.'))
      : res.status(401).json(apiResponse(false, 'Invalid or expired OTP.'));
  } catch {
    return res.status(502).json(apiResponse(false, 'The OTP provider could not verify the code.'));
  }
});

app.post('/api/appointments/category', (req, res) => {
  const { customerId, mainCategory, subCategory } = req.query;
  res.send(`Appointment initiated for Customer ${customerId} with Main Category: ${mainCategory}, Sub Category: ${subCategory}`);
});
app.put('/api/appointments/:appointmentId/stylist', (req, res) => {
  res.send(`Appointment ${req.params.appointmentId} updated with Stylist ID ${req.query.stylistId}`);
});
app.put('/api/appointments/:appointmentId/confirm', (req, res) => {
  res.send(`Appointment ${req.params.appointmentId} confirmed for ${req.query.dateAndTime}`);
});
app.get('/api/appointments/:appointmentId', (req, res) => res.send(`Details for Appointment ID ${req.params.appointmentId}`));
app.get('/api/customers/:id', (req, res) => res.send(`Customer details for ID ${req.params.id}`));
app.post('/api/customers/register', (req, res) => res.send(`Customer ${req.query.name} successfully registered with mobile ${req.query.mobile}`));

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return res.status(404).json(apiResponse(false, 'Not found.'));
  return res.sendFile(path.join(staticDirectory, 'index.html'));
});

app.listen(port, () => console.log(`Project Saloon JavaScript backend running on port ${port}`));
