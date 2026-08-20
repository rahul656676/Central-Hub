from abc import ABC, abstractmethod
from typing import Any, Dict, List

class UseCasePlugin(ABC):
    \"\"\"Base interface for all camera agent use cases.\"\"\"
    
    @abstractmethod
    def __init__(self, config: Dict[str, Any]):
        self.config = config

    @abstractmethod
    def process_frame(self, frame, detections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        \"\"\"
        Process a single frame and its object detections.
        Returns a list of alerts or events.
        \"\"\"
        pass
