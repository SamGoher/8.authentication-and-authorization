// application requirements
const express = require(`express`);
const router = express.Router();
const userController = require(`../controllers/user`);
const isLoggedin = require(`../middleware/isloggedin`);

// @desc    get auth html page
// @route   GET `/auth`
// @access  public
router.get(`/auth`, isLoggedin.loggedIn, userController.getAuth);

// @desc    handle post request of login page
// @route   POST `/login`
// @access  private
router.post(`/login`, isLoggedin.loggedIn, userController.postAuth);

// @desc    get reset page
// @route   GET `/reset`
// @access  public
router.get(`/reset`, isLoggedin.loggedIn, userController.getReset);

// @desc    handle post request of reset page
// @route   POST `/reset`
// @access  private
router.post(`/reset`, isLoggedin.loggedIn, userController.postReset);

// @desc    get page that ckeck resetToken
// @route   GET `/reset/:token`
// @access  private of specific user
router.get(`/reset/:token`, isLoggedin.loggedIn, userController.getResetToken);

// @desc    get page of setting new password
// @route   GET `/newpassword`
// @access  private of specific user
router.get(`/newpassword`, isLoggedin.loggedIn, userController.getNewPassword);

// @desc    handle post request of newpassword page
// @route   POST `/newpassword`
// @access  private
router.post(`/newpassword`, isLoggedin.loggedIn, userController.postNewPassword);

module.exports = router;