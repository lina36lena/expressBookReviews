const test = require('node:test');
const assert = require('node:assert/strict');
const books = require('../router/book_queries');

test('retrieves all ten books', () => assert.equal(Object.keys(books.getAllBooks()).length, 10));
test('looks up an ISBN', () => assert.equal(books.getBookByISBN('8').title, 'Pride and Prejudice'));
test('returns null for an unknown ISBN', () => assert.equal(books.getBookByISBN('100'), null));
test('searches author names', () => assert.equal(books.getBooksByAuthor('austen')['8'].title, 'Pride and Prejudice'));
test('searches title case-insensitively', () => assert.equal(books.getBooksByTitle('pride')['8'].author, 'Jane Austen'));
