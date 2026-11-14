const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const books = require('./booksdb');

const authenticated = express.Router();
const users = [];

function isValid(username) {
  return users.some(user => user.username === username);
}
function addUser(username, password) {
  if (isValid(username)) return false;
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  users.push({ username, salt, hash });
  return true;
}
function authenticatedUser(username, password) {
  const user = users.find(entry => entry.username === username);
  if (!user || typeof password !== 'string') return false;
  const proposed = crypto.scryptSync(password, user.salt, 64);
  return crypto.timingSafeEqual(Buffer.from(user.hash, 'hex'), proposed);
}

authenticated.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }
  const token = jwt.sign({ username }, req.app.locals.jwtSecret, { expiresIn: '1h' });
  req.session.authorization = { accessToken: token };
  return res.json({ message: 'User successfully logged in.' });
});

authenticated.put('/auth/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found.' });
  const review = req.body?.review || req.query.review;
  if (typeof review !== 'string' || !review.trim()) {
    return res.status(400).json({ message: 'Review text is required.' });
  }
  book.reviews[req.user.username] = review.trim();
  return res.json({ message: 'Review successfully added or updated.', reviews: book.reviews });
});

authenticated.delete('/auth/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found.' });
  if (!Object.prototype.hasOwnProperty.call(book.reviews, req.user.username)) {
    return res.status(404).json({ message: 'You have no review for this book.' });
  }
  delete book.reviews[req.user.username];
  return res.json({ message: 'Review successfully deleted.', reviews: book.reviews });
});

module.exports.authenticated = authenticated;
module.exports.isValid = isValid;
module.exports.addUser = addUser;
module.exports.users = users;
