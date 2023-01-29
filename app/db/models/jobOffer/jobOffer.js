const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Brand = require("../brand/brand.js");

const jobSchema = new Schema({
  title: {
    type: String,
    required: [true, "This field is required"],
    trim: true,
  },
  brand: {
    type: mongoose.Types.ObjectId,
    required: [true, "This field is required"],
    ref: Brand,
  },
  brandSlug: {
    type: String,
    required: [true, "This field is required"],
  },
  city: {
    type: String,
    required: [true, "This field is required"],
    trim: true,
  },
  techStack: {
    type: String,
    required: [true, "This field is required"],
  },
  description: {
    type: String,
    required: [true, "This field is required"],
  },
  price: {
    type: String,
    required: false,
    trim: true,
  },
  seniority: {
    type: String,
    required: [true, "This field is required"],
    trim: true,
    lowercase: true,
  },
  employmentType: {
    type: String,
    required: [true, "This field is required"],
    trim: true,
    lowercase: true,
  },
  jobDate: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
