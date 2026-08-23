import cv2
import numpy as np
from typing import List, Dict, Any

class Visualizer:
    \"\"\"
    Draws bounding boxes, labels, and ROI polygons on frames.
    \"\"\"
    def __init__(self):
        self.colors = {
            'person': (255, 0, 0),     # Blue
            'vehicle': (0, 255, 0),    # Green
            'alert': (0, 0, 255),      # Red
            'roi': (0, 255, 255)       # Yellow
        }

    def draw(self, frame: np.ndarray, detections: List[Dict[str, Any]], alerts: List[Dict[str, Any]], roi_polygon=None) -> np.ndarray:
        vis_frame = frame.copy()
        
        # 1. Draw ROI Polygon
        if roi_polygon is not None:
            cv2.polylines(vis_frame, [roi_polygon], isClosed=True, color=self.colors['roi'], thickness=2)
            cv2.putText(vis_frame, "RESTRICTED ROI", (roi_polygon[0][0][0], roi_polygon[0][0][1] - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, self.colors['roi'], 2)

        # 2. Draw Detections
        for det in detections:
            bbox = det.get('bbox')
            cls = det.get('class', 'unknown')
            conf = det.get('confidence', 0.0)
            
            if not bbox or len(bbox) != 4:
                continue
                
            x1, y1, x2, y2 = bbox
            color = self.colors.get(cls, (255, 255, 255))
            
            # Check if this detection caused an alert
            is_alert = any(a.get('bbox') == bbox for a in alerts)
            if is_alert:
                color = self.colors['alert']
                label = f"VIOLATION: NO VEST"
            else:
                label = f"{cls} {conf:.2f}"

            cv2.rectangle(vis_frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(vis_frame, label, (x1, max(y1 - 10, 10)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
                        
        return vis_frame
