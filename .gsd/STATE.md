# Project State - Central Hub

## Completed Waves
- **Wave 1 (Database Migration):** PostgreSQL JSONB models built (sites, cameras, lerts, usecases, site_health).
- **Wave 2 (Camera Agent Core):** ase.py plugin interface established. loitering_detection.py created. Local SQLite offline queue built in lert_dispatcher.py.
- **Wave 3 (Local vs Central Sync):** sync_agent.py created to pull configs and push health/events. JWT authentication added to FastAPI (jwt_handler.py). Sync routers added (sync.py).
- **Wave 4 (Model Protection):** Triton model server directory scaffolded. Hardware fingerprinting (hw_fingerprint.py) and memory-decryption script (model_protection.py) implemented for IP protection.

## Status
All structural foundations and specifications laid out in the Multi-Site CV Platform document have been mapped, executed, and committed to the repository.

## Debt / Notes
- The React Frontend still needs to implement a Login page to actually pass the JWT tokens.
- We need to configure actual YOLO weights into the Triton /model_server/ structure.
