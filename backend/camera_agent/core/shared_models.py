import random
import time

class SharedDetector:
    """
    Mock for the shared object detection model (e.g., YOLOv8).
    In production, this would run inference via TensorRT/ONNX.
    """
    def __init__(self):
        self.classes = ['person', 'vehicle', 'hard_hat', 'vest']
        print("Initialized Shared Detector Model")

    def detect(self, frame):
        # Simulate inference delay
        time.sleep(0.05)
        
        # Randomly generate some mock detections
        detections = []
        if random.random() > 0.5:
            detections.append({
                "class": "person",
                "confidence": round(random.uniform(0.7, 0.99), 2),
                "bbox": [100, 150, 200, 400]
            })
            
            # 50% chance the person is wearing a vest (for PPE testing)
            if random.random() > 0.5:
                detections.append({
                    "class": "vest",
                    "confidence": 0.85,
                    "bbox": [120, 200, 180, 300]
                })
                
        return detections
