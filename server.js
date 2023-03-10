import ngrok from "ngrok"
import express from "express"
import {createServer} from "http"
import {Server} from "socket.io"
import {v4 as uuidv4} from "uuid"

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
const PORT = 5000

app.use(express.json())
app.use(express.static("public"))
app.set("view engine", 'ejs')

app.get("/", (req, res) =>{
    res.render("index")
})

app.get("/uuid", (req, res) =>{
    res.redirect('/'+uuidv4())
})

app.get("/:room", (req, res) =>{
    res.render("room", {roomId:req.params.room})
})

io.on('connection',(socket) =>{
    let room
    socket.on('join-room', roomId =>{
        console.log('joined room');
        room = io.sockets.adapter.rooms.get(roomId)
        let roomSize = 0
        console.log(socket.id);
        if(room){
            roomSize += room.size
            console.log(room);
        }
        if(roomSize < 2){
            console.log(roomSize);
            console.log(roomId);
            socket.join(roomId);
            socket.broadcast.to(roomId).emit("user-connected")
            socket.on("disconnect", ()=>{
                socket.broadcast.to(roomId).emit("user-disconnected")
            })
            socket.on("can-play", ()=>{
                socket.broadcast.to(roomId).emit("can-play")

            })
            socket.on("clicked", (id)=>{
                socket.broadcast.to(roomId).emit("clicked",id)

            })
        }else{
            socket.emit("full-room")
        }
    })
})

httpServer.listen(PORT, () =>{
    console.log("Server is running on Port->",PORT);
})

const url = await ngrok.connect(5000);
console.log(url);