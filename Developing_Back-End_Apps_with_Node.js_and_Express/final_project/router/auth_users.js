const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"barisyirtinci","password":"pwd123"}];

const isValid = (username)=>{ //returns boolean
  const geMatchingtUsers = users.filter((user) => user.username === username);
  return geMatchingtUsers.length > 0;
}

const checkAuthenticatedUser = (username,password)=>{ //returns boolean
  const matchingUsers = users.filter((user) => user.username === username && user.password === password);
  return matchingUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  console.log("login: ", req.body);
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "404: error logging in"});
  }

  if (checkAuthenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("Logged in successfully");
    } else {
        return res.status(208).json({message: "Login failure. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
      const isbn = req.params.isbn;
      const review = req.body.review;
      const username = req.session.authorization.username;
      console.log("add review: ", req.params, req.body, req.session);
      if (books[isbn]) {
          let book = books[isbn];
          book.reviews[username] = review;
          return res.status(200).send("Review successfully posted");
      }
      else {
          return res.status(404).json({message: `ISBN ${isbn} not found`});
      }
});

//delete
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        delete book.reviews[username];
        return res.status(200).send("Review successfully deleted");
    }
    else {
        return res.status(404).json({message: `ISBN ${isbn} not found`});
    }
});
  



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
