from usecases.ppe_check import PPECheckPlugin
from usecases.loitering_detection import LoiteringDetectionPlugin

# Maps use case string identifiers from the database to their implementation classes
USECASE_REGISTRY = {
    "ppe_monitoring": PPECheckPlugin,
    "loitering_detection": LoiteringDetectionPlugin,
}
