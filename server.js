const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { success, error } = require("consola");

const DB = require("./Config/db.js");
const PORT = process.env.APP_PORT || 4000;
const DOMAIN = process.env.APP_DOMAIN;
const authRoute = require("./Routers/authenticationRouter");
const categRoute=require('./Routers/categoryRouter')
const subcategRoute=require('./Routers/subcategoryRouter')
const prodRoute=require('./Routers/productRouter')
const orderRoute=require('./Routers/orderRouter')
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//pour faire affichage image sur postman
app.get('/getfile/:image',function(req,res){
  res.sendFile(__dirname +'/Storages/'+req.params.image)
  //req.params.image : input nom de l'image + extension(par exemple .png)
})

app.use("/", authRoute);
app.use("/category",categRoute)
app.use('/subcategory',subcategRoute)
app.use('/product',prodRoute)
app.use('/order',orderRoute)


app.listen(PORT, async () => {
  try {
    success({
      message: `Server started on PORT ${PORT}` + `URL ${DOMAIN}`,
      badge: true,
    });
  } catch (error) {
    error({ message: "error with " + error.message, badge: true });
  }
});
