const mongoose = require("mongoose");
const { Schema } = mongoose;

const countySchema = new Schema(
    {
        name: { type: String, required: [true, 'Name is required'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("County", countySchema);