import { updateStatus } from './ui-handler.js';
import { handleOffer, handleCandidate, handleBroadcastEnded } from './stream-handler.js';

const socket = io.connect(window.location.origin, { secure: true });

function initializeSocket(offerHandler, candidateHandler, broadcastEndedHandler) {
    socket.on('broadcaster_list', updateBroadcasterList);
    socket.on("offer", (id, description, roomName) => offerHandler(id, description, roomName));
    socket.on("candidate", (id, candidate) => candidateHandler(id, candidate));
    socket.on("broadcast_ended", broadcastEndedHandler);

    socket.on("connect", () => {
        updateStatus("Connected to server. Requesting broadcaster list.");
        socket.emit('get_broadcaster_list');
    });
}

function updateBroadcasterList(broadcasters) {
    const broadcasterList = document.getElementById('broadcasterList');
    broadcasterList.innerHTML = '';
    broadcasters.forEach(room => {
        const option = document.createElement('option');
        option.value = room;
        option.textContent = room;
        broadcasterList.appendChild(option);
    });
    updateStatus("Broadcaster list updated");
}

export { initializeSocket, socket };
