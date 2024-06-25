import { drawBackground } from './background-handler.js';

// Stream variables
let cameraStream, screenStream, compositeStream;
let canvas, ctx, screenVideo, cameraVideo;
let renderWorker;

// Initialize stream-related DOM elements
export function initializeStreams() {
    canvas = document.getElementById('compositeCanvas');
    ctx = canvas.getContext('2d');
    screenVideo = document.getElementById('screenVideo');
    cameraVideo = document.getElementById('cameraVideo');
    canvas.width = 1280;
    canvas.height = 720;
}

// Start camera stream
export function startCamera() {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            cameraStream = stream;
            cameraVideo.srcObject = stream;
            return cameraVideo.play();
        })
        .catch(error => {
            console.error("Error starting camera stream:", error);
            throw error;
        });
}

// Start screen sharing stream
export function startScreenSharing() {
    return navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        .then(stream => {
            screenStream = stream;
            screenVideo.srcObject = stream;
            return screenVideo.play();
        })
        .catch(error => {
            console.error("Error starting screen sharing:", error);
            throw error;
        });
}

// Combine camera and screen streams
export function combineStreams() {
    if (!renderWorker) {
        renderWorker = new Worker('broadcaster/render-worker.js');
        renderWorker.onmessage = handleWorkerMessage;
    }
    renderWorker.postMessage({ type: 'start' });

    compositeStream = canvas.captureStream(30); // 30 FPS

    // Add audio tracks from both streams to the composite stream
    const audioTracks = [...cameraStream.getAudioTracks(), ...screenStream.getAudioTracks()];
    audioTracks.forEach(track => compositeStream.addTrack(track));

    return compositeStream;
}

// Handle messages from the render worker
function handleWorkerMessage(e) {
    if (e.data.type === 'drawFrame') {
        drawStreams();
    }
}

// Draw the combined streams on the canvas
function drawStreams() {
    if (screenVideo.videoWidth > 0 && cameraVideo.videoWidth > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        drawBackground(ctx, canvas.width, canvas.height);

        // Calculate dimensions for screen share (left half)
        const screenAspectRatio = screenVideo.videoWidth / screenVideo.videoHeight;
        let screenDrawWidth = canvas.width / 2;
        let screenDrawHeight = screenDrawWidth / screenAspectRatio;
        if (screenDrawHeight > canvas.height) {
            screenDrawHeight = canvas.height;
            screenDrawWidth = screenDrawHeight * screenAspectRatio;
        }
        const screenX = (canvas.width / 2 - screenDrawWidth) / 2;
        const screenY = (canvas.height - screenDrawHeight) / 2;

        // Calculate dimensions for camera (right half)
        const cameraAspectRatio = cameraVideo.videoWidth / cameraVideo.videoHeight;
        let cameraDrawWidth = canvas.width / 2;
        let cameraDrawHeight = cameraDrawWidth / cameraAspectRatio;
        if (cameraDrawHeight > canvas.height) {
            cameraDrawHeight = canvas.height;
            cameraDrawWidth = cameraDrawHeight * cameraAspectRatio;
        }
        const cameraX = canvas.width / 2 + (canvas.width / 2 - cameraDrawWidth) / 2;
        const cameraY = (canvas.height - cameraDrawHeight) / 2;

        // Draw screen share on the left half
        ctx.drawImage(screenVideo, screenX, screenY, screenDrawWidth, screenDrawHeight);
        // Draw camera on the right half
        ctx.drawImage(cameraVideo, cameraX, cameraY, cameraDrawWidth, cameraDrawHeight);

        // Draw a line between the two halves
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Stop all streams
export function stopStreams() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
    }
    if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
    }
    if (compositeStream) {
        compositeStream.getTracks().forEach(track => track.stop());
    }
    if (renderWorker) {
        renderWorker.terminate();
        renderWorker = null;
    }
}
