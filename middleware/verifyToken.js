// application requirements
const jwt = require(`jsonwebtoken`);

exports.verifyToken = (req, res, next) => {
  const jwtToken = req.session.jwtToken;
  
  // check if token is out there
  if(!jwtToken) return res.status(401).send(`Access denied.`);

  try {
    
    // verify token
    const verified = jwt.verify(jwtToken, process.env.JWT_SECRET);

    if(!verified) return res.status(401).send(`Access denied.`);

    req.user = verified;
    next();

  } catch (error) {
    console.error(`Error: ${error}`)
  }
};