const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const nodemailer = require("nodemailer");
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socket/socketHandler");

//Handling UnCaught Exception
process.on("uncaughtException",err=>{
    console.log(`Error message : ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1)
})


//Configuration
dotenv.config({path:"./config/config.env"});
connectDatabase();

async function testSMTP() {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    transporter.verify((error) => {
        if (error) {
            console.error("❌ SMTP Connection Failed:", error.message);
        } else {
            console.log("✅ SMTP Connected Successfully");
        }
    });
}

testSMTP();

// Create HTTP server and Socket.IO
const httpServer = http.createServer(app);
const allowedOrigins = [
    'http://localhost:3000',
    'https://e-commerece-app-ecru.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Initialize socket handlers
socketHandler(io);

//Connection Server
const server = httpServer.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
    console.log(`✅ Socket.IO is ready`);
});


//Unhandled Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error message is ${err.message}`);
    console.log("Shutting down the server due to unhandled Promise rejection");
    server.close(()=>{
        process.exit(1)
    })
})