const route =require('express').Router()
const ordercontroller=require('../Controllers/orderController')
const passport=require('passport')
require('../Middlewares/passport_authentication').passport
route.post('/addOrder'//,passport.authenticate('jwt',{session:false})
,ordercontroller.addOrder)
route.delete('/deleteorder/:id',passport.authenticate('jwt',{session:false}),ordercontroller.deleteOrder)
route.get('/getallorder'//,passport.authenticate('jwt',{session:false})
,ordercontroller.getallorder)
module.exports=route