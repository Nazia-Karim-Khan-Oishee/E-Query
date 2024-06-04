const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("jwt token", req.cookies);
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log("token ase");
        console.log(err.message);
        // res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    // res.redirect("/login");
    console.log("token nai");
  }
};
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(" Req Authenticated: " + req.user.id);

    next();
  } else {
    console.log(" Request Not Authenticated            ");

    res.status(400).json({ error: "You do not have access" });
  }
};
module.exports = { requireAuth, ensureAuthenticated };
