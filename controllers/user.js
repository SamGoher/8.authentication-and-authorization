// application requirements
const crypto = require(`crypto`);
const jwt = require(`jsonwebtoken`);
const User = require(`../models/users`);
const bcrypt = require(`bcrypt`);
const nodemailer = require(`nodemailer`);
const sgTransport = require(`nodemailer-sendgrid-transport`);

// setting nodemailer configuration
const mailer = nodemailer.createTransport(sgTransport({
  auth: {
    api_key: `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`
  },
  tls: {
    rejectUnauthorized: false
  }
}));

// @desc    get auth html page
// @route   GET `/auth`
// @access  public
exports.getAuth = async (req, res) => {
  res.status(200).render(`auth`, {
    csrfToken: req.csrfToken()
  });
};

// @desc    get signup page
// @route   GET `/signup`
// @access  public
exports.getSignup = (req, res) => {
  res.status(200).render(`signup`, {
    csrfToken: req.csrfToken()
  });
};

// @desc    get home page
// @route   GET `/`
// @access  public
exports.getHome = (req, res) => {
  res.status(200).render(`home`, {
    name: req.session.name,
    csrfToken: req.csrfToken()
  });
};

// @desc    handle post request of login page
// @route   POST `/login`
// @access  private
exports.postAuth = async (req, res) => {
  try {
    const currentUser = await User.findOne({email: req.body.email});
    if(currentUser) {
      let isPass = await bcrypt.compare(req.body.password, currentUser.password);
      if(isPass){
        const token = currentUser.generateJwtToken();
        req.session.name = currentUser.name;
        req.session.jwtToken = token;
        return res.status(200).redirect(`/`);
      }
      else return res.status(400).json({
        success: false,
        message: `error occure in email or password`,
        data: null
      });
    } else return res.status(400).json({
      success: false,
      message: `this email is not exist.`,
      data: null
    });
  } catch (error) {
    console.error(`${error.message}`);
  }
};

// @desc    handle post request of signup page
// @route   POST `/newuser`
// @access  private
exports.postSignup = async (req, res) => {
  try {
    if(req.body.name && req.body.email && req.body.password){
      const currentUser = await User.findOne({email: req.body.email});
      if(!currentUser){
        let hashedPass = await bcrypt.hash(req.body.password, 12);
        const newUser = new User({
          name: req.body.name,
          password: hashedPass,
          email: req.body.email,
        });
        await newUser.save();
        const token = newUser.generateJwtToken();
        req.session.jwtToken = token;
        req.session.name = newUser.name;
        return res.status(201).redirect(`/`);
      } else {
        res.status(401).json({
          success: false,
          message: `this email is already exists.`,
          data: null
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: `bad request`,
        data: null
      });
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

// @desc    get home api
// @route   GET `/api/home`
// @access  public
exports.getHomeApi = async (req, res) => {
  
  // find user
  const currentUser = await User.findById();
  
  res.status(200).json({
    success: true,
    message: `show user data`,
    data: {name: req.user.name}
  });
};

// @desc    handle logout post request
// @route   POST `/logout`
// @access  private
exports.postLogout = (req, res) => {
  req.session.destroy();
  res.redirect(`/auth`);
};

// @desc    handle send email post request
// @route   POST `/sendEmail`
//access    private
exports.postSendEmail = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact details</h3>
      <ul>
        <li>Name: ${currentUser.name}</li>
        <li>Email: ${currentUser.email}</li>
      </ul>
      <br>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;
  
    mailer.sendMail({
      to: `sam.m.goher@gmail.com`,
      from: `madrasy101@gmail.com`,
      subject: req.body.subject,
      html: output
    });
    res.status(200).redirect(`/`);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

// @desc    get reset page
// @route   GET `/reset`
// @access  public
exports.getReset = (req, res) => {
  res.status(200).render(`reset`, {
    csrfToken: req.csrfToken()
  });
};

// @desc    handle post request of reset page
// @route   POST `/reset`
// @access  private
exports.postReset = async (req, res) => {
  const currentUser = await User.findOne({email: req.body.email});
  if(!currentUser){
    return res.status(404).json({
      success: false,
      message: `this email not exist.`,
      data: null
    });
  }
  let token = crypto.randomBytes(32).toString(`hex`);
  currentUser.resetToken = token;
  currentUser.resetTokenExpiration = Date.now() + 3600000;
  await currentUser.save();
  const output = `
      <p>You have a new contact request</p>
      <h3>Message</h3>
      <p>to reseting your password please ckeck the link bellow</p>
      <h1><a href='http://localhost:3000/reset/${token}'>reset your password</a></h1>
    `;
    mailer.sendMail({
      to: currentUser.email,
      from: `sam.m.goher@gmail.com`,
      subject: `reset your password`,
      html: output
    });
  res.status(200).send(`<h1>Ckeck your email</h1>`);
};

// @desc    get page that ckeck resetToken
// @route   GET `/reset/:token`
// @access  private of specific user
exports.getResetToken = async (req, res) => {
  const currentUser = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpiration: {$gt: Date.now()}
  });
  if(!currentUser) {
    return res.status(400).json({
      success: false,
      message: `token expired or not found`,
      data: null
    });
  }
  req.session.email = currentUser.email;
  req.session.resetToken = true;
  res.status(200).redirect(`/newpassword`);
};

// @desc    get page of setting new password
// @route   GET `/newpassword`
// @access  private of specific user
exports.getNewPassword = async (req, res) => {
  if(!req.session.resetToken){
    return res.status(400).redirect(`/auth`);
  }
  const currentUser = await User.findOne({email: req.session.email});
  currentUser.resetToken = undefined;
  currentUser.resetTokenExpiration = undefined;
  await currentUser.save();
  res.status(200).render(`newpassword`, {
    email: req.session.email,
    csrfToken: req.csrfToken()
  });
};

// @desc    handle post request of newpassword page
// @route   POST `/newpassword`
// @access  private
exports.postNewPassword = async (req, res) => {
  const currentUser = await User.findOne({email: req.session.email});
  if(!currentUser){
    return res.status(404).redirect(`/auth`);
  }
  const hashedPass = await bcrypt.hash(req.body.password, 12);
  currentUser.password = hashedPass;
  await currentUser.save();
  res.status(200).redirect(`/auth`);
};