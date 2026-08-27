import urllib.request
import json
from typing import List, Dict, Any

class DBClient:
    """
    Fetches the latest camera configurations and active use cases
    from the local FastAPI backend (which talks to the SQLite DB).
    """
    def __init__(self, api_url: str = "https://central-hub-tih5.onrender.com"):
        self.api_url = api_url
        
    def get_active_usecases(self, camera_id: str) -> List[Dict[str, Any]]:
        """
        Fetches the saved use cases (and their ROI settings) for a given camera.
        """
        try:
            req = urllib.request.Request(f"{self.api_url}/usecases/?camera_id={camera_id}")
            with urllib.request.urlopen(req) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode('utf-8'))
                    return data
        except Exception as e:
            print(f"[DB_CLIENT ERROR] Failed to fetch config for {camera_id}: {e}")
            
        return []
