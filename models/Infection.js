const mongoose = require("mongoose");
const { Schema } = mongoose;

const infectionSchema = new Schema(
  {
    name: String,
    country: String,
    county: String,
    city: String,
    students_infected: Number,
    students_total: Number,

    country_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    county_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "County",
    },
    city_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Infection", infectionSchema);