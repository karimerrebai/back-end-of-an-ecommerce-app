const Admin = require("../Models/Admin");
const Customer = require("../Models/Customer");
const Provider = require("../Models/Provider");
const Product = require("../Models/Product");

const bcrypt = require("bcrypt");
const { randomBytes } = require("crypto"); //module node js
const { join } = require("path"); //direction vers in fichier
const jwt = require("jsonwebtoken");
require("dotenv").config();
const DOMAIN = process.env.APP_DOMAIN;
const SECRET = process.env.APP_SECRET;
const nodemailer = require("nodemailer");
const User = require("../Models/User"); //
const { userInfo } = require("os");

var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io", //notre compte
  port: 2525,
  auth: {
    user: "9ec22d03b8111d",
    pass: "7baa16f1c1b103",
  },
});

registerAdmin = async (req, res) => {
  try {
    req.body["picture"] = req.file.filename;
    const password = bcrypt.hashSync(req.body.password, 10); //plus perfermenance que .hash
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
      verificationCode: randomBytes(6).toString("hex"), //combinaison entre//randomBytes(6):en 6bits
    });
    await newCustomer.save();
    res.status(200).json({
      message: "Customer created",
      data: newCustomer,
    });
    transport.sendMail(
      {
        to: newCustomer.email, //receivers
        subject: "welcome :" + newCustomer.fullname,
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
      msg: "fail to create customer",
      error: error.message,
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
        //compare le password et le password hachée
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
    await User.updateOne({ _id: req.user._id }, req.body);
    console.log(req.user);
    res.status(200).json({
      msg: "profile updated",
    });
  } catch (error) {
    res.status(404).json({
      msg: "profile updated failed",
      error: error.message,
    });
  }
};
forgetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    //console.log(user)
    if (!user) {
      res.status(404).json({
        msg: "email not found",
      });
    } else {
      if (user.verified === true) {
        const token = jwt.sign({ user: user, id: user._id }, SECRET, {
          expiresIn: "24h",
        }); //creation de token
        user.verificationpassword = token;
        user.save();
        res.status(200).json({
          msg: "check out your email please!",
          data: user,
        });
        transport.sendMail(
          {
            to: user.email, //receivers
            subject: "welcome " + user.fullname,
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
                        <h2>hello ${user.fullname} </h2>
                        <p>${user.email}  </p>
                        <a href="${DOMAIN}resetnewpassword/${token}">click to reset your password </a>
                   
                    </body>
                    </html>`,
          },
          (err, sent) => {
            if (err) {
              console.log(err.message + " not sent ");
            } else {
              console.log("forgetPassword:email sent");
            }
          }
        );
      } else {
        res.status(404).json({
          msg: "email not verified",
        });
      }
    }
  } catch (error) {
    res.status(404).json({
      msg: "new password failed",
      error: error.message,
    });
    //console.log("forgot password failed :"+error.message)
  }
};
resetPassword = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });
    user.password = bcrypt.hashSync(req.body.password, 10);
    user.verificationpassword = undefined;
    console.log(user);
    user.save();
    res.status(200).json({
      msg: "new password is done",
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      msg: "new password failed",
      error: error.message,
    });
  }
};
//indiv
getalladmin = async (req, res) => {
  try {
    const listadmin = await Admin.find({});
    res.status(200).json({
      msg: "list of admin:",
      data: listadmin,
    });
  } catch (error) {
    res.status(404).json({
      msg: "list of admin failed",
      error: error.message,
    });
  }
};
getallCustomer = async (req, res) => {
  try {
    const Listcustomer = await Customer.find({});
    res.status(200).json({
      msg: "list of customer",
      data: Listcustomer,
    });
  } catch (error) {
    res.status(404).json({
      msg: "list of customer failed",
      error: error.message,
    });
  }
};

registerProvider = async (req, res) => {
  try {
    const password = bcrypt.hashSync(req.body.password, 10);
    const newProvider = new Provider({
      ...req.body,
      password,
      verificationCode: randomBytes(6).toString("hex"),
    });

    await newProvider.save();
    //await Product.findByIdAndUpdate({_id:req.body.product},{$push:{providers:newProvider}})
    res.status(200).json({
      msg: "provider created",
      data: newProvider,
    });
    transport.sendMail(
      {
        to: newProvider.email,
        subject: "welcome " + newProvider.fullname,
        text: "bonjour !!!!",
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
                    <h2>hello ${newProvider.fullname} </h2>
                    <p> ${newProvider.email}  </p>
                    <a href="${DOMAIN}verifynow/${newProvider.verificationCode}" >verify now </a>
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
      msg: "fail to create provider",
      error: error.message,
    });
  }
};
getallprovider = async (req, res) => {
  try {
    const listprovider = await Provider.find({}).populate("product");

    res.status(200).json({
      msg: "list of providers:",
      data: listprovider,
    });
  } catch (error) {
    res.status(404).json({
      msg: "list of providers: failed",
      error: error.message,
    });
  }
};
getallproviderwithpagination = async (req, res) => {
  try {
    //adding pagination
    const limitvalue = req.query.limit; // || 2;
    const skipvalue = req.query.skip; // || 1;
    const listprovider = await Provider.find({})
      .populate("product")
      .limit(limitvalue)
      .skip(skipvalue);
    console.log("pagination created");
    //limit:specifies the maximum number of documents the query will return
    //skip :specifies the number of documents to skip
    res.status(200).json({
      msg: "list of providers:",
      data: listprovider,
    });
  } catch (error) {
    res.status(404).json({
      msg: "list of providers: failed",
      error: error.message,
    });
  }
};
searchingProvider = async (req, res) => {
  try {
    const provider = await Provider.find({ fullname: req.query.name });
    res.status(200).json({
      msg: "provider found:",
      data: provider,
    });
  } catch (error) {
    res.status(404).json({
      msg: "searching provider failed",
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
  updateProfile,
  forgetPassword,
  resetPassword,
  getallCustomer,
  registerProvider,
  getallprovider,
  getallproviderwithpagination,
  searchingProvider,
  getalladmin,
};
