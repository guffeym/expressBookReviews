const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  // Register a new user
  const username = req.body.username;
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
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const bookss = await new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      }
      else {
        reject(new Error("No books found"));
      }

    });
    return res.status(200).json(bookss);
  }
  catch (error) {

    return res.status(404).json({ message: "not found", error: error.message });
  }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const booksss = await new Promise((resolve, reject) => {
      let book = null;
      for (let key of Object.keys(books)) {
        if (Number(isbn) == Number(key)) {
          book = books[key];
        }
      }
      if (book != null) {
        resolve(book);
      }
      else {
        reject(new Error("book not found"));
      }
    }
    );
    return res.status(200).json(booksss);
  }
  catch (error) {
    return res.status(404).json({ message: "not found", error: error.message });
  }
});


// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const bookssss = await new Promise((resolve, reject) => {
      let book = null;
      for (let key of Object.keys(books)) {
        if (books[key].author == author) {
          book = books[key];
        }
      }
      if (book != null) {
        resolve(book);
      }
      else { reject(new Error("book not found")); }
    }
    );
    return res.status(200).json(bookssss)
  }
  catch (error) {
    return res.status(404).json({ message: "not found", error: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
   try {
    const booksssss = await new Promise((resolve, reject) => {
      let book = null;
      for (let key of Object.keys(books)) {
        if (books[key].title == title) {
          book = books[key]; 
        }
      }
      if (book != null) {
        resolve(book);
      }
      else { reject(new Error("book not found")); }
    }
    );
    return res.status(200).json(booksssss)
  }
  catch (error) {
    return res.status(404).json({ message: "not found", error: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const books = require("./booksdb.js")
  for (let key of Object.keys(books)) {
    if (isbn === key) {
      const book = books[key]
      return res.status(200).json(book.reviews)
    }
  }
  return res.status(404).json({ message: "Not found" })
});
module.exports.general = public_users;
