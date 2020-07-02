require("dotenv").config();

//created server.js and added routing HTTP request
var express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 4000;

// static user details
const userData = {
  userId: "111",
  name: "Hanky Panky",
  password: "123456788",
  username: "hanky",
  isAdmin: true,
};

//enable cors
app.use(cors());
//parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//request handler
app.get("/", (req, res) => {
  res.send("Welcome");
});

//middleware that checks if JWT token exists and verifies if it does exist.
//in all future routes,  this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
  //check header or url/post parameters for token
  var token = req.headers["authorization"];
  if (!token) return next(); //if no token, continue

  token = token.replace("Bearer", "");
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user.",
      });
    } else {
      req.user = user; //set the user to req so other routes can use it
      next();
    }
  });
});

//request handlers
app.get("/", (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, message: "Invalid user to access it." });
  res.send("Welcome" + req.user.name);
});

//validate user creds
app.post("/users/signin", function (req, res) {
  const user = req.body.username;
  const pwd = req.body.password;

  //return 400 as status if username & password does not exist
  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Username and Password required.",
    });
  }

  //retuen 401 as status if username & pssword entered is incorrect
  if (user !== userData.username || pwd !== userData.password) {
    return res.status(401).json({
      error: true,
      message: "Username and Password entered is Incorrect.",
    });
  }

  //generate token
  const token = utils.generateToken(userData);
  //get basic user details
  const userObject = utils.getCleanUser(userData);
  //returning token with the user details
  return res.json({ user: userObject, token });
});

//verifying the token and returning it if its valid
app.get("/verifyToken", function (req, res) {
  //check header or url/post parameters for token
  var token = req.body.token || req.query.token;
  if (!token) {
    return res.status(400).json({
      error: true,
      message: "Token is required.",
    });
  }
  //check token that was passed by decoding token using secret
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err)
      return res.status(401).json({
        error: true,
        message: "Invalid token.",
      });

    //return 401 if the user ids dont match
    if (user.uerdId !== userData.userId) {
      return res.status(401).json({
        error: true,
        message: "Invalid user.",
      });
    }

    //get basic user dtails
    var userObject = utils.getCleanUser(userData);
    return res.json({ user: userObject, token });
  });
});

//text displayed on the page with port 4000
app.listen(port, () => {
  console.log("Server started on: " + port);
});
