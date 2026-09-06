with open('backend/camera_agent/usecases/ppe_check.py', 'r', encoding='utf-8') as f:
    code = f.read()

new_process = '''    def _get_iou(self, box1, box2):
        x_left = max(box1[0], box2[0])
        y_top = max(box1[1], box2[1])
        x_right = min(box1[2], box2[2])
        y_bottom = min(box1[3], box2[3])

        if x_right < x_left or y_bottom < y_top:
            return 0.0

        intersection_area = (x_right - x_left) * (y_bottom - y_top)
        box1_area = (box1[2] - box1[0]) * (box1[3] - box1[1])
        
        return intersection_area / box1_area if box1_area > 0 else 0

    def process_frame(self, frame, detections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        alerts = []
        
        # Pre-filter gear detections
        vests = [d['bbox'] for d in detections if d.get('class') == 'vest']
        helmets = [d['bbox'] for d in detections if d.get('class') == 'hard_hat']
        
        for det in detections:
            if det.get('class') == 'person':
                person_bbox = det.get('bbox', [0,0,0,0])
                
                # Filter out detections outside the user's drawn ROI polygon
                if not self.is_in_roi(person_bbox, frame.shape):
                    continue
                    
                # Check spatial overlap to determine if THIS person has PPE
                has_vest = False
                for v_bbox in vests:
                    if self._get_iou(person_bbox, v_bbox) > 0.1: # Gear overlap threshold
                        has_vest = True
                        break
                        
                has_helmet = False
                for h_bbox in helmets:
                    # Helmet must overlap with upper part of person, but simple IoU works for now
                    if self._get_iou(person_bbox, h_bbox) > 0.05:
                        has_helmet = True
                        break
                
                missing = []
                if self.require_vest and not has_vest:
                    missing.append("high-vis vest")
                if self.require_helmet and not has_helmet:
                    missing.append("hard hat")
                    
                if missing:
                    alerts.append({
                        "type": "ppe_violation",
                        "severity": "high",
                        "description": f"Person detected without {' and '.join(missing)}",
                        "bbox": person_bbox
                    })
                    
        return alerts'''

import re
code = re.sub(r'    def process_frame\(self, frame, detections.*$', new_process, code, flags=re.DOTALL)

with open('backend/camera_agent/usecases/ppe_check.py', 'w', encoding='utf-8') as f:
    f.write(code)
