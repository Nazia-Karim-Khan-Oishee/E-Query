const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const validator = require("validator");
const crypto = require("crypto");
const passwordValidator =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-_+=])[A-Za-z\d!@#$%^&*()-_+=]{8,}$/;
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email address"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email address"],
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Please enter a name"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Minimum password length is 8 characters"],
    validate: {
      validator: function (value) {
        return passwordValidator.test(value);
      },
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
    },
  },
  phone: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  role: {
    type: String,
  },

  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});
//After saving user document in db
userSchema.post("save", function (doc, next) {
  console.log("new user was created & saved", doc);
  next();
});
// Before saving user document in database
userSchema.pre("save", async function (next) {
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.statics.signup = async function (
  username,
  email,
  password,
  phone,
  address
) {
  if (!email) {
    throw new Error("Email and password are required");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }
  const exists = await this.findOne({ email });
  if (exists) {
    throw new Error("User with this email already exists");
  }
  const user = await this.create({
    username,
    email,
    password,
    phone,
    address,
  });
  return user;
};

userSchema.statics.login = async function (userId, password) {
  if (!userId || !password) {
    throw Error("All fields are required");
  }
  let user;
  if (validator.isEmail(userId) == true) {
    user = await this.findOne({ email: userId });
  } else {
    user = await this.findOne({ username: userId });
  }

  if (!user) {
    throw Error("Incorrect email or username");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  return user;
};

userSchema.methods.createPasswordResetToken = function () {
  let randomNumber = Math.floor(Math.random() * 1000000);
  let resetToken = randomNumber.toString().padStart(6, "0");
  this.passwordResetToken = resetToken;
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
