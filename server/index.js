import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config(); 

// Import your router files
// NOTE: Make sure the paths are correct relative to your server's index.js
import UserRouter from "./routes/User.js";        
import ProductRoutes from "./routes/Products.js";  

const app = express();

// --- Middleware Setup ---
app.use(cors());
app.use(express.json({ limit: "50mb" })); // To handle JSON bodies
app.use(express.urlencoded({ extended: true }));


// --- MongoDB Connection Logic ---
const connectDB = async () => {
  try {
    // Check if the MONGO_URL is set in your .env file
    if (!process.env.MONGO_URL) {
        console.error("❌ ERROR: MONGO_URL environment variable is not defined in your .env file.");
        process.exit(1);
    }
    
    // Set up Mongoose connection options
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Optional: Add a connection timeout to fail faster if the network is the issue
      serverSelectionTimeoutMS: 5000, 
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect with MongoDB. Check your MONGO_URL and Atlas Network Access.");
    console.error(err.message); // Log the specific error message
    process.exit(1); // Stop server if DB fails
  }
};


// --- Route Definitions ---

// Test route to ensure Express is running
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Style Sync Backend Server is running!",
  });
});

// Attach your Routers
app.use("/api/user/", UserRouter);        
app.use("/api/products/", ProductRoutes);  


// --- Error Handler Middleware (MUST be last) ---
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong on the server.";
  
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});


// --- Server Startup Function ---
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  // 1. Connect to the database first
  await connectDB();
  
  // 2. Start listening for requests
  app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
};

// Execute the startup function
startServer();
