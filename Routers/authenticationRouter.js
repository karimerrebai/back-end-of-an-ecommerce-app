const route = require("express").Router();

const authcontroller = require("../Controllers/authenticationController");
const uploadimage = require("../Middlewares/uploadimage");
const checkiden = require("../Middlewares/checkidentification");
const passport = require("passport");

require("../Middlewares/passport_authentication").passport;

route.post(
  "/registerAdmin",
  uploadimage.single("photo"),
  authcontroller.registerAdmin
);
route.post(
  "/registerCustomer",
   uploadimage.single("photo"),
  authcontroller.registerCustomer
);

route.get("/verifynow/:verifycode", authcontroller.verifyEmail);

route.post("/login", authcontroller.login);

route.get("/profile_check", checkiden, authcontroller.profile); //juste une methode
route.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  authcontroller.profile
); //la methode le plus utile

route.put(
  "/updateProfile",
  passport.authenticate("jwt", { session: false }),
  authcontroller.updateProfile
);

route.get("/forgetPassword", authcontroller.forgetPassword);
route.get(
  "/resetnewpassword/:reset",
  passport.authenticate("jwt", { session: false }),
  authcontroller.resetPassword
);

//indiv
route.get("/getallCustomer", authcontroller.getallCustomer);
route.post("/registerProvider", authcontroller.registerProvider);
route.get("/getallprovider", authcontroller.getallprovider);
route.get(
  "/getallproviderwithpagination",
  authcontroller.getallproviderwithpagination
);
route.get("/getalladmin",authcontroller.getalladmin)
route.get("/searchingProvider", authcontroller.searchingProvider);
module.exports = route;
