//genrate token from process.env.JWT_SECRET
var jwt = require("jsonwebtoken");

//generate token and return it
function generateToken(user) {
  if (!user) return null;

  var u = {
    name: user.name,
    userId: user.userId,
    username: user.username,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(u, process.env.JWT_SECRET);
}
//return basic user details
function getCleanUser(user) {
  if (!user) return null;

  return {
    name: user.name,
    userId: user.userId,
    username: user.username,
    isAdmin: user.isAdmin,
  };
}

module.exports = {
  generateToken,
  getCleanUser,
};
