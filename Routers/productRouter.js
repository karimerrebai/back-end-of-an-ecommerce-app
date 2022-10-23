const route = require("express").Router();
const uploadimage = require("../Middlewares/uploadimage");
const controllerproduct = require("../Controllers/productController");

route.post(
  "/createProduct",
   uploadimage.array("photos"),
  controllerproduct.createProduct
);

route.get("/getAllProducts", controllerproduct.getAllProducts);

route.get("/getProductById/:id", controllerproduct.getProductById);

route.put(
  "/updateProduct/:id",
  uploadimage.single("photo"),
  controllerproduct.updateProduct
);

route.delete("/deleteProduct/:id", controllerproduct.deleteProduct);
route.get("/searchproduct/:key",controllerproduct.searchproduct)

//route.post(
//"/createProductphotos",
//uploadimage.array('photos',2),
//controllerproduct.createProduct
//); //upload images avec limite de 2 photos max
module.exports = route;

//route.get("/path",middelware,fonction)
