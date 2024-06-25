import { initializeStreams, startCamera, startScreenSharing, combineStreams, stopStreams } from './stream-handler.js';
import { initializeBackground } from './background-handler.js';
import { initializeWebRTC, stopWebRTC } from './webrtc-handler.js';
import { initializeUI, updateStatus, updateButtonStates } from './ui-handler.js';

let isBroadcasting = false;
let roomName = '';

function startBroadcasting() {
    roomName = document.getElementById('roomName').value.trim();
    if (!roomName) {
        updateStatus("Please enter a room name");
        return;
    }

    Promise.all([startCamera(), startScreenSharing()])
        .then(() => {
            const combinedStream = combineStreams();
            initializeWebRTC(combinedStream, roomName);
            isBroadcasting = true;
            updateButtonStates(isBroadcasting);
            updateStatus("Broadcasting started in room: " + roomName);
        })
        .catch(error => {
            console.error("Error starting streams:", error);
            updateStatus("Failed to start broadcasting. Please try again.");
        });
}

function stopBroadcasting() {
    stopStreams();
    stopWebRTC();
    isBroadcasting = false;
    updateButtonStates(isBroadcasting);
    updateStatus("Broadcasting stopped");
    roomName = '';
}

function init() {
    initializeStreams();
    initializeBackground();
    initializeUI(startBroadcasting, stopBroadcasting);
    updateButtonStates(isBroadcasting);
}

document.addEventListener('DOMContentLoaded', init);

export { startBroadcasting, stopBroadcasting };
