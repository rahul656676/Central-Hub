import cv2
import numpy as np
from typing import Any, Dict, List
from .base import UseCasePlugin

class PPECheckPlugin(UseCasePlugin):
    """
    Phase 1: PPE Monitoring Use Case
    Detects if personnel are wearing hard hats and high-vis vests.
    """
    
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.require_helmet = config.get('require_helmet', True)
        self.require_vest = config.get('require_vest', True)
        
        # Parse ROI from frontend if available
        # ROI comes as [{"x": 0.5, "y": 0.5}, ...] (Normalized 0.0-1.0)
        self.raw_roi = config.get('roi', [])
        self.roi_polygon = None
        self.frame_shape = None
            
        print(f"Initialized PPE Check Plugin. ROI configured: {len(self.raw_roi) >= 3}")

    def _update_roi_polygon(self, frame_shape):
        """Scales normalized coordinates to actual frame pixels."""
        if not self.raw_roi or len(self.raw_roi) < 3:
            return
        
        h, w = frame_shape[:2]
        pts = [[int(float(pt['x']) * w), int(float(pt['y']) * h)] for pt in self.raw_roi]
        self.roi_polygon = np.array(pts, np.int32).reshape((-1, 1, 2))
        self.frame_shape = frame_shape

    def is_in_roi(self, bbox: list, frame_shape) -> bool:
        if self.frame_shape != frame_shape:
            self._update_roi_polygon(frame_shape)
            
        if self.roi_polygon is None:
            return True # No ROI means analyze everywhere
            
        # Get center bottom point of bounding box [x1, y1, x2, y2]
        center_x = (bbox[0] + bbox[2]) // 2
        bottom_y = bbox[3]
        
        # pointPolygonTest returns >0 if inside, 0 if on edge, <0 if outside
        result = cv2.pointPolygonTest(self.roi_polygon, (center_x, bottom_y), False)
        return result >= 0

    def process_frame(self, frame, detections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        alerts = []
        
        for det in detections:
            if det.get('class') == 'person':
                bbox = det.get('bbox', [0,0,0,0])
                
                # Filter out detections outside the user's drawn ROI polygon
                if not self.is_in_roi(bbox, frame.shape):
                    continue
                    
                # Placeholder for secondary classification logic
                has_helmet = True  # Mock
                has_vest = False   # Mock
                
                if self.require_vest and not has_vest:
                    alerts.append({
                        "type": "ppe_violation",
                        "severity": "high",
                        "description": "Person detected without high-vis vest",
                        "bbox": bbox
                    })
                    
        return alerts
