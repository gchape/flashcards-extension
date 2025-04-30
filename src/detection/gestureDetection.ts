import * as tf from '@tensorflow/tfjs';
import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors } from '@mediapipe/drawing_utils';

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

async function loadHandModel() {
    await tf.ready();
    handModel = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/dist/${file};`
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
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/dist/${file};`
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
    if (!canvasCtx || !canvasElement) return;
    
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Draw hands if detected
    if (results.multiHandLandmarks) {
        results.multiHandLandmarks.forEach((handLandmarks: any) => {
            drawConnectors(canvasCtx!, handLandmarks, HAND_CONNECTIONS, 
                { color: '#00FF00', lineWidth: 5 });
        });
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
            video: { facingMode: 'user', width: 640, height: 480 },
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
        canvasElement.width = 640;
        canvasElement.height = 480;
        canvasCtx = canvasElement.getContext('2d');
        
        // Add elements to the DOM
        document.body.appendChild(videoElement);
        document.body.appendChild(canvasElement);
        
        // Style elements
        videoElement.style.position = 'absolute';
        videoElement.style.transform = 'scaleX(-1)'; // Mirror video
        canvasElement.style.position = 'absolute';
        canvasElement.style.transform = 'scaleX(-1)'; // Mirror canvas too
        
        if (!canvasCtx) {
            throw new Error('Could not get 2D rendering context for canvas');
        }

        camera = new Camera(videoElement, {
            onFrame: async () => {
                if (videoElement && handModel) {
                    await handModel.send({ image: videoElement });
                }
                if (videoElement && poseModel) {
                    await poseModel.send({ image: videoElement });
                }
            },
            width: 640,
            height: 480,
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
window.addEventListener('DOMContentLoaded', init); //, which is located in src/detection/det.ts

export async function startDetection() {
    await init();
  }
  