import time
import sys
import os

# Ensure the parent directory is in the Python path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.stream import RTSPStream
from core.shared_models import SharedDetector
from core.alert_dispatcher import AlertDispatcher
from registry import USECASE_REGISTRY
from config.db_client import DBClient

class CameraAgent:
    """
    The main agent loop that runs for a single camera.
    Pulls frames, runs shared detection, and executes assigned use cases.
    """
    def __init__(self, camera_config: dict):
        self.camera_id = camera_config['id']
        self.site_id = camera_config['site_id']
        
        self.stream = RTSPStream(self.camera_id, camera_config['rtsp_url'])
        self.detector = SharedDetector()
        self.dispatcher = AlertDispatcher(self.site_id)
        self.db_client = DBClient()
        self.active_plugins = []
        
        self.reload_config()

    def reload_config(self):
        """Fetches latest use cases and ROIs from the backend"""
        usecases = self.db_client.get_active_usecases(self.camera_id)
        
        # If backend is down or no usecases are configured, load a fallback for testing
        if not usecases:
            print(f"[{self.camera_id}] No config found in DB, using fallback PPE plugin...")
            usecases = [{"usecase_name": "ppe_monitoring", "settings": {"require_helmet": True}}]
            
        self.active_plugins = []
        for uc in usecases:
            uc_name = uc['usecase_name']
            if uc_name in USECASE_REGISTRY:
                plugin_class = USECASE_REGISTRY[uc_name]
                # Pass the ROI and other settings from the DB to the plugin
                plugin_instance = plugin_class(uc.get('settings', {}))
                self.active_plugins.append((uc_name, plugin_instance))
                print(f"[{self.camera_id}] Loaded plugin: {uc_name} with ROI: {uc.get('settings', {}).get('roi')}")

    def start(self):
        self.stream.connect()
        
        print(f"[{self.camera_id}] Starting main inference loop...")
        try:
            while True:
                frame = self.stream.get_frame()
                if not frame:
                    print(f"[{self.camera_id}] Frame dropped, reconnecting...")
                    time.sleep(2)
                    continue
                    
                # 1. Run shared base detection (person, vehicle)
                detections = self.detector.detect(frame)
                
                # 2. Pass detections to each active use case plugin
                for uc_name, plugin in self.active_plugins:
                    alerts = plugin.process_frame(frame, detections)
                    
                    # 3. Dispatch any generated alerts
                    for alert in alerts:
                        self.dispatcher.dispatch(self.camera_id, uc_name, alert)
                        
                # Sleep to simulate FPS throttle
                time.sleep(0.5)
                
        except KeyboardInterrupt:
            print(f"[{self.camera_id}] Agent stopped.")

if __name__ == '__main__':
    # Initial camera details (usually passed via CLI args or environment variables)
    camera_details = {
        "id": "cam_loading_bay_01",
        "site_id": "site_lugoba",
        "rtsp_url": "rtsp://admin:pass@192.168.1.100/stream1"
    }
    
    agent = CameraAgent(camera_details)
    agent.start()
