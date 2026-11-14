const express = require('express');
const axios = require('axios');
const queries = require('./book_queries');
const { addUser } = require('./auth_users');
const publicUsers = express.Router();

// Task 7: register a new user.
publicUsers.post('/register', (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string' ||
      !username.trim() || password.length < 8) {
    return res.status(400).json({ message: 'Provide a username and a password with at least 8 characters.' });
  }
  if (!addUser(username.trim(), password)) {
    return res.status(409).json({ message: 'Username already exists.' });
  }
  return res.status(201).json({ message: 'User successfully registered.' });
});

// Tasks 2–6: public book endpoints.
publicUsers.get('/', (req, res) => res.json(queries.getAllBooks()));
publicUsers.get('/isbn/:isbn', (req, res) => {
  const book = queries.getBookByISBN(req.params.isbn);
  return book ? res.json(book) : res.status(404).json({ message: 'Book not found.' });
});
publicUsers.get('/author/:author', (req, res) => res.json(queries.getBooksByAuthor(req.params.author)));
publicUsers.get('/title/:title', (req, res) => res.json(queries.getBooksByTitle(req.params.title)));
publicUsers.get('/review/:isbn', (req, res) => {
  const book = queries.getBookByISBN(req.params.isbn);
  return book ? res.json(book.reviews) : res.status(404).json({ message: 'Book not found.' });
});

// Task 11: asynchronous implementations using Axios and async/await.
// Execute these against the running local Express server (port 5000).
const API = process.env.BOOK_API_URL || 'http://localhost:5000';
async function getAllBooksAsync() {
  return (await axios.get(`${API}/`)).data;
}
async function getBookByISBNAsync(isbn) {
  return (await axios.get(`${API}/isbn/${encodeURIComponent(isbn)}`)).data;
}
async function getBooksByAuthorAsync(author) {
  return (await axios.get(`${API}/author/${encodeURIComponent(author)}`)).data;
}
async function getBooksByTitleAsync(title) {
  return (await axios.get(`${API}/title/${encodeURIComponent(title)}`)).data;
}

module.exports.general = publicUsers;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBNAsync = getBookByISBNAsync;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByTitleAsync = getBooksByTitleAsync;
