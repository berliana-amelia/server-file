const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token || token !== process.env.SECRET_KEY) {
    res.status(401).send("Unauthorized");
    return;
  }

  // For simplicity, you can decode the token here if needed
  // const decodedToken = jwt.decode(token, { complete: true });
  // req.user = decodedToken.payload;

  next();
};

module.exports = authenticateToken;
