const express = require(`express`);
const router = express.Router();
const userController = require(`../controllers/user`);
const isLoggedin = require(`../middleware/isloggedin`);

// @desc    get signup page
// @route   GET `/signup`
// @access  public
router.get(`/signup`, isLoggedin.loggedIn, userController.getSignup);

// @desc    handle post request of signup page
// @route   POST `/newuser`
// @access  private
router.post(`/newuser`, isLoggedin.loggedIn, userController.postSignup);

module.exports = router;