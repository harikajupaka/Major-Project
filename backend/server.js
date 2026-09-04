require('dotenv').config();

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

const app = express();
const port = Number(process.env.PORT || 8081);
const jwtSecret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_saloon_which_must_be_long_enough';
const dataDirectory = path.join(__dirname, 'data');
const dataFile = path.join(dataDirectory, 'database.json');
const staticDirectory = path.join(__dirname, 'src', 'main', 'resources', 'static');
const otpStore = new Map();

const defaultDatabase = {
  customers: [],
  appointments: [],
  feedback: [],
  stylists: [
    { id: 'S1', name: 'Rahul', category: 'Men', specialty: 'Hair cut, Herbal facial', experience: 4, rating: 4, city: 'Bangalore', area: 'RR Nagar', status: 'AA' },
    { id: 'S2', name: 'Putin', category: 'Men', specialty: 'French beard trim, Hair coloring', experience: 3, rating: 4.5, city: 'Bangalore', area: 'Jayanagar', status: 'AA' },
    { id: 'S3', name: 'Henna', category: 'Men', specialty: 'Head massage, Hair spa', experience: 6, rating: 4.2, city: 'Bangalore', area: 'Indiranagar', status: 'AA' },
    { id: 'S1', name: 'Ananya', category: 'Women', specialty: 'Bridal makeup, Hair styling', experience: 7, rating: 4.9, city: 'Bangalore', area: 'Koramangala', status: 'AA' },
    { id: 'S2', name: 'Meera', category: 'Women', specialty: 'Hair coloring, Skin care', experience: 6, rating: 4.8, city: 'Bangalore', area: 'Jayanagar', status: 'AA' },
    { id: 'S3', name: 'Riya', category: 'Women', specialty: 'Facials, Nail care', experience: 5, rating: 4.7, city: 'Bangalore', area: 'Indiranagar', status: 'AA' },
    { id: 'S1', name: 'Aarav', category: 'Children', specialty: 'Gentle haircuts, Kids styling', experience: 5, rating: 4.8, city: 'Bangalore', area: 'Whitefield', status: 'AA' },
    { id: 'S2', name: 'Sia', category: 'Children', specialty: 'Kids hair care, Fun styling', experience: 4, rating: 4.7, city: 'Bangalore', area: 'HSR Layout', status: 'AA' },
    { id: 'S3', name: 'Kabir', category: 'Children', specialty: 'Comfort cuts, Hair wash', experience: 6, rating: 4.9, city: 'Bangalore', area: 'Indiranagar', status: 'AA' }
  ]
};

function loadDatabase() {
  fs.mkdirSync(dataDirectory, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify(defaultDatabase, null, 2));
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

const database = loadDatabase();

function saveDatabase() {
  fs.writeFileSync(dataFile, JSON.stringify(database, null, 2));
}

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

function findCustomer(mobileNumber) {
  return database.customers.find((customer) => customer.mobileNumber === mobileNumber);
}

function twilioConfigured() {
  return process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SERVICE_SID;
}

function twilioClient() {
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

function useLocalOtp() {
  return process.env.NODE_ENV !== 'production';
}

function createLocalOtp(mobileNumber) {
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  otpStore.set(mobileNumber, { code, expiresAt: Date.now() + 300000 });
  return code;
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
  if (findCustomer(mobileNumber)) {
    return res.status(400).json(apiResponse(false, 'User already exists with this mobile number.'));
  }
  database.customers.push({
    id: crypto.randomUUID(),
    mobileNumber,
    password: await bcrypt.hash(req.body.password, 10),
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    createdAt: new Date().toISOString(),
    status: 'AA'
  });
  saveDatabase();
  return res.json(apiResponse(true, 'Registration successful. You can now login.'));
});

app.post('/api/auth/login', async (req, res) => {
  if (!required(req.body.mobileNumber) || !required(req.body.password)) {
    return res.status(400).json(apiResponse(false, 'Validation failed: mobile number and password are required.'));
  }
  const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);
  const user = findCustomer(mobileNumber);
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
  if (!findCustomer(mobileNumber)) {
    return res.status(404).json(apiResponse(false, 'No account exists with this mobile number.'));
  }
  if (!twilioConfigured()) {
    if (!useLocalOtp()) return res.status(503).json(apiResponse(false, 'OTP service is not configured.'));
    const code = createLocalOtp(mobileNumber);
    const response = { success: true, message: 'OTP sent successfully.' };
    response.debugCode = code;
    return res.json(response);
  }
  try {
    await twilioClient().verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: mobileNumber, channel: 'sms' });
    return res.json(apiResponse(true, 'OTP sent successfully.'));
  } catch (error) {
    console.error('Twilio OTP send failed:', error.code || error.status || error.message);
    if (useLocalOtp()) {
      return res.json(apiResponse(true, 'OTP generated in local development mode.', { debugCode: createLocalOtp(mobileNumber) }));
    }
    return res.status(502).json(apiResponse(false, 'The OTP provider could not send a code.'));
  }
});

app.post('/api/auth/otp/verify', async (req, res) => {
  if (!required(req.body.mobileNumber) || !/^\d{6}$/.test(String(req.body.otp || ''))) {
    return res.status(400).json(apiResponse(false, 'Validation failed: mobile number and a 6-digit OTP are required.'));
  }
  const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);
  if (!twilioConfigured()) {
    const entry = otpStore.get(mobileNumber);
    if (!entry || entry.expiresAt < Date.now() || entry.code !== String(req.body.otp)) {
      return res.status(401).json(apiResponse(false, 'Invalid or expired OTP.'));
    }
    otpStore.delete(mobileNumber);
    return res.json(apiResponse(true, 'OTP verified successfully.'));
  }
  try {
    const check = await twilioClient().verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: mobileNumber, code: req.body.otp });
    return check.status === 'approved'
      ? res.json(apiResponse(true, 'OTP verified successfully.'))
      : res.status(401).json(apiResponse(false, 'Invalid or expired OTP.'));
  } catch (error) {
    console.error('Twilio OTP verification failed:', error.code || error.status || error.message);
    return res.status(502).json(apiResponse(false, 'The OTP provider could not verify the code.'));
  }
});

app.post('/api/appointments/category', (req, res) => {
  const { customerId, mainCategory, subCategory } = req.query;
  if (!required(customerId) || !required(mainCategory) || !required(subCategory)) {
    return res.status(400).json(apiResponse(false, 'Customer, main category, and sub category are required.'));
  }
  const appointment = {
    id: crypto.randomUUID(), customerId, mainCategory, subCategory,
    status: 'AA', createdAt: new Date().toISOString()
  };
  database.appointments.push(appointment);
  saveDatabase();
  return res.status(201).json(apiResponse(true, 'Appointment initiated successfully.', { appointmentId: appointment.id, appointment }));
});
app.put('/api/appointments/:appointmentId/stylist', (req, res) => {
  const appointment = database.appointments.find(({ id }) => id === req.params.appointmentId);
  if (!appointment || !required(req.query.stylistId)) return res.status(404).json(apiResponse(false, 'Appointment or stylist not found.'));
  appointment.stylistId = req.query.stylistId;
  appointment.modifiedAt = new Date().toISOString();
  saveDatabase();
  return res.json(apiResponse(true, 'Stylist selected successfully.', { appointment }));
});
app.put('/api/appointments/:appointmentId/confirm', (req, res) => {
  const appointment = database.appointments.find(({ id }) => id === req.params.appointmentId);
  if (!appointment) return res.status(404).json(apiResponse(false, 'Appointment not found.'));
  if (!required(req.query.dateAndTime)) return res.status(400).json(apiResponse(false, 'Please enter the date and time to confirm.'));
  appointment.dateAndTime = req.query.dateAndTime;
  appointment.status = 'SC';
  appointment.modifiedAt = new Date().toISOString();
  saveDatabase();
  return res.json(apiResponse(true, 'You have successfully sent a request to stylist.', { appointment }));
});
app.get('/api/appointments/:appointmentId', (req, res) => {
  const appointment = database.appointments.find(({ id }) => id === req.params.appointmentId);
  return appointment ? res.json(appointment) : res.status(404).json(apiResponse(false, 'Appointment not found.'));
});
app.get('/api/stylists', (req, res) => {
  const stylists = database.stylists.filter((stylist) => stylist.status === 'AA' && (!req.query.category || stylist.category === req.query.category));
  return res.json(stylists);
});
app.get('/api/customers/:id', (req, res) => {
  const customer = database.customers.find(({ id, mobileNumber }) => id === req.params.id || mobileNumber === normalizeMobileNumber(req.params.id));
  return customer ? res.json({ ...customer, password: undefined }) : res.status(404).json(apiResponse(false, 'Customer not found.'));
});
app.patch('/api/customers/:id', (req, res) => {
  const customer = database.customers.find(({ id }) => id === req.params.id);
  if (!customer) return res.status(404).json(apiResponse(false, 'Customer not found.'));
  for (const field of ['name', 'age', 'gender', 'location']) if (req.body[field] !== undefined) customer[field] = req.body[field];
  customer.modifiedAt = new Date().toISOString();
  saveDatabase();
  return res.json(apiResponse(true, 'You have successfully edited the profile.', { customer: { ...customer, password: undefined } }));
});
app.post('/api/feedback', (req, res) => {
  const rating = Number(req.body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !required(req.body.review)) {
    return res.status(400).json(apiResponse(false, 'You should select the rating and write review before submitting.'));
  }
  const feedback = { id: crypto.randomUUID(), customerId: req.authenticatedMobileNumber, stylistId: req.body.stylistId || null, rating, review: req.body.review, createdAt: new Date().toISOString() };
  database.feedback.push(feedback);
  saveDatabase();
  return res.status(201).json(apiResponse(true, 'You have provided rating and review successfully to stylist.', { feedback }));
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return res.status(404).json(apiResponse(false, 'Not found.'));
  return res.sendFile(path.join(staticDirectory, 'index.html'));
});

app.listen(port, () => {
  console.log(`Project Saloon JavaScript backend running on port ${port}`);
  console.log(`Open the application at http://localhost:${port}/`);
});
