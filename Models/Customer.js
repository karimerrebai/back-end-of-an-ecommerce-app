const mongoose = require('mongoose')
const User=require('./User')
const schemaCustomer = new mongoose.Schema(
    {
        picture: {
            type: String,
            required: false
        },
        address: {
            type: String,
            required: true,
           // minlength: 4,
        },
        city: {
            type: String,
            required: true,
           // minlength: 3,
        },
        cin: {
            type: Number,
            required: true,
            trim: true,
           // minlength: 7,
        },
        orders:[{
            type:mongoose.Types.ObjectId,
            ref:'Order',
            required:false
        }]
    }, { timestamps: true }
)
module.exports = User.discriminator('Customer',schemaCustomer)//methode discriminator : une methode en heritage
