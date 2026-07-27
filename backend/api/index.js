const app = require("../app");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");

// Configuration
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDatabase();

// Export for Vercel serverless
module.exports = app;
