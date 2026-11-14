const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const customerRoutes = require('./router/auth_users').authenticated;
const publicRoutes = require('./router/general').general;

const app = express();
app.locals.jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
app.use(express.json());
app.use('/customer', session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax' }
}));
app.use('/customer/auth', (req, res, next) => {
  const token = req.session.authorization?.accessToken;
  if (!token) return res.status(401).json({ message: 'Please log in first.' });
  try {
    req.user = jwt.verify(token, app.locals.jwtSecret);
    return next();
  } catch {
    return res.status(403).json({ message: 'Session expired or invalid.' });
  }
});
app.use('/customer', customerRoutes);
app.use('/', publicRoutes);

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => console.log(`Book Review server running at http://localhost:${port}`));
