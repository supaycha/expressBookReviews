const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  console.log(username)
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  //Write your code here
  return res.status(200).json(Object.entries(books).map(b => b[1].title));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const book  = Object.entries(books).filter(b => b[1].isbn10 === isbn)[0][1]
  return res.status(200).json(book);
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  //Write your code here
  const { author } = req.params;
  const book  = Object.entries(books).filter(b => b[1].author === author)
  if (book.length > 1) {
    return res.status(200).json(book.map(b => b[1]))
  }
  return res.status(200).json(book[0][1]);
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  //Write your code here
  const { title } = req.params;
  const book  = Object.entries(books).filter(b => b[1].title === title)[0][1]
  return res.status(200).json(book);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  const book  = Object.entries(books).filter(b => b[1].isbn10 === isbn)[0][1]
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
