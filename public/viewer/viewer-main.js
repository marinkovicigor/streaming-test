import { initializeUI, updateStatus } from './ui-handler.js';
import { initializeSocket } from './socket-handler.js';
import { startViewing, stopViewing, handleOffer, handleCandidate, handleBroadcastEnded } from './stream-handler.js';

let currentRoom;

function init() {
    initializeUI(startViewingWrapper, stopViewingWrapper);
    initializeSocket(handleOffer, handleCandidate, handleBroadcastEnded);
}

function startViewingWrapper(roomName) {
    currentRoom = roomName;
    startViewing(roomName);
}

function stopViewingWrapper() {
    stopViewing();
    currentRoom = null;
}

document.addEventListener('DOMContentLoaded', init);
