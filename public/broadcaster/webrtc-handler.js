import { updateStatus } from './ui-handler.js';

// WebRTC variables
let peerConnections = {};
const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
let socket;
let localStream;

// Initialize WebRTC
export function initializeWebRTC(stream, roomName) {
    localStream = stream;
    socket = io.connect(window.location.origin);

    socket.on('watcher', id => {
        const peerConnection = new RTCPeerConnection(config);
        peerConnections[id] = peerConnection;

        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                socket.emit("candidate", id, event.candidate, roomName);
            }
        };

        peerConnection
            .createOffer()
            .then(sdp => peerConnection.setLocalDescription(sdp))
            .then(() => {
                socket.emit("offer", id, peerConnection.localDescription, roomName);
            });
    });

    socket.on('answer', handleAnswer);
    socket.on('candidate', handleICECandidate);
    socket.on('disconnectPeer', id => {
        peerConnections[id] && peerConnections[id].close();
        delete peerConnections[id];
    });

    socket.emit('broadcaster', roomName);
}

// Handle answer from a viewer
function handleAnswer(id, description) {
    peerConnections[id].setRemoteDescription(description);
}

// Handle ICE candidate from a viewer
function handleICECandidate(id, candidate) {
    peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
}

// Stop WebRTC connections
export function stopWebRTC() {
    if (socket) {
        socket.close();
    }
    Object.values(peerConnections).forEach(pc => pc.close());
    peerConnections = {};
}
