from usecases.ppe_check import PPECheckPlugin

# Maps use case string identifiers from the database to their implementation classes
USECASE_REGISTRY = {
    "ppe_monitoring": PPECheckPlugin,
    # Additional use cases will be registered here (anpr, loitering, etc.)
}
