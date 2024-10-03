const router = require("express").Router();
const User = require("../models/user");
const{ authenticateToken} = require("./userAuth")

router.get("/favourites", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id);
        return res.status(200).json({ data: userData.favourites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "internal server error" });
    }
});



router.delete ("/remove-book-from-favourite",authenticateToken,async (req,res) => {
    try {
        const {bookid, id} = req.headers;
        const userData = await User.findById(id)
        const isBookFavourite = userData.favourites.includes(bookid);
        if(isBookFavourite) {
            await User.findByIdAndUpdate(id,{$pull:{favourites:bookid}})
        }
        return res.status(200).json({message:"book remove from favourites"})
    } catch (error) {
        res.status(500).json({message:"internal server error"})
    }
})

router.get ("/get-favourite-books", authenticateToken, async (req,res) => {
    try {
        const {id} = req.headers;
        const userData = await User.findById(id).populate("favourites")
        const favouriteBooks = userData.favourites;
        return res.json({
            status:"success",
            data: favouriteBooks
        })

    } catch (error) {
        return res.status(500).json({message:"An error occurred"})
        
    }
})

module.exports = router;