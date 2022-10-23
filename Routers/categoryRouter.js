const route =require('express').Router()
const categorycontroller =require('../Controllers/categoryController')
route.post('/createCategory',categorycontroller.createCategory)
route.get('/getAllCategorys',categorycontroller.getAllCategorys)
route.get('/getCategoryById/:id',categorycontroller.getCategoryById)
route.put('/updateCategory/:id',categorycontroller.updateCategory)
route.delete('/deleteCategory/:id',categorycontroller.deleteCategory)
module.exports=route
