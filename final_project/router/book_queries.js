const books = require('./booksdb');

function getAllBooks() {
  return books;
}

function getBookByISBN(isbn) {
  return Object.prototype.hasOwnProperty.call(books, isbn) ? books[isbn] : null;
}

function getBooksByAuthor(author) {
  const query = String(author).trim().toLowerCase();
  return Object.fromEntries(Object.entries(books).filter(([, book]) =>
    book.author.toLowerCase().includes(query)
  ));
}

function getBooksByTitle(title) {
  const query = String(title).trim().toLowerCase();
  return Object.fromEntries(Object.entries(books).filter(([, book]) =>
    book.title.toLowerCase().includes(query)
  ));
}

module.exports = { getAllBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle };
