import * as tf from '@tensorflow/tfjs';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

let handModel: Hands | null = null;
let camera: Camera | null = null;
let videoElement: HTMLVideoElement | null = null;
let canvasElement: HTMLCanvasElement | null = null;
let canvasCtx: CanvasRenderingContext2D | null = null;
let gestureDisplayElement: HTMLDivElement | null = null;
let gestureDetectionTimeout: number | null = null;
let isDetectionActive = false;

const GESTURE_EMOJI_MAP: Record<string, string> = {
    "Thumbs Up": "👍",
    "Thumbs Down": "👎",
    "Raised Hand": "✋"
};

function detectGesture(landmarks: any): string | null {
    const WRIST = landmarks[0];
    const THUMB_TIP = landmarks[4];
    const THUMB_IP = landmarks[3];
    const INDEX_TIP = landmarks[8];
    const MIDDLE_MCP = landmarks[9];
    const PINKY_TIP = landmarks[20];

    const handSize = Math.hypot(WRIST.x - MIDDLE_MCP.x, WRIST.y - MIDDLE_MCP.y);
    
    const thumbTipVertical = WRIST.y - THUMB_TIP.y;
    const thumbIPVertical = WRIST.y - THUMB_IP.y;
    const indexVertical = WRIST.y - INDEX_TIP.y;
    const pinkyVertical = WRIST.y - PINKY_TIP.y;

    // Thumb Up Detection
    const isThumbUp = 
        thumbTipVertical > handSize * 0.5 &&
        (THUMB_TIP.y < THUMB_IP.y) &&
        (INDEX_TIP.y > MIDDLE_MCP.y + handSize * 0.1) &&
        (PINKY_TIP.y > MIDDLE_MCP.y + handSize * 0.1);

    // Thumb Down Detection
    const isThumbDown = 
        (THUMB_TIP.y - WRIST.y) > handSize * 0.4 &&
        (INDEX_TIP.y - WRIST.y) > handSize * 0.1;

    // Raised Hand Detection
    const isRaisedHand = 
        thumbTipVertical > handSize * 0.2 &&
        indexVertical > handSize * 0.4 &&
        pinkyVertical > handSize * 0.4 &&
        Math.abs(INDEX_TIP.x - PINKY_TIP.x) > handSize * 0.3;

    if (isThumbUp) return "Thumbs Up";
    if (isThumbDown) return "Thumbs Down";
    if (isRaisedHand) return "Raised Hand";

    return null;
}

function displayGesture(gesture: string | null) {
    // Create display element if it doesn't exist
    if (!gestureDisplayElement) {
        gestureDisplayElement = document.createElement('div');
        gestureDisplayElement.style.position = 'fixed';
        gestureDisplayElement.style.left = '50%';
        gestureDisplayElement.style.top = '50%';
        gestureDisplayElement.style.transform = 'translate(-50%, -50%)';
        gestureDisplayElement.style.background = 'rgba(0, 0, 0, 0.9)';
        gestureDisplayElement.style.color = 'white';
        gestureDisplayElement.style.padding = '25px 40px';
        gestureDisplayElement.style.borderRadius = '20px';
        gestureDisplayElement.style.fontSize = '48px';
        gestureDisplayElement.style.fontWeight = 'bold';
        gestureDisplayElement.style.textAlign = 'center';
        gestureDisplayElement.style.zIndex = '9999';
        gestureDisplayElement.style.boxShadow = '0 0 30px rgba(255,255,255,0.2)';
        gestureDisplayElement.style.display = 'none';
        document.body.appendChild(gestureDisplayElement);
    }

    // Always dispatch detection event
    const event = new CustomEvent('gestureDetected', { detail: gesture });
    window.dispatchEvent(event);

    if (!gesture) {
        gestureDisplayElement.style.display = 'none';
        return;
    }

    const emoji = GESTURE_EMOJI_MAP[gesture] || '';
    gestureDisplayElement.innerHTML = `${emoji}<div style="font-size: 24px; margin-top: 10px">${gesture}</div>`;
    gestureDisplayElement.style.display = 'block';

    if (gestureDetectionTimeout) clearTimeout(gestureDetectionTimeout);
    gestureDetectionTimeout = window.setTimeout(() => {
        if (gestureDisplayElement) {
            gestureDisplayElement.style.display = 'none';
        }
    }, 2000);
}

async function loadHandModel() {
    handModel = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    await handModel.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
    });

    handModel.onResults((results) => {
        if (!isDetectionActive || !canvasCtx || !canvasElement) return;
        
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.save();
        
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                    color: '#00FF00',
                    lineWidth: 2
                });
                drawLandmarks(canvasCtx, landmarks, {
                    color: '#FF0000',
                    lineWidth: 1,
                    radius: 2
                });

                const gesture = detectGesture(landmarks);
                displayGesture(gesture);
            }
        }
        canvasCtx.restore();
    });
}

async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 320 },
                height: { ideal: 240 }
            },
            audio: false
        });

        const cameraContainer = document.createElement('div');
        cameraContainer.style.position = 'fixed';
        cameraContainer.style.top = '20px';
        cameraContainer.style.left = '20px';
        cameraContainer.style.width = '160px';
        cameraContainer.style.height = '120px';
        cameraContainer.style.borderRadius = '8px';
        cameraContainer.style.overflow = 'hidden';
        cameraContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
        cameraContainer.style.zIndex = '10000';
        cameraContainer.style.backgroundColor = '#000';

        videoElement = document.createElement('video');
        videoElement.style.transform = 'scaleX(-1)';
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.playsInline = true;

        canvasElement = document.createElement('canvas');
        canvasElement.style.width = '100%';
        canvasElement.style.height = '100%';
        canvasElement.style.position = 'absolute';
        canvasElement.style.top = '0';
        canvasElement.style.left = '0';

        cameraContainer.appendChild(videoElement);
        cameraContainer.appendChild(canvasElement);
        document.body.appendChild(cameraContainer);

        videoElement.srcObject = stream;
        await new Promise((resolve) => (videoElement!.onloadedmetadata = resolve));
        await videoElement.play();

        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        canvasCtx = canvasElement.getContext('2d');

        camera = new Camera(videoElement, {
            onFrame: async () => {
                if (handModel && isDetectionActive) {
                    await handModel.send({ image: videoElement! });
                }
            },
            width: videoElement.videoWidth,
            height: videoElement.videoHeight
        });
        camera.start();

    } catch (error) {
        console.error("Camera setup failed:", error);
    }
}

export async function startDetection() {
    if (!isDetectionActive) {
        isDetectionActive = true;
        await loadHandModel();
        await setupCamera();
    }
}

export function stopDetection() {
    isDetectionActive = false;
}

export function cleanupDetection() {
    stopDetection();
    
    if (camera) {
        camera.stop();
        camera = null;
    }
    
    const cameraContainer = document.querySelector('div[style*="top: 20px"]');
    if (cameraContainer) cameraContainer.remove();

    if (videoElement) {
        videoElement.srcObject?.getTracks().forEach(track => track.stop());
        videoElement.remove();
        videoElement = null;
    }

    if (canvasElement) {
        canvasElement.remove();
        canvasElement = null;
        canvasCtx = null;
    }

    if (gestureDisplayElement) {
        gestureDisplayElement.remove();
        gestureDisplayElement = null;
    }

    if (gestureDetectionTimeout) {
        clearTimeout(gestureDetectionTimeout);
        gestureDetectionTimeout = null;
    }

    handModel = null;
}