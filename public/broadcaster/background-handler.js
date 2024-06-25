// Background state
let backgroundColor = '#000000';
let backgroundPattern = 'none';
let backgroundImage = null;

// Initialize background controls and event listeners
export function initializeBackground() {
    const bgColorInput = document.getElementById('bgColor');
    const bgPatternSelect = document.getElementById('bgPattern');
    const bgImageInput = document.getElementById('bgImage');
    const clearBgImageButton = document.getElementById('clearBgImage');
    const backgroundPreview = document.getElementById('backgroundPreview');

    bgColorInput.addEventListener('change', updateBackground);
    bgPatternSelect.addEventListener('change', updateBackground);
    bgImageInput.addEventListener('change', handleImageUpload);
    clearBgImageButton.addEventListener('click', clearBackgroundImage);

    updateBackgroundPreview();
}

// Update background based on user input
function updateBackground() {
    backgroundColor = document.getElementById('bgColor').value;
    backgroundPattern = document.getElementById('bgPattern').value;
    updateBackgroundPreview();
}

// Handle background image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            backgroundImage = new Image();
            backgroundImage.onload = updateBackgroundPreview;
            backgroundImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Clear background image
function clearBackgroundImage() {
    backgroundImage = null;
    document.getElementById('bgImage').value = '';
    updateBackgroundPreview();
}

// Update background preview
function updateBackgroundPreview() {
    const preview = document.getElementById('backgroundPreview');
    const ctx = preview.getContext('2d');
    drawBackground(ctx, preview.width, preview.height);
}

// Draw background on given context
export function drawBackground(ctx, width, height) {
    // Draw background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw background pattern
    drawPattern(ctx, width, height);

    // Draw background image
    if (backgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0, width, height);
    }
}

// Draw selected pattern
function drawPattern(ctx, width, height) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;

    switch (backgroundPattern) {
        case 'dots':
            for (let x = 0; x < width; x += 10) {
                for (let y = 0; y < height; y += 10) {
                    ctx.beginPath();
                    ctx.arc(x, y, 1, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
            break;
        case 'lines':
            for (let y = 0; y < height; y += 10) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
            break;
        case 'grid':
            for (let x = 0; x < width; x += 10) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += 10) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
            break;
    }
}
