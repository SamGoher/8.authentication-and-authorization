const express = require(`express`);
const router = express.Router();
const userController = require(`../controllers/user`);
const isLoggedin = require(`../middleware/isloggedin`);
const { verifyToken } = require(`../middleware/verifyToken`);

// @desc    get home page
// @route   GET `/`
// @access  public
router.get(`/`, isLoggedin.notLoggedIn, verifyToken, userController.getHome);

// @desc    get home api
// @route   GET `/api/home`
// @access  public
router.get(`/api/home`, isLoggedin.notLoggedIn, verifyToken, userController.getHomeApi);


// @desc    handle logout post request
// @route   POST `/logout`
// @access  private
router.post(`/logout`, isLoggedin.notLoggedIn, verifyToken, userController.postLogout);

// @desc    handle send email post request
// @route   POST `/sendEmail`
//access    private
router.post(`/sendEmail`, isLoggedin.notLoggedIn, verifyToken, userController.postSendEmail);

module.exports = router;