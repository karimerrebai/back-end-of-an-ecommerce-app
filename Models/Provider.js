//matricule,company,service
const mongoose = require('mongoose')
const User=require('./User')
const schemaProvider = new mongoose.Schema({
    matricule: {
        type: String,
        required: true,
        minlength: 4,
        trim: true,
    },
    company: {
        type: String,
        required: true,
        minlength: 3,
    },
    service: {
        type: String,
        required: true,
        minlength: 4,
    }

}, { timestamps: true }
)
module.exports = User.discriminator('Provider', schemaProvider)