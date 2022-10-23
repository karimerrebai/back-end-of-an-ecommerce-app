const mongoose = require("mongoose");
const User = require("./User");
const schemaAdmin = new mongoose.Schema(
  {
    picture: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = User.discriminator("Admin", schemaAdmin);
