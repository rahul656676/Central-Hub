import cv2
import numpy as np
import time
from typing import Any, Dict, List
from .base import UseCasePlugin

class LoiteringDetectionPlugin(UseCasePlugin):
    """
    Phase 2: Loitering Detection Use Case
    Flags anyone lingering suspiciously in a sensitive zone for longer than expected.
    """
    def __init__(self, config: Dict[str, Any]):
        super().__init__(config)
        self.dwell_seconds = config.get('params', {}).get('dwell_seconds', 30)
        self.raw_roi = config.get('roi', {}).get('points', [])
        self.roi_polygon = None
        self.frame_shape = None
        self.track_history = {} # track_id -> first_seen_time

    def _update_roi_polygon(self, frame_shape):
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
            return True
        center_x = (bbox[0] + bbox[2]) // 2
        bottom_y = bbox[3]
        return cv2.pointPolygonTest(self.roi_polygon, (center_x, bottom_y), False) >= 0

    def process_frame(self, frame, detections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        alerts = []
        current_time = time.time()
        current_track_ids = []

        for det in detections:
            if det.get('class') == 'person':
                bbox = det.get('bbox', [0,0,0,0])
                track_id = det.get('track_id', str(bbox)) # mock tracking ID
                
                if not self.is_in_roi(bbox, frame.shape):
                    continue
                
                current_track_ids.append(track_id)
                if track_id not in self.track_history:
                    self.track_history[track_id] = current_time
                else:
                    time_in_zone = current_time - self.track_history[track_id]
                    if time_in_zone > self.dwell_seconds:
                        alerts.append({
                            "type": "loitering_violation",
                            "severity": "high",
                            "description": f"Person loitering for >{self.dwell_seconds}s",
                            "bbox": bbox
                        })
                        # reset to avoid alert spam
                        self.track_history[track_id] = current_time 
                        
        # Cleanup old tracks
        self.track_history = {k: v for k, v in self.track_history.items() if k in current_track_ids}
        return alerts
