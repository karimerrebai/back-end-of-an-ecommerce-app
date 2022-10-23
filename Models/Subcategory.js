const mongoose = require("mongoose");
const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category:{//relation one
    type:mongoose.Types.ObjectId,//type du module mongoose
    ref:'Category',//ref:le model qui a la relation avec notre model
    required:false
  },
  products:[{
    type:mongoose.Types.ObjectId,
    ref:'Product',
    required:false
  }]
},
{timestamps:true});
module.exports=mongoose.model('Subcategory', subcategorySchema)