const mongoose=require('mongoose')
const schemaitemOrder= new mongoose.Schema({
    product:{
        type:mongoose.Types.ObjectId,
        ref:"Product",
        required:false
    },
    qte:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
})
const schemaOrder =new mongoose.Schema({
    pricetotal:{
        type:Number,
        required:true
    },
    itemorder:[schemaitemOrder]
    ,
    qtetotal:{
        type:Number,
        required:true
    },
    reforder:{
        type:Number,
        required:false,
        
    },
    date:{
        type:Date ,
        required:false
    },
    customer:{
        type:mongoose.Types.ObjectId,
        ref:'Customer',
        required:true
    }
},{timestamps:true})
module.exports=mongoose.model('Order',schemaOrder)