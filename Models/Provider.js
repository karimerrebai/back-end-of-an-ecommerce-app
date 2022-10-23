//matricule,company,service
const mongoose = require('mongoose')
const User=require('./User')
const schemaProvider = new mongoose.Schema({
    matricule: {
        type: String,
        required: true,
        
       
    },
    company: {
        type: String,
        required: true,
       
    },
    service: {
        type: String,
        required: true,
        
    },
    product:{
        type:mongoose.Types.ObjectId,
        ref:'Product',
        required:false
    }

}, { timestamps: true }
)
module.exports = User.discriminator('Provider', schemaProvider)