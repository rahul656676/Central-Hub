backend_readme = '''# Lake Group Central Hub - Backend Architecture

## Overview
This repository contains the core backend infrastructure and edge AI camera agents for the **Multi-Site Computer Vision Platform**. The architecture is designed to support 21 physical locations grouped under 12 core edge GPU servers, securely syncing with a central Head Office cloud server.

## System Architecture

The system uses a **Hybrid Edge-Cloud Architecture**:
1. **Edge GPU Servers (Local Sites):** Run heavy YOLO/Triton inference on raw RTSP streams.
2. **Central Hub (Head Office):** A FastAPI/PostgreSQL server that aggregates alerts, calculates global health compliance, and manages configurations.

### Core Modules

*   **ackend_api/ (Central FastAPI Server)**
    *   **PostgreSQL (JSONB):** Stores dynamically changing metadata (ROI coordinates, PPE requirements, Alert configurations).
    *   **JWT Auth (jwt_handler.py):** Ensures Site Managers only see data for their scope (site_scope), while HQ sees everything.
    *   **Reports (eports.py):** Generates real-time compliance metrics and .csv Excel exports for management.
*   **camera_agent/ (Edge AI Engine)**
    *   **Plugin System (egistry.py):** Dynamically loads AI use-cases (e.g., ppe_check.py, loitering_detection.py) on a per-camera basis without altering core code.
    *   **Offline-First Queue (lert_dispatcher.py):** If the internet drops, alerts are saved to a local sqlite3 queue and automatically flushed to HQ when the connection is restored.
*   **sync_agent/ (Configuration Sync)**
    *   A daemon that continuously polls Central HQ for configuration changes (new ROIs, new alert rules) and pushes local GPU health heartbeats (site_health).
*   **model_server/ (IP Protection & Triton)**
    *   **Hardware Fingerprinting (hw_fingerprint.py):** Binds the software to the specific Motherboard/GPU MAC address.
    *   **In-Memory Decryption (model_protection.py):** .engine models are stored encrypted on disk and decrypted dynamically into RAM, preventing unauthorized extraction of proprietary AI models.

## Local Setup
1. pip install -r requirements.txt
2. Run FastAPI: uvicorn backend_api.main:app --reload
3. Start Camera Agent: python camera_agent/core/agent.py
'''

frontend_readme = '''# Lake Group Central Hub - Frontend Dashboard

## Overview
This repository contains the React.js web application for the **Multi-Site Computer Vision Platform**. It serves as the single pane of glass for the Central Head Office and individual Site Managers to monitor 12 operational sites across 9 AI use-cases.

## Key Features & UI Architecture

*   **Global Health Monitor (HealthMonitorView.jsx)**
    *   Aggregates live GPU load, disk space, and camera uptime from the edge servers.
    *   Dynamically calculates **Avg Health Compliance** (%) per location.
*   **Real-time Alerts & Dashboards (Dashboard.jsx)**
    *   Displays Live Security, Productivity Insights, and PPE Violations.
    *   **Excel Export:** 1-click download of all site incidents to .csv for management reporting.
*   **Dynamic AI Configuration (ConfigurationView.jsx & RoiCanvas.jsx)**
    *   **Polygon ROI Drawing:** Users can draw complex n-sided polygons (e.g., Pentagons) directly over live camera feeds on the web.
    *   **Mathematical Precision:** The frontend exports exact coordinate points which the backend Python agent consumes using cv2.pointPolygonTest to calculate precise zone violations.
*   **Alert Routing Engine**
    *   Role-Based Access Control (RBAC) UI to assign specific AI violation alerts (SMS/Email) to designated supervisors per camera and per use-case.

## Tech Stack
*   **Framework:** React + Vite
*   **Icons:** Lucide-React
*   **Charts:** Recharts (Area, Bar, Pie)
*   **State:** React Hooks

## Local Setup
1. 
pm install
2. 
pm run dev
3. Open http://localhost:5173
'''

with open('backend/README.md', 'w') as f:
    f.write(backend_readme)

with open('frontend/README.md', 'w') as f:
    f.write(frontend_readme)
