// auth function for already loggedin users
module.exports.loggedIn = (req, res, next) => {
  if(req.session.name){
    return res.redirect(`/`);
  }
  next();
}

// auth function for users those not loggedin
module.exports.notLoggedIn = (req, res, next) => {
  // i'm out
  if(!req.session.name){
    return res.redirect(`/auth`);
  }
  next();
}