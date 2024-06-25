// Initialize UI elements and set up event listeners
export function initializeUI(startBroadcastingCallback, stopBroadcastingCallback) {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');

    startButton.onclick = startBroadcastingCallback;
    stopButton.onclick = stopBroadcastingCallback;
}

// Update status message
export function updateStatus(message) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    console.log("Status:", message);
}

// Update button states based on broadcasting status
export function updateButtonStates(isBroadcasting) {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const roomNameInput = document.getElementById('roomName');

    startButton.disabled = isBroadcasting;
    stopButton.disabled = !isBroadcasting;
    roomNameInput.disabled = isBroadcasting;
}
