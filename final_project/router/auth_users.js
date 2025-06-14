const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  // Check if a user with the given username already exists
  const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
      return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  // Check if the user with the given username and password exists
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  // Login endpoint
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query;
  const isbn = req.params.isbn;
  const username = req.session.username;
  let book = null;
  for (let key of Object.keys(books)) {
    if (isbn === key) {
      book = books[key];
    }
  }
  if (book === null) {
    return res.status(404).json({ message: "Not Found" });
  } 
  if (book.reviews[username]) {
  book.reviews[username] = review;
  return res.status(200).send("review updated");
  }
  else {
   book.reviews[username] = review;
     return res.status(200).send("review added");
}
}
);

 regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;
  let book = null;
  for (let key of Object.keys(books)) {
    if (Number(isbn) === Number(key)) {
      book = books[key];
    }
  }
  if (book === null) {
    return res.status(404).json({ message: "Not Found" });
  }  
  if (book.reviews[username]) {  
    delete book.reviews[username]; 
    return res.status(200).send("review deleted"); 
  }
  else {
     return res.status(404).send("Not found");
 }});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
