const route = require("express").Router();

const authcontroller = require("../Controllers/authenticationController");
const uploadimage = require("../Middlewares/uploadimage");
const checkiden =require('../Middlewares/checkidentification')
const passport=require("passport")

require('../Middlewares/passport_authentication').passport


route.post("/registerAdmin", authcontroller.registerAdmin);
route.post(
  "/registerCustomer",
  uploadimage.single("photo"),
  authcontroller.registerCustomer
);
route.get("/verifynow/:verifycode", authcontroller.verifyEmail);
route.get('/login',authcontroller.login)

route.get('/profile_check',checkiden,authcontroller.profile)
route.get('/profile',passport.authenticate('jwt',{session:false}),authcontroller.profile)

route.put('/updateProfile',checkiden,authcontroller.updateProfile)

module.exports = route;
