const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// CORS setup - allow both localhost and production frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://e-commerece-app-ecru.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parsers - increased limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'E-Commerce API is running' });
});

// Import Routes
const product = require("./routes/productsRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const chat = require("./routes/chatRoute");
const admin = require("./routes/adminRoute");

// Use Routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", chat);
app.use("/api/v1", admin);

// Error Middleware
const errorMiddleware = require("./middleware/error");
app.use(errorMiddleware);

module.exports = app;
