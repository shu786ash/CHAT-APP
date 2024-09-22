const {Server} = require("socket.io");
const http = require("http");
const express = require("express");
const fs = require("fs");
const cors = require('cors');
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:['http://localhost:5173'],
        methods:['GET', 'POST'],
    },
});

const userSocketMap = {}; // {userId->socketId}

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}


io.on('connection', (socket)=>{
    console.log('user connected ',socket.id);
    const userId = socket.handshake.query.userId
    if(userId !== undefined){
        userSocketMap[userId] = socket.id;
    } 

    io.emit('getOnlineUsers',Object.keys(userSocketMap));

    socket.on('disconnect', ()=>{
        delete userSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
    })

    socket.on('fileUpload', (data, cb) => {
        const { filename, data: fileData, fileType } = data; // Destructure data
        const filepath = `uploads/${filename}`;  // Define upload directory
    
        fs.writeFile(filepath, fileData, { contentType: fileType }, (err) => {
            if (err) {
                console.error('Error writing file:', err);
                // socket.emit('fileUploadError', err.message); // Send error message to client
                cb({
                  status: false
                })
            } else {
                console.log(`File ${filename} uploaded successfully!`);
                // socket.emit('fileUploadSuccess', filename); // Send success message to client
                cb({
                  status: true
                })
            }
        });
      });

})

module.exports = {app, io, server, getReceiverSocketId};
