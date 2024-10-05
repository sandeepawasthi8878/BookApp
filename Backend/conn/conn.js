const mongoose = require("mongoose");
require('dotenv').config();  // Load environment variables

const conn = async () => {
    try {
        const uri = process.env.URI;  // Access the uri variable from the .env file
        console.log('Connecting to MongoDB with URI:', uri);  // Optional: for debugging
        
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
}

conn();