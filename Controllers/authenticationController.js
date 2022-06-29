const Admin = require("../Models/Admin");
const Customer = require("../Models/Customer");

const bcrypt = require("bcrypt");
const { randomBytes } = require("crypto"); //module node js
const { join } = require("path"); //
const jwt = require("jsonwebtoken");
require("dotenv").config();
const DOMAIN = process.env.APP_DOMAIN;
const SECRET = process.env.APP_SECRET;
const nodemailer = require("nodemailer");
const User = require("../Models/User"); //

var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io", //notre compte
  port: 2525,
  auth: {
    user: "d9ca72c3cda801",
    pass: "5990b50fd44d7f",
  },
});

registerAdmin = async (req, res) => {
  try {
    const password = bcrypt.hashSync(req.body.password, 10); //plus perfermenance que .hash

    //
    /*const newAdmin = new Admin(req.body)*/
    const newAdmin = new Admin({ ...req.body, password, verified: true }); //varified:true :admin est verifiee par default
    /* or {name:req.body.name ,
            email:req.body.email,
            password}*/
    await newAdmin.save();
    res.status(200).json({
      message: "Admin created ",
      data: newAdmin,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
registerCustomer = async (req, res) => {
  try {
    req.body["picture"] = req.file.filename;
    const password = bcrypt.hashSync(req.body.password, 10);
    const newCustomer = new Customer({
      ...req.body,
      password,
      verificationCode: randomBytes(6).toString("hex"), //combinaison entre
    });
    await newCustomer.save();
    res.status(200).json({
      message: "Customer created",
      data: newCustomer,
    });
    transport.sendMail(
      {
        to: newCustomer.email, //receivers
        subject: "welcome " + newCustomer.fullname,
        text: "bonjour monsieur !",
        html: `
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <h2>hello ${newCustomer.fullname} </h2>
                    <p> xxxxxxxxxxxxxxxxxx ${newCustomer.email}  </p>
                    <a href="${DOMAIN}verifynow/${newCustomer.verificationCode}" >verify now </a>
                </body>
                </html>`,
      },
      (err, sent) => {
        if (err) {
          console.log(err.message + " not sent ");
        } else {
          console.log("email sent");
        }
      }
    );
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      verificationCode: req.params.verifycode,
    });
    user.verified = true;
    user.verificationCode = undefined;
    user.save();
    res.sendFile(join(__dirname, "../Templates/success.html"));
  } catch (error) {
    res.sendFile(join(__dirname, "../Templates/error.html"));
  }
}; //fonction verify :nous permet de verifier l'email de quelque soit user :(admin,provider,customer)
login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json({
        message: "not logged ",
      });
    } //si user conditionné est exist ou non
    if (user.verified === true) {
      //compte verifieé ou non
      const passwordCompare = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordCompare) {
        res.status(404).json({
          message: "password incorrect",
        });
      } //password correct ou non
      const token = jwt.sign({ user: user, id: user._id }, SECRET, {
        expiresIn: "24h",
      }); //:creation token
      const result = { email: user.email, user: user, token: token }; //result:les donnés qui nous demande de l'afficher
      res.status(200).json({
        message: "logged",
        ...result, //...les contenu de result
      });
    } else {
      res.status(404).json({
        message: "user not verified",
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
profile = async (req, res) => {
  try {
    const user = req.user;
    //  console.log(user);
    res.status(200).json({
      message: "profile",
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      message: "profile failed",
      error: error.message,
    });
  }
};
updateProfile = async (req, res) => {
  try {
    //const user= await User.updateOne({fullname:req.query.full},req.body)
    //const userX=await User.updateOne({_id:req.params.id},req.body)
     user=req.user
    //user=User({...req.body}) 
    //user=User({...req.query.fullname})
    //user=User({...{user:req.body}})
    
    console.log(user)
    res.status(200).json({
      message:"updated",
      data:user,
      
      
    })
  } catch (error) {
    res.status(404).json({
      message: "update failed",
      error: error.message,
    });
  }
};
module.exports = {
  registerAdmin,
  registerCustomer,
  verifyEmail,
  login,
  profile,
  updateProfile
};
