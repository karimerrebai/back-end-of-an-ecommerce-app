const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.APP_SECRET;
checkIden = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      res.status(403).json({
        message: "no token",
      });
    }
    /*     await jwt.verify(token, SECRET, (err, decoder) => {
      if (err) {
        res.status(401).json({
          msg: "identification failed verified",
          error: err.message,
        });
      }
      console.log(decoder);
      req.user = decoder;
      next();
    });  */ //verify:verifier date d'expiration et recuperer user
    const decoder = await jwt.verify(token, SECRET);//verify:verifier date d'expiration et recuperer user
    //console.log(decoder);
    req.user = decoder;
    next();
  } catch (error) {
    res.status(401).json({
      msg: "identification failed",
      error: error.message,
    });
  }
};
module.exports = checkIden;
//cette mthode n'a pas un accées a la base de données  