const mongoose = require('mongoose')
const schemaUser = new mongoose.Schema(
    {
        fullname: {
            type: String,required: true,
            //minlength: 4,
        },
        email: {
            type: String,required: true,
            unique: true,trim: true,
        },
        password: {
            type: String,
            required: true,
            
        },
        phone: {
            type: Number,
            required: true,

        
            trim: true,
        },
        verified:{
            type:Boolean,
            default:false,
        },
        verificationCode:{
            type:String,
            required:false,
        },
        verificationpassword:{
            type:String,
            required:false
        }
    }, { timestamps: true }
)
module.exports = mongoose.model('User', schemaUser)