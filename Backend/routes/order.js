const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book")
const Order = require("../models/order")
const User = require("../models/user")

router.post("/place-order", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;
        for (const orderData of order) {
            const newOrder = new Order({ user: id, book: orderData._id })
            const orderDataFromDb = await newOrder.save()

            await User.findByIdAndUpdate(id, {
                $push: { orders: orderDataFromDb._id }
            })
            await User.findByIdAndUpdate(id, {
                $pull: { cart: orderData._id }
            })
        }
        return res.json({
            status: "success",
            message: "Order Placed Successfully",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "An error ocurred" })
    }
})

router.get("/get-order-history", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" }
        })
        const orderData = userData.orders.reverse()
        return res.json({
            status: "success",
            data: orderData,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "an error occurred" })
    }
})

router.get("/get-all-orders", authenticateToken, async (req, res) => {
    try {
        const userData = await Order.find()
        .populate({
            path:"book",
        })
        .populate({
            path:"user"
        })
        .sort({createAt: -1})
        return res.json({
            status:"success",
            data:userData
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"an error occurred"})
    }
})

router.put("/update-status/:id",authenticateToken,async(req,res)=>{
    try {
        const {id} =req.params;
        await Order.findByIdAndUpdate(id, {status:req.body.status})
        return res.json({
            status :"Success",
            message:"status updated successfully"
        })
    } catch (error) {
        return res.status(500).json({massage: "an error occurred"})
    }
})
module.exports = router;