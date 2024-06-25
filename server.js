const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const socketIo = require('socket.io');
const path = require('path');

// Read SSL/TLS certificate files
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

// Create HTTPS server with Express app
const server = https.createServer(options, app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the service worker file explicitly if needed
app.get('/service-worker.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/service-worker.js'));
});

// Store active broadcasters: Map(roomName => socketId)
const broadcasters = new Map();

// Handle new Socket.io connections
io.on('connection', socket => {
    console.log('New connection:', socket.id);
    socket.emit('broadcaster_list', Array.from(broadcasters.keys()));

    socket.on('broadcaster', roomName => handleBroadcaster(socket, roomName));
    socket.on('stop_broadcasting', roomName => handleStopBroadcasting(socket, roomName));
    socket.on('watcher', roomName => handleWatcher(socket, roomName));
    socket.on('offer', (id, message, roomName) => handleOffer(socket, id, message, roomName));
    socket.on('answer', (id, message, roomName) => handleAnswer(socket, id, message, roomName));
    socket.on('candidate', (id, message, roomName) => handleCandidate(socket, id, message, roomName));
    socket.on('disconnect', () => handleDisconnect(socket));
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, 'localhost', () => {
    console.log(`Server running on port ${PORT}`);
});

// Broadcaster starts broadcasting
function handleBroadcaster(socket, roomName) {
    if (broadcasters.has(roomName)) {
        console.log('Room name already taken:', roomName);
        socket.emit('room_name_taken');
    } else {
        console.log('Broadcaster connected:', socket.id, 'in room:', roomName);
        broadcasters.set(roomName, socket.id);
        socket.join(roomName);
        socket.emit('broadcast_started', roomName);
        io.emit('broadcaster_list', Array.from(broadcasters.keys()));
    }
}

// Broadcaster stops broadcasting
function handleStopBroadcasting(socket, roomName) {
    console.log('Broadcaster stopped:', socket.id, 'in room:', roomName);
    broadcasters.delete(roomName);
    io.emit('broadcaster_list', Array.from(broadcasters.keys()));
    socket.to(roomName).emit('broadcast_ended');
}

// Viewer starts watching
function handleWatcher(socket, roomName) {
    console.log('Watcher connected:', socket.id, 'to room:', roomName);
    socket.join(roomName);
    socket.to(broadcasters.get(roomName)).emit('watcher', socket.id);
}

// Relay offer from broadcaster to specific watcher
function handleOffer(socket, id, message, roomName) {
    console.log('Relaying offer from', socket.id, 'to', id, 'in room:', roomName);
    socket.to(id).emit('offer', socket.id, message, roomName);
}

// Relay answer from watcher to broadcaster
function handleAnswer(socket, id, message, roomName) {
    console.log('Relaying answer from', socket.id, 'to', id, 'in room:', roomName);
    socket.to(id).emit('answer', socket.id, message, roomName);
}

// Relay ICE candidate to the appropriate peer
function handleCandidate(socket, id, message, roomName) {
    console.log('Relaying ICE candidate from', socket.id, 'to', id, 'in room:', roomName);
    socket.to(id).emit('candidate', socket.id, message, roomName);
}

// Handle disconnection
function handleDisconnect(socket) {
    console.log('Disconnection:', socket.id);
    for (const [roomName, broadcasterId] of broadcasters.entries()) {
        if (broadcasterId === socket.id) {
            console.log('Broadcaster disconnected from room:', roomName);
            broadcasters.delete(roomName);
            io.emit('broadcaster_list', Array.from(broadcasters.keys()));
            socket.to(roomName).emit('broadcast_ended');
            break;
        }
    }
}
