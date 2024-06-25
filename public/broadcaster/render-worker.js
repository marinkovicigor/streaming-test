let isRunning = false;
const FRAME_INTERVAL = 1000 / 30; // 30 FPS

// Listen for messages from the main thread
self.onmessage = function(e) {
    if (e.data.type === 'start') {
        isRunning = true;
        requestDraw();
    } else if (e.data.type === 'stop') {
        isRunning = false;
    }
};

// Function to request drawing frames at consistent intervals
function requestDraw() {
    if (isRunning) {
        self.postMessage({ type: 'drawFrame' });
        setTimeout(requestDraw, FRAME_INTERVAL);
    }
}
