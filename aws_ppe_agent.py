import cv2
import time
import requests
import datetime
import os
import json
from ultralytics import YOLO

# ==========================================
# AWS EC2 Edge Agent for Toplens Central-Hub
# ==========================================

# Configuration
MODEL_PATH = "ppe_rebuilt.pt"
VIDEO_SOURCE = "test.mp4" # or rtsp stream
API_ENDPOINT = "http://127.0.0.1:10000/alerts/"
try:
    EDGE_TOKEN = os.environ["EDGE_TOKEN"]
except KeyError:
    print("[!] ERROR: EDGE_TOKEN environment variable is not set. Please set it before running this script.")
    exit(1)
SITE_ID = "Premix"
CAMERA_ID = "Gate 4 - Loading"
CONFIDENCE_THRESHOLD = 0.50
FRAME_SKIP = 5 # Process 1 frame every X frames for performance
COOLDOWN_SECONDS = 30 # Prevent spamming alerts for the same incident

# State
last_alert_time = 0
os.makedirs("no_helmet_incidents", exist_ok=True)

print(f"[*] Loading YOLO model from {MODEL_PATH}")
try:
    model = YOLO(MODEL_PATH)
except Exception as e:
    print(f"[!] Error loading model: {e}")
    # Fallback to standard for testing if ppe_rebuilt.pt missing
    # model = YOLO("yolov8n.pt") 

cap = cv2.VideoCapture(VIDEO_SOURCE)
frame_count = 0

print("[*] Starting Video Processing Pipeline...")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
        
    frame_count += 1
    if frame_count % FRAME_SKIP != 0:
        continue
        
    # Run YOLO detection
    results = model(frame, verbose=False)[0]
    
    no_helmet_detected = False
    highest_conf = 0
    best_bbox = None
    
    for box in results.boxes:
        # Assuming Class 1 is No_Safety_Helmet based on prompt
        cls_id = int(box.cls[0].item())
        conf = float(box.conf[0].item())
        
        if cls_id == 1 and conf > CONFIDENCE_THRESHOLD:
            no_helmet_detected = True
            if conf > highest_conf:
                highest_conf = conf
                best_bbox = box.xyxy[0].tolist()
                
    if no_helmet_detected:
        current_time = time.time()
        
        # Check cooldown to prevent alert spam
        if (current_time - last_alert_time) > COOLDOWN_SECONDS:
            timestamp_str = datetime.datetime.utcnow().isoformat()
            
            # Save Snapshot Locally
            filename = f"no_helmet_incidents/incident_{int(current_time)}.jpg"
            cv2.imwrite(filename, frame)
            print(f"[!] ALERT: No Helmet detected! Confidence: {highest_conf:.2f}. Snapshot saved to {filename}")
            
            # Prepare API Payload
            payload = {
                "timestamp": timestamp_str,
                "site_id": SITE_ID,
                "camera_id": CAMERA_ID,
                "usecase": "PPE Monitoring",
                "alert_type": "PPE Violation",
                "severity": "high",
                "description": "No Helmet Detected",
                "confidence": highest_conf,
                "bbox": json.dumps(best_bbox),
                # Note: In production, upload the image to S3 and pass the S3 URL here.
                # For now, we will pass a placeholder or relative path that the dashboard can identify.
                "snapshot_url": "s3://toplens-aws-bucket/" + filename 
            }
            
            headers = {
                "Content-Type": "application/json",
                "X-Edge-Token": EDGE_TOKEN
            }
            
            # Dispatch to Backend
            try:
                response = requests.post(API_ENDPOINT, json=payload, headers=headers)
                if response.status_code == 200:
                    print(f"[+] Alert successfully synced to Central-Hub HQ.")
                else:
                    print(f"[-] Failed to sync alert. Status: {response.status_code}, {response.text}")
            except Exception as e:
                print(f"[-] API Connection Error: {e}")
                
            last_alert_time = current_time

cap.release()
print("[*] Processing Complete.")
