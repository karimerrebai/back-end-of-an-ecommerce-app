const Subcategory = require("../Models/Subcategory");
const Category = require("../Models/Category");
createSubcategory = async (req, res) => {
  try {
    newSubcategory = new Subcategory(req.body);

    await newSubcategory.save();
   // await Category.findByIdAndUpdate(
    //  { _id: req.body.category },
    //  { $push: { subcategories: newSubcategory } }
   // ); //push
    res.status(200).json({
      msg: "subcategory created",
      data: newSubcategory,
    });
  } catch (error) {
    res.status(404).json({
      msg: "no created",
      message: error.message,
    });
  }
};
getAllSubCategorys = async (req, res) => {
  try {
    const subcategorys = await Subcategory.find({}).populate("category");
    res.status(200).json({
      msg: "all subcategorys",
      data: subcategorys,
    });
  } catch (error) {
    res.status(404).json({
      msg: "getall error ",
      error: error.message,
    });
  }
};
getSubcategoryById = async (req, res) => {
  try {
    const sub = await Subcategory.findById({ _id: req.params.id }).populate(
      "category"
    );

    res.status(200).json({
      msg: "subcategory by id:",
      data: sub,
    });
  } catch (error) {
    res.status(404).json({
      msg: "get subcategory by id :error " + error.message,
    });
  }
};
updateSubcategory = async (req, res) => {
  try {
    await Subcategory.updateOne({ _id: req.params.id }, req.body);
    res.status(200).json({
      msg: " update successfully",
    });
  } catch (error) {
    res.status(404).json({
      msg: "update subcategory failed",
      message: error.message,
    });
  }
};
deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById({ _id: req.params.id }); //selection subcateg a travers id
    await Category.findByIdAndUpdate(subcategory.category, {
      $pull: { subcategories: req.params.id },
    }); //subcategory._id ou req.params.id
     //objectif :lorsque on supprimer subcategory il doit le supprimer aussi dans subcategorys de category
    await Subcategory.deleteOne({ _id: req.params.id });
    res.status(200).json({
      msg: "delete successfully",
    });
  } catch (error) {
    res.status(404).json({
      msg: "delete failed",
      msg: error.message,
    });
  }
};
module.exports = {
  createSubcategory,
  getAllSubCategorys,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
};
