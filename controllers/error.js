// application requriements
// const path = require(`path`);

// @desc  Get error page
// @route GET `/404`
// @access  public
exports.gerError = (req, res, next) => {
  res.status(404).render(`error`);
  next();
};