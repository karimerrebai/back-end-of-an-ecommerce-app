const Order = require("../Models/Order");
const Customer = require("../Models/Customer");

addOrder = async (req, res) => {
  try {
   // req.body["customer"] = req.user._id;
    const newOrder = new Order(req.body);
    await newOrder.save();
    //await Customer.findByIdAndUpdate(
     // { _id: req.user._id },
    //  { $push: { orders: newOrder } }
   // );
    res.status(200).json({
      msg: "order success",
      data: newOrder,
    });
  } catch (error) {
    res.status(404).json({
      msg: "order failed ",
      error: error.message,
    });
  }
};
deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById({ _id: req.params.id }); //find order by id
    await Customer.findByIdAndUpdate(req.user._id, {
      $pull: { orders: req.params.id },
    });
    await Order.deleteOne({ _id: req.params.id });
    res.status(200).json({
      msg: "delete order: success",
    });
  } catch (error) {
    res.status(404).json({
      msg: "delete order :failed",
      error: error.message,
    });
  }
};
getallorder=async(req,res)=>{
  try {
    const list =await Order.find({})
    res.status(200).json({
      msg:"list orders",
      data:list
    })
  } catch (error) {
    res.status(404).json({
      msg:"list order failed",
      error:error.message
    })
  }
}
module.exports = { addOrder, deleteOrder,getallorder };
