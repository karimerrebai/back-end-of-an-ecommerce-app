const route=require('express').Router()
const subcontroller=require('../Controllers/subcategoryController')
route.post('/createSubcategory',subcontroller.createSubcategory)
route.get('/getAllSubCategorys',subcontroller.getAllSubCategorys)
route.get('/getSubcategoryById/:id',subcontroller.getSubcategoryById)
route.put('/updateSubcategory/:id',subcontroller.updateSubcategory)
route.delete('/deleteSubcategory/:id',subcontroller.deleteSubcategory)
module.exports=route