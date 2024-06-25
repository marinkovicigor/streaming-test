const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const statusDiv = document.getElementById('status');
const broadcasterList = document.getElementById('broadcasterList');

function initializeUI(startViewingCallback, stopViewingCallback) {
    startButton.onclick = () => startViewingCallback(broadcasterList.value);
    stopButton.onclick = stopViewingCallback;

    broadcasterList.onchange = () => {
        startButton.disabled = !broadcasterList.value;
    };
}

function updateStatus(message) {
    statusDiv.textContent = message;
    console.log("Status:", message);
}

export { initializeUI, updateStatus };
