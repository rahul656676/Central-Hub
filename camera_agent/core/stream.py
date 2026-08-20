import time
import random

class RTSPStream:
    """
    Mocks an RTSP connection to a camera.
    In production, this would use OpenCV or GStreamer to pull frames.
    """
    def __init__(self, camera_id: str, url: str):
        self.camera_id = camera_id
        self.url = url
        self.connected = False
        
    def connect(self):
        print(f"[{self.camera_id}] Connecting to {self.url}...")
        time.sleep(1)
        self.connected = True
        print(f"[{self.camera_id}] Stream connected successfully.")
        
    def get_frame(self):
        if not self.connected:
            return None
        # Return a mock frame (e.g., a blank image or numpy array)
        return "mock_frame_data"
