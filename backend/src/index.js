import express from "express";
import dotenv from "dotenv";
import authRouter from "./routers/auth.routh.js";
import messageRouter from "./routers/message.routh.js";
import { connectDB } from "./lib/DB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app , server } from "./lib/socket.js";
import bodyParser from 'body-parser';


dotenv.config();
const PORT = process.env.PORT;
// 

app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

server.listen(PORT, () => {
  console.log("Server is running on Port:" + PORT);
  connectDB();
});
