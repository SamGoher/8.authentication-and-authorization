// application requirements
const express = require(`express`);
const bodyParser = require(`body-parser`);
const session = require(`express-session`);
const dotenv = require(`dotenv`);
const csrf = require(`csurf`);
const csrfProtection = csrf();
const app = express();

// loading modules
const errorController = require(`./controllers/error`);
const auth = require(`./routes/auth`);
const signup = require(`./routes/signup.js`);
const home = require(`./routes/home`);
const connectDB = require(`./config/db`);

// using body-parser
app.use(bodyParser.urlencoded({extended: true}));

// using ejs
app.set(`view engine`, `ejs`);

// using dotenv
dotenv.config({path: `./config/.env`});

// connecting to database
connectDB();

// using session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true
  }
}));

// using csrf protection middleware
app.use(csrfProtection);

// serving views
app.use(auth);
app.use(signup);
app.use(home);
app.use(errorController.gerError);

// setting port
let PORT = process.env.PORT;

// listein to port
app.listen(PORT, () => {
  console.log(`server listening to port ${PORT} ...`);
});