const express =require('express')
const http=require('http')
const socketIO=require('socket.io')
const cors=require('cors')
const app=express()
const {userJoins,userLeaves,getUsers, userLeaves}=require('./utils/user')
const { Socket } = require('dgram')

const server=http.createServer(app)
const io=socketIO(server)

app.use(cors())

//permission for api request from other origins
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
    next()
})

app.get("/",(req,res)=>{
    res.send("Hi from server")
})

let imageUrl,userRoom;

io.on("connection",(socket)=>{
    socket.on("user-joined",(data)=>{
        const {roomId,userId,userName,host,presenter}=data;
        userRoom=roomId;
        const user=userJoins(socket.id,userName,roomId,host,presenter)
        const roomUsers=getUsers(user.room)
        socket.join(user.room)
        socket.emit("message",{
            message:"Welcome to Chatroom!",
        })
        socket.broadcast.to(user.room).emit("message",{
            message:`${user.username} has joined`
        })
        io.to(user.room).emit("users",roomUsers)
        io.to(user.room).emit("canvasImage",imageUrl)
    })
})

socket.on("drawing",(data)=>{
    imageUrl=data;
    socket.broadcast.to(userRoom).emit("canvasImage",imageUrl)
})

socket.on("disconnect",()=>{
    const userLeaves=userLeaves(socket.id)
    const roomUsers=getUsers(userRoom)

    if(userLeaves){
        io.to(userLeaves.room).emit("message",{
            message:`${userLeaves.username} left the chat`,
        })
        io.to(userLeaves.room).emit("users",roomUsers)
    }
})

const PORT=process.env.PORT || 5000;

server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})