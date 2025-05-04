import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  console.log(req.headers, "GODE DE NAAL GODI JEANS")

  if (!token) return res.status(401).send("Access Denied");


 jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    req.user = user; // Attach user to the request object
    next();
  });
};

export default authenticateToken;