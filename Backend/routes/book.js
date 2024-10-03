const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book")
const { authenticateToken } = require("./userAuth");

router.post("/add-book", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
    
        const user = await User.findById(id);
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
    
        if (user.role !== "admin") {
            return res.status(403).json({ message: "you do not have access" });
        }
        
const book = new Book({
    url: req.body.url,
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
    desc: req.body.desc,
    language: req.body.language,
})
await book.save()
res.status(200).json({message:"book added successfully"})
    } catch (error) {
 res.status(500).json({message:"Internal server error"})
}
})

//update book 
router.post("/update-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
         await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
         });
    
         return res.status(200).json({

             message:"book update successfully"
         })
    } catch (error) {
 res.status(500).json({message:"Internal server error"})
}
})

router.delete("/delete-book", authenticateToken,async(req,res) => {
    try {
        const {bookid} =req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({
            message: "book deletd successfully",
        })
    } catch (error) {
        return res.status(500).json({message:"An error occurred"})
    }
})

router.get("/get-all-book", async (req,res) => {
    try {
        const books = await Book.find().sort({createdAt: -1})
        return res.json({
            status: 'Success',
            data:books,
        })
    } catch (error) {
        return res.status(500).json({message:"An error occurred"})
    }
})

router.get("/get-recent-books", async (req,res) => {
       try {
        const books = await Book.find().sort({createdAt: -1}).limit(4)
        return res.json ({
            status:"Success",
            data:books
        })
       } catch (error) {
        return res.status(500).json({message:"An error occuprred"})
       }
})

router.get("/get-book-by-id/:id", async (req,res) =>{
    try {
        const {id} = req.params;
        const book = await Book.findById(id);
        return res.json({
            status:"Success",
            data:book,
        })
    } catch (error) {
        return res.status(500).json({message:"An error occurres"})
    }
})

module.exports = router;