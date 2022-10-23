const {connect}=require('mongoose')
const {success,error}=require('consola')
const DB=process.env.APP_DB
const connectDB =async ()=>{
    try {
        await connect (DB)
        success({
            message:`successfully connected with the database \n ${DB}`,
            badge:true,
        })
    } catch (err) {
        error({
            message :`connection failed : ${err.message}`,
            badge:true,
        })
        connectDB()
    }
}
module.exports=connectDB() 