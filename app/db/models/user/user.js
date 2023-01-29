const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { validateEmail } = require("../../validator/validators.js");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "This field is required"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validateEmail, "Email is incorrect"],
  },
  password: {
    type: String,
    required: [true, "This field is required"],
    minLength: [8, "Password must have minimum 8 signs"],
  },
  firstName: {
    type: String,
    required: [true, "This field is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "This field is required"],
    trim: true,
  },
  userJob: {
    type: String,
    required: false,
    default: "",
  },
  technologySkills: {
    type: String,
    required: false,
    default: "",
  },
  userDescription: {
    type: String,
    required: false,
    default: "",
  },
  age: {
    type: Number,
    required: [true, "This field is required"],
  },
  country: {
    type: String,
    required: [true, "This field is required"],
  },
  city: {
    type: String,
    required: false,
    default: "",
  },
  websiteLink: {
    type: String,
    required: false,
    default: "",
  },
  githubLink: {
    type: String,
    required: false,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  next();
});
userSchema.post("save", function (err, doc, next) {
  if (err.code === 11000) {
    err.errors = {
      email: {
        message: "Email is already used",
      },
    };
  }

  next(err);
});

userSchema.methods = {
  isValidPswd(password) {
    return bcrypt.compareSync(password, this.password);
  },
};

const User = mongoose.model("User", userSchema);
module.exports = User;
