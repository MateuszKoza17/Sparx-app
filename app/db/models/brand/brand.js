const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { checkSlugString, validateEmail } = require("../../validator/validators.js");
const bcrypt = require("bcrypt");

const brandSchema = new Schema({
  name: {
    type: String,
    required: [true, "This field is required"],
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    required: [true, "This field is required"],
    validate: (value) => checkSlugString(value, "slug"),
    trim: true,
    lowercase: true,
    unique: true,
  },
  ceo: {
    type: String,
    required: [true, "This field is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "This field is required"],
    validate: [validateEmail, "Email is incorrect"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "This field is required"],
    minLength: [8, "Password must have minimum 8 signs"],
  },
  employeesCount: {
    type: Number,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
    default: "",
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
  brandDescription: {
    type: String,
    required: false,
    default: "",
  },
  technologyStack: {
    type: String,
    required: false,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

brandSchema.pre("save", function (next) {
  const brand = this;
  if (!brand.isModified("password")) {
    return next();
  } else {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(brand.password, salt);
    brand.password = hash;
    next();
  }
});
brandSchema.post("save", function (err, doc, next) {
  if (err.code === 11000) {
    err.errors = {
      email: {
        message: "Emails is already used",
      },
    };
  }

  next(err);
});

brandSchema.methods = {
  isValidPswd(password) {
    return bcrypt.compareSync(password, this.password);
  },
};

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
