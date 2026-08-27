import cv2
import numpy as np
import os

# Create a blank black frame (1080p)
frame = np.zeros((1080, 1920, 3), dtype=np.uint8)

# Define a PENTAGON (5 points) ROI
pts = np.array([
    [960, 100],  # Top point
    [1500, 450], # Right point
    [1300, 950], # Bottom right
    [620, 950],  # Bottom left
    [420, 450]   # Left point
], np.int32).reshape((-1, 1, 2))

# Draw the pentagon ROI in blue
cv2.polylines(frame, [pts], True, (255, 0, 0), 3)

# Define 3 dummy people (bounding boxes)
people = [
    {"name": "Inside (Violation)", "bbox": [900, 500, 1000, 700], "color": (0, 0, 255)}, # Red (Inside)
    {"name": "Outside (Safe)", "bbox": [200, 200, 300, 400], "color": (0, 255, 0)},     # Green (Outside)
    {"name": "Edge (Checking)", "bbox": [1400, 400, 1550, 600], "color": (0, 255, 255)} # Yellow (Edge)
]

for p in people:
    x1, y1, x2, y2 = p["bbox"]
    center_x = (x1 + x2) // 2
    bottom_y = y2
    
    # THE PPE ROI LOGIC
    # pointPolygonTest checks if the point is inside the PENTAGON
    result = cv2.pointPolygonTest(pts, (center_x, bottom_y), False)
    
    # Draw the bounding box
    cv2.rectangle(frame, (x1, y1), (x2, y2), p["color"], 2)
    # Draw the point being tested (bottom center)
    cv2.circle(frame, (center_x, bottom_y), 5, p["color"], -1)
    
    status = "INSIDE ROI" if result >= 0 else "OUTSIDE ROI"
    cv2.putText(frame, f"{p['name']}: {status}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, p["color"], 2)
    print(f"{p['name']} check: {status} (Score: {result})")

cv2.imwrite("pentagon_roi_proof.jpg", frame)
print("Saved proof to pentagon_roi_proof.jpg")
