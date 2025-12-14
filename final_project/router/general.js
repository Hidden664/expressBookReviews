const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User registered successfully" });
    } else {
      return res.status(409).json({ message: "User already exists" });
    }
  }
  return res.status(400).json({ message: "Username or password missing" });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then((data) => res.status(200).json(data))
  .catch((err) => res.status(500).json({ error: err.message }));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    resolve(books[isbn]);
  })
  .then((book) => {
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  new Promise((resolve, reject) => {
    const result = Object.values(books).filter(
      (book) => book.author === author
    );
    resolve(result);
  })
  .then((data) => res.status(200).json(data));
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  new Promise((resolve, reject) => {
    const result = Object.values(books).filter(
      (book) => book.title === title
    );
    resolve(result);
  })
  .then((data) => res.status(200).json(data));
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    resolve(books[isbn]?.reviews);
  })
  .then((reviews) => {
    if (reviews) {
      res.status(200).json(reviews);
    } else {
      res.status(404).json({ message: "No reviews found" });
    }
  });
});

module.exports.general = public_users;
