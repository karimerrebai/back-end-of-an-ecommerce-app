const mongoose = require('mongoose')
const schemaUser = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
            
            minlength: 4,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        
        },
        password: {
            type: String,
            required: true,
            minlength: 5,
        },
        phone: {
            type: Number,
            required: true,

            minlength: 8,
            trim: true,

        },
        verified:{
            type:Boolean,
            default:false,
        },
        verificationCode:{
            type:String,
            required:false,
        }
    }, { timestamps: true }
)

module.exports = mongoose.model('User', schemaUser)