import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';


//CREATE EXPRESS APP AND HTTP SERVER
const app = express();
const server = http.createServer(app);

//SOCKET.IO SETUP
export const io=new Server(server,{
    cors:{origin:"*"}
})
//store onlineusers
export const userSocketMap={}; //{userId:socektId}
//Socket.io connection handler
io.on("connection", (socket) => {
    const userId=socket.handshake.query.userId;
    console.log("User Connected ",userId);
    if(userId) {
        userSocketMap[userId] = socket.id; //store userId and socketId
    }
    //emmit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    //handle user disconnection
    socket.on("disconnect",()=>{
        console.log("User Disconnected ",userId);
        delete userSocketMap[userId]; //remove userId from userSocketMap
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); //emit updated online users
    })

})

//MIDDLEWARE
app.use(express.json({limit:"4mb"}));
app.use(cors());



//ROUTES
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use('/api/auth',userRouter);
app.use('/api/messages',messageRouter);

//Connect to MongoDB
await connectDB()
if(process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 5001;
    server.listen(port, () => console.log(`Server is running on port ${port}`));
} 
export default server;

        