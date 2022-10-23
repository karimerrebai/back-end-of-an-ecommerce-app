const Category = require("../Models/Category");
createCategory = async (req, res) => {
  try {
    const newcategory = new Category(req.body);
    await newcategory.save();
    res.status(201).json({
      msg: "category created",
      data: newcategory,
    });
  } catch (error) {
    res.status(404).json({
      msg: "category wasn't created",
      message: error.message,
    });
  }
};
getAllCategorys = async (req, res) => {
  try {
    const Listcategorys = await Category.find({})
      .populate("subcategories")
      //.select("-name -createdAt -updatedAt -__v");
    res.status(200).json({
      msg: "all categorys:",
      data: Listcategorys,
    });
  } catch (error) {
    res.status(404).json({
      msg: " get error",
      message: error.message,
    });
  }
};
getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById({ _id: req.params.id });
    res.status(200).json({
      msg: "category found by id:",
      data: category,
    });
  } catch (error) {
    res.status(404).json({
      msg: "getId error",
      message: error.message,
    });
  }
};
updateCategory = async (req, res) => {
  try {
    await Category.updateOne({ _id: req.params.id }, req.body);
    res.status(200).json({
      msg: "category updated",
    });
  } catch (error) {
    res.status(404).json({
      msg: "updated error",
      message: error.message,
    });
  }
};
deleteCategory = async (req, res) => {
  try {
    await Category.deleteOne({ _id: req.params.id });
    res.status(200).json({
      msg: "category deleted",
    });
  } catch (error) {
    res.status(404).json({
      msg: "delete error",
      message: error.message,
    });
  }
};
module.exports = {
  createCategory,
  getAllCategorys,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
