import * as tf from '@tensorflow/tfjs';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors , drawLandmarks } from '@mediapipe/drawing_utils';
//import { drawLandmarks } from '@mediapipe/drawing_utils';

let handModel: Hands | null = null;
let poseModel: Pose | null = null;
let camera: Camera | null = null;
let videoElement: HTMLVideoElement | null = null;
let canvasElement: HTMLCanvasElement | null = null;
let canvasCtx: CanvasRenderingContext2D | null = null;

// The MediaPipe Hands package already defines HAND_CONNECTIONS
// Define POSE_CONNECTIONS manually as it's not directly exported

const POSE_CONNECTIONS: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [5, 9], [9, 10], [10, 11], [11, 12],
    [0, 13], [13, 14], [14, 15], [15, 16],
    [0, 17], [17, 18], [18, 19], [19, 20],
    [11, 23], [12, 24], [23, 24], [23, 25], [24, 26], [25, 27], [26, 28], [27, 29], [28, 30],
    [29, 31], [30, 32], [27, 31], [28, 32]
];

function detectGesture(landmarks: any): string | null {
    const [thumbTip, thumbBase] = [landmarks[4], landmarks[1]];
    const [indexTip, middleTip, ringTip, pinkyTip] = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
    const [indexBase, middleBase, ringBase, pinkyBase] = [landmarks[5], landmarks[9], landmarks[13], landmarks[17]];

    const isThumbsUp = thumbTip.y < thumbBase.y &&
        indexTip.y > indexBase.y &&
        middleTip.y > middleBase.y &&
        ringTip.y > ringBase.y &&
        pinkyTip.y > pinkyBase.y;

    const isThumbsDown = thumbTip.y > thumbBase.y &&
        indexTip.y > indexBase.y &&
        middleTip.y > middleBase.y &&
        ringTip.y > ringBase.y &&
        pinkyTip.y > pinkyBase.y;

    const isRaisedHand = 
        thumbTip.y < thumbBase.y &&
        indexTip.y < indexBase.y &&
        middleTip.y < middleBase.y &&
        ringTip.y < ringBase.y &&
        pinkyTip.y < pinkyBase.y;

    if (isThumbsUp) return "Thumbs Up";
    if (isThumbsDown) return "Thumbs Down";
    if (isRaisedHand) return "Raised Hand";

    return null;
}
function stopDetection() {
    if (camera) {
        camera.stop();
        console.log("Camera stopped after detecting gesture.");
    }
    if (videoElement) videoElement.remove();
    if (canvasElement) canvasElement.remove();
}


async function loadHandModel() {
    await tf.ready();
    handModel = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/dist/${file}`;
        }
    });
    
    // Configure the model after creation
    await handModel.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    
    handModel.onResults((results) => {
        processHandResults(results);
    });
    console.log('Hand detection model loaded');
}

async function loadPoseModel() {
    await tf.ready();
    poseModel = new Pose({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/dist/${file}`;
        }
    });
    
    // Configure the pose model after creation
    await poseModel.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    
    poseModel.onResults((results) => {
        processPoseResults(results);
    });
    console.log('Pose detection model loaded');
}

function processHandResults(results: any) {
    if (!canvasCtx || !canvasElement || !results.multiHandLandmarks) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.fillStyle = 'red';
    canvasCtx.fillRect(10, 10, 50, 50);

    for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });

        const gesture = detectGesture(landmarks);
        if (gesture) {
            console.log("Detected gesture:", gesture);
            stopDetection();
            break;
        }
    }

    canvasCtx.restore();
}


function processPoseResults(results: any) {
    if (!canvasCtx || !canvasElement) return;
    
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Draw pose if detected
    if (results.poseLandmarks) {
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, 
            { color: '#FF0000', lineWidth: 4 });
    }
    
    canvasCtx.restore();
}

async function setupCamera() {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: 300, height: 300 },
            audio: false
        });

        videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.play();

        await new Promise<void>((resolve) => {
            if (videoElement) {
                videoElement.onloadedmetadata = () => {
                    resolve();
                };
            }
        });

        // Setup canvas
        canvasElement = document.createElement('canvas');
        canvasElement.width = 300;
        canvasElement.height = 300;
        canvasCtx = canvasElement.getContext('2d');
        
        // Add elements to the DOM
        document.body.appendChild(videoElement);
        document.body.appendChild(canvasElement);
        
        // Style elements
        videoElement.style.position = 'absolute';
        videoElement.style.left = '20px'; // move video 20px from the left
        videoElement.style.top = '100px'; // optional: move down to not cover header
        videoElement.style.transform = 'scaleX(-1)';
        videoElement.style.zIndex = '10';
        
        canvasElement.style.position = 'absolute';
        canvasElement.style.left = '20px'; // same left offset
        canvasElement.style.top = '100px';
        canvasElement.style.transform = 'scaleX(-1)';
        canvasElement.style.zIndex = '11';
        
 // Mirror canvas too
        
        if (!canvasCtx) {
            throw new Error('Could not get 2D rendering context for canvas');
        }

        camera = new Camera(videoElement, {
            onFrame: async () => {
              console.log("Processing frame...");
              if (videoElement && handModel) {
                await handModel.send({ image: videoElement });
              }
              if (videoElement && poseModel) {
                await poseModel.send({ image: videoElement });
              }
            },
            width: 300,
            height: 300,
          });
          
        
        camera.start();
        console.log("Camera setup complete");
    } catch (error) {
        console.error("Error during camera setup:", error);
    }
}

async function init() {
    try {
        await loadHandModel();
        await loadPoseModel();
        await setupCamera();
        console.log("Initialization complete");
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

// Add an event listener to start initialization when the page is loaded
//window.addEventListener('DOMContentLoaded', init); //, which is located in src/detection/det.ts

export async function startDetection() {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await init();
  }
  