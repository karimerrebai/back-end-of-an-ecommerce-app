const Product = require("../Models/Product");
const Subcategory = require("../Models/Subcategory");

createProduct = async (req, res) => {
  try { 
   // req.body["galleries"] = req.file.filename //lire une seul image file;
    req.body['galleries'] =
    req.files.length <= 0 ? []
    : req.files.map(function(file) {
     return {name:file.filename,description:'add prod'}//galleryschema:name=nom de photo,description=add prod
    }) 
    const newProduct = new Product(req.body);

    await newProduct.save();
    await Subcategory.findByIdAndUpdate(
      { _id: req.body.subcategory },
      { $push: { products: newProduct } }
    );
    res.status(200).json({
      msg: "product created",
      data: newProduct,
    });
  } catch (error) {
    res.status(404).json({
      msg: "product creation failed",
      error: error.message,
    });
  }
};
getAllProducts = async (req, res) => {
  try {
    const listeProducts = await Product.find({}).populate({path:"subcategory",populate:{path:'category'}} )//populate composé;
    res.status(200).json({
      msg: "list of products:",
      data: listeProducts,
    });
  } catch (error) {
    res.status(404).json({
      msg: "getallproducts failed",
      error: error.message,
    });
  }
};
getProductById = async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id }).populate(
      "subcategory"
    );
    res.status(200).json({
      msg: "prod by id:",
      data: product,
    });
  } catch (error) {
    res.status(404).json({
      msg: "getprod by id:error",
      error: error.message,
    });
  }
};
updateProduct = async (req, res) => {
  try {
   req.body["galleries"] = req.file.filename; //lire une seul image file
    await Product.updateOne({ _id: req.params.id }, req.body);
    res.status(200).json({
      msg: "product updated",
    });
  } catch (error) {
    res.status(404).json({
      msg: "product updated failed",
      error: error.message,
    });
  }
};
deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id });
    await Product.findByIdAndUpdate(product.subcategory, {
      $pull: { products: req.params.id },
    });
    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({
      msg: "product deleted",
    });
  } catch (error) {
    res.status(404).json({
      msg: "delete product failed",
      error: error.message,
    });
  }
}
searchproduct=async(req,res)=>{
try {
  const prod = await Product.find(
    {"$or": [
      {"description" :{ $regex:req.params.key}},
     // "reference":{$reference:req.params.key}
    ]
  }
  )
  res.status(200).json({
    data:prod
  })
} catch (error) {
  res.status(404).json({
    msg:"product not found",
    error:error.message
  })
}
};
module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchproduct
};
