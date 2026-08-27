import time
import urllib.request
import urllib.error
import json
import sqlite3
import os

class SyncAgent:
    def __init__(self, site_id, central_api_url="https://central-hub-tih5.onrender.com", local_api_url="http://localhost:8000"):
        self.site_id = site_id
        self.central_api_url = central_api_url
        self.local_api_url = local_api_url
        self.sync_interval = 60

    def pull_config(self):
        print(f"[{self.site_id}] Pulling config from Central HQ...")
        try:
            req = urllib.request.Request(f"{self.central_api_url}/sync/config/{self.site_id}")
            with urllib.request.urlopen(req, timeout=10) as response:
                if response.status == 200:
                    config_data = json.loads(response.read().decode())
                    self._apply_local_config(config_data)
        except Exception as e:
            print(f"Failed to pull config: {e}")

    def _apply_local_config(self, config_data):
        print(f"Applying new config to local DB: {len(config_data.get('usecases', []))} usecases found.")
        # In a real scenario, this would UPSERT to the local PostgreSQL database
        pass

    def push_health(self):
        print(f"[{self.site_id}] Pushing health heartbeat to Central HQ...")
        payload = {
            "site_id": self.site_id,
            "gpu_util_pct": 45.2,
            "disk_free_gb": 120.5,
            "cameras_online": 3,
            "cameras_total": 3
        }
        try:
            req = urllib.request.Request(
                f"{self.central_api_url}/sync/health/",
                data=json.dumps(payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            urllib.request.urlopen(req, timeout=5)
        except Exception as e:
            pass

    def run(self):
        while True:
            self.pull_config()
            self.push_health()
            time.sleep(self.sync_interval)

if __name__ == "__main__":
    agent = SyncAgent(site_id="LUGOBA")
    agent.run()
