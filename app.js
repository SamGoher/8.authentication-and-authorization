// application requirements
const express = require(`express`);
const bodyParser = require(`body-parser`);
const session = require(`express-session`);
const dotenv = require(`dotenv`);
const csrf = require(`csurf`);
const csrfProtection = csrf();
const mongoSanitize = require(`express-mongo-sanitize`);
const helmet = require(`helmet`);
const rateLimit = require(`express-rate-limit`);
const hpp = require(`hpp`);
const app = express();

// loading modules
const errorController = require(`./controllers/error`);
const auth = require(`./routes/auth`);
const signup = require(`./routes/signup.js`);
const home = require(`./routes/home`);
const connectDB = require(`./config/db`);

// handling json requests
app.use(express.json());

// using body-parser
app.use(bodyParser.urlencoded({extended: true}));

// using mongo sanitize to protect our server against noSQL injection
app.use(mongoSanitize());

// set security headers
app.set(helmet());

// rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 100
});

app.use(limiter);

// prevent http param pollution
app.use(hpp());

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