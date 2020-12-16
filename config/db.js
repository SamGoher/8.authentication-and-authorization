// application requirements
const mongoose = require(`mongoose`);

// function to connect to database
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log(`conecting to database ...`);
  } catch (error) {
    // logging error to the console
    console.log(`Error: ${error.message}`);
  }
}

module.exports = connectDB;