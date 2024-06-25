# WebRTC Broadcaster Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Setup Instructions](#setup-instructions)
3. [File Structure](#file-structure)
4. [Server-Side Component](#server-side-component)
5. [Broadcaster Components](#broadcaster-components)
6. [Viewer Components](#viewer-components)
7. [Usage Guide](#usage-guide)
8. [Customization Options](#customization-options)
9. [Troubleshooting](#troubleshooting)

## Project Overview

This WebRTC Broadcaster project enables real-time video streaming with interactive features. It allows users to broadcast their camera feed and screen share simultaneously, while viewers can watch the broadcast in real-time. The project features a customizable background for broadcasters, supports multiple concurrent broadcasts, and uses a modular architecture for easy maintenance and extensibility.

Key Features:
- Simultaneous camera and screen sharing for broadcasters
- Customizable background (color, pattern, image) for broadcasters
- Real-time WebRTC streaming with low latency
- Multiple room support for different broadcasts
- Viewer interface to select and watch broadcasts
- Server-side room management and WebRTC signaling
- HTTPS support for secure connections

## Setup Instructions

1. Ensure you have Node.js installed on your system.

2. Clone or download the project repository.

3. Navigate to the project root directory and install dependencies:
   ```
   npm install express socket.io
   ```

4. Generate SSL certificates for HTTPS:
   - Create `key.pem` and `cert.pem` files in the root directory.
   - You can use tools like OpenSSL to generate these files:
     ```
     openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
     ```

5. Start the server:
   ```
   node server.js
   ```

6. Access the broadcaster page through your web browser (e.g., `https://localhost:3000/broadcaster.html`).
7. Access the viewer page through your web browser (e.g., `https://localhost:3000/viewer.html`).

## File Structure

```
/
├── server.js
├── key.pem
├── cert.pem
├── public/
│   ├── broadcaster/
│   │   ├── broadcaster-main.js
│   │   ├── stream-handler.js
│   │   ├── background-handler.js
│   │   ├── webrtc-handler.js
│   │   ├── ui-handler.js
│   │   └── render-worker.js
│   ├── broadcaster.html
│   ├── viewer.html
│   └── viewer.js
```

## Server-Side Component

### server.js

The main server file that handles WebSocket connections, room management, and WebRTC signaling.

Key Features:
- HTTPS server setup using Express
- Socket.io integration for real-time communication
- Room management for multiple broadcasts
- WebRTC signaling (offer, answer, ICE candidates)
- Broadcaster and viewer connection handling

Key Functions:
- `io.on('connection')`: Handles new socket connections
- `socket.on('broadcaster')`: Manages new broadcaster connections and room creation
- `socket.on('watcher')`: Handles viewer connections to a broadcast
- `socket.on('offer')`, `socket.on('answer')`, `socket.on('candidate')`: Relay WebRTC signaling messages
- `socket.on('disconnect')`: Manages disconnections and cleans up rooms

## Broadcaster Components

### broadcaster.html

The HTML file for the broadcaster interface.

Key Elements:
- Input for room name
- Video elements for local preview
- Canvas for combined video output
- Controls for starting/stopping broadcast and customizing background

### broadcaster-main.js

The main entry point for the broadcaster functionality.

Key Functions:
- `startBroadcasting()`: Initiates the broadcasting process
- `stopBroadcasting()`: Stops the current broadcast

### stream-handler.js

Manages video streams, including camera feed, screen sharing, and combining these streams.

Key Functions:
- `initializeStreams()`: Sets up stream-related DOM elements
- `startCamera()`: Initiates the camera stream
- `startScreenSharing()`: Starts the screen sharing stream
- `combineStreams()`: Merges camera and screen sharing streams

### background-handler.js

Handles background customization options.

Key Functions:
- `initializeBackground()`: Sets up background-related controls
- `drawBackground()`: Renders the selected background on a given canvas context

### webrtc-handler.js

Manages WebRTC connections and peer communications.

Key Functions:
- `initializeWebRTC()`: Sets up WebRTC connections and event listeners
- `stopWebRTC()`: Closes all WebRTC connections

### ui-handler.js

Handles user interface updates and button interactions.

Key Functions:
- `initializeUI()`: Sets up UI elements and event listeners
- `updateStatus()`: Updates the status message displayed to the user
- `updateButtonStates()`: Enables/disables buttons based on the current state

### render-worker.js

A Web Worker that ensures smooth rendering of the combined video streams.

Key Functions:
- `requestDraw()`: Requests a new frame to be drawn at a specified interval

## Viewer Components

### viewer.html

The HTML file for the viewer interface.

Key Elements:
- Dropdown to select available broadcasts
- Video element to display the broadcast
- Buttons to start/stop viewing and control audio
- Status display area

### viewer.js

Handles the viewer-side logic for connecting to and displaying broadcasts.

Key Functions:
- `startViewing()`: Initiates connection to a selected broadcast
- `stopViewing()`: Ends the viewing session
- `startFrameUpdateInterval()`: Ensures continuous frame updates
- `handleOffer()`: Processes WebRTC offer from broadcaster
- `logVideoStatus()`: Periodically logs video playback status

Key Features:
- WebRTC peer connection setup
- Dynamic updating of available broadcasts
- Video element event handling for debugging
- Periodic frame updates to ensure continuous playback
- Visual feedback on video state through border colors

## Usage Guide

For Broadcasters:
1. Open the broadcaster page in your web browser.
2. Enter a unique room name for your broadcast.
3. Customize the background using the provided options.
4. Click "Start Broadcasting" to begin streaming.
5. Grant necessary permissions for camera and screen sharing when prompted.
6. To end the broadcast, click "Stop Broadcasting".

For Viewers:
1. Open the viewer page in your web browser.
2. Wait for the list of available broadcasts to populate.
3. Select a broadcast from the dropdown list.
4. Click "Start Viewing" to connect to the broadcast.
5. Use the "Stop Viewing" button to end the session.
6. The "Unmute" button toggles audio playback.

## Customization Options

Broadcasters can customize their stream background:
1. Background Color: Use the color picker to select a solid background color.
2. Background Pattern: Choose from predefined patterns (dots, lines, grid) in the dropdown menu.
3. Background Image: Upload a custom image to use as the background.

## Troubleshooting

1. If the stream doesn't start, check the browser console for error messages.
2. Ensure all necessary permissions (camera, microphone, screen sharing) are granted.
3. If WebRTC connections fail, verify the STUN server configuration in both broadcaster and viewer scripts.
4. For performance issues on the broadcaster side, try adjusting the frame rate in `render-worker.js`.
5. If viewers can't connect, ensure the server is running and accessible.
6. Check server logs for any connection or room management issues.
7. If the video appears frozen on the viewer side, the `startFrameUpdateInterval` function in viewer.js should help. If issues persist, check network conditions and browser compatibility.
8. For SSL/HTTPS issues, ensure your certificates are properly configured and trusted by your browser.

Browser Compatibility:
- This project is best viewed in modern browsers with full WebRTC support.
- Recommended browsers: latest versions of Chrome, Firefox, or Edge.
- Some features may not work in older browsers or browsers with limited WebRTC support.

For any additional issues or feature requests, please contact the project maintainer or open an issue in the project repository.

