import { updateStatus } from './ui-handler.js';
import { socket } from './socket-handler.js';

const remoteVideo = document.getElementById('remoteVideo');
let peerConnection;
let frameUpdateInterval;
let videoSourceSet = false;

const config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

function startViewing(roomName) {
    updateStatus("Connecting to broadcaster in room: " + roomName);
    socket.emit("watcher", roomName);
    startFrameUpdateInterval();
}

function stopViewing() {
    if (peerConnection) {
        peerConnection.close();
    }
    remoteVideo.srcObject = null;
    updateStatus("Viewing stopped");
    stopFrameUpdateInterval();
}

function startFrameUpdateInterval() {
    stopFrameUpdateInterval();
    frameUpdateInterval = requestAnimationFrame(updateFrame);
}

function updateFrame() {
    if (remoteVideo.srcObject && remoteVideo.srcObject.active) {
        remoteVideo.style.display = 'none';
        remoteVideo.offsetHeight;
        remoteVideo.style.display = 'block';
    }
    frameUpdateInterval = requestAnimationFrame(updateFrame);
}

function stopFrameUpdateInterval() {
    if (frameUpdateInterval) {
        cancelAnimationFrame(frameUpdateInterval);
        frameUpdateInterval = null;
    }
}

function handleOffer(id, description, roomName) {
    peerConnection = new RTCPeerConnection(config);
    peerConnection.setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
            socket.emit("answer", id, peerConnection.localDescription, roomName);
        })
        .catch(error => console.error("Error handling offer:", error));

    peerConnection.ontrack = event => {
        if (!videoSourceSet) {
            remoteVideo.srcObject = event.streams[0];
            videoSourceSet = true;
        }
        updateStatus("Stream received. Video should start playing soon.");
        remoteVideo.play().then(() => {
            console.log("Video playback started");
        }).catch(e => {
            console.error("Error starting video playback:", e);
        });
    };

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.emit("candidate", id, event.candidate, roomName);
        }
    };
}

function handleCandidate(id, candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error("Error adding ICE candidate:", e));
}

function handleBroadcastEnded() {
    updateStatus("Broadcast ended");
    stopViewing();
}

remoteVideo.onplaying = () => {
    updateStatus("Video is playing");
};

remoteVideo.onerror = error => {
    console.error("Video error:", error);
};

export { startViewing, stopViewing, handleOffer, handleCandidate, handleBroadcastEnded };
