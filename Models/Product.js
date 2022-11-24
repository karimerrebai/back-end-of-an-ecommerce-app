const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});
const schemaProduct = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true
    }
    ,
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    galleries: [GallerySchema],
    qte: {
      type: Number,
      required: false,
    },
    //relation
    subcategory: {
      type: mongoose.Types.ObjectId,
      ref: "Subcategory",
      required: false,
    },
    providers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Provider",
        required: false,
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", schemaProduct);
