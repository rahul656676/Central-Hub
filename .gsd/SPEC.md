# Project Specification: Multi Site CV Platform
**Status: FINALIZED**

## 1. Overview
This document lays out how we plan to build, deploy, and scale our computer vision platform across all client sites. Rather than developing a separate solution for every location or every use case, we are building a single product that can be configured for each camera. Which use cases run on a camera, what area it watches, and what thresholds apply are all things we set through configuration, not things we write new code for.

In scope for this phase are 9 use cases across 21 physical locations, with the number of cameras varying from location to location. A camera may run one use case or several at the same time. These 21 locations are grouped into 12 core server locations, each equipped with its own on premises GPU server that handles inferencing for itself and for any nearby locations clubbed under it. A 13th server, separate from these 12, acts as the central command center for dashboarding, reporting, and alerting across everything. Our approach is to build the core product once, meaning the camera agent, the use case plugins, and the dashboard, and then bring every location, camera, and use case online through configuration rather than repeated development work.

The dashboard needs to support two audiences comfortably. Staff at a core server location should be able to see the cameras and alerts for that location and anything clubbed under it, even if the connection back to the central command center is briefly down, while management should be able to see all 21 locations together from one place. We are treating this as a core design requirement from the start, not something to bolt on later.

## 2. Use Cases
1. PPE / Safety Gear Check: Confirms workers are wearing helmets, vests and gloves before entering risk zones.
2. Vehicle Recognition (ANPR): Automatically logs every truck and vehicle entering or leaving a site; digitizes the old manual register.
3. Container Tracking: Tracks containers using a unique container ID and logs the time of movement.
4. Spill Detection: Instantly flags oil, chemical or material spills so cleanup starts immediately.
5. Fire and Smoke Detection: Raises an alarm the moment fire or smoke is visible on any camera.
6. Intrusion Alerts: Flags anyone entering a restricted or unauthorised area.
7. Loitering Detection: Flags anyone lingering suspiciously in a sensitive zone for longer than expected.
8. Stock Counting: Automatically counts boxes, sacks, or bottles for accurate dispatch records.
9. Productivity Insights: Shows how efficiently work areas are being used during the day.

## 3. Site Locations
21 physical locations are in scope for this rollout. Rather than each location running its own separate server, they are grouped into 12 core server locations. Each core location hosts a GPU server that handles inferencing, local database, and local storage for itself and for any nearby locations clubbed under it, and stays in sync with the central server over the network.
A 13th server sits separately as the central command center. It is reserved for dashboarding, reporting, and alerting across all 12 core server locations and, through them, all 21 physical locations. It does not run camera agents or handle inferencing itself.

## 4. Tech Stack
- **Camera agent, inference, plugins**: Python (OpenCV, PyTorch, ONNX, TensorRT).
- **Dashboard frontend**: React.js.
- **Backend API**: Python (FastAPI).
- **Database**: PostgreSQL (JSONB columns for flexibility).
- **Local model serving**: Triton Inference Server / ONNX Runtime.
- **Operating system**: Windows, per site requirement.
- **Site to head office sync**: VPN (WireGuard) plus a REST sync API.

## 5. Dashboard Architecture, Local and Central
- **Local dashboard**: Runs on the site's own GPU server, served on the site network. Shows only that site's cameras/alerts. Works offline.
- **Central dashboard**: Runs on the 13th server for management. Shows all 12 core locations and 21 physical locations. Reads from the central Postgres database populated by sync agents.
- **Single React Codebase**: A single configuration value points the application at either local or central backend API at deployment time. Site scope value on JWT determines API results.

## 6. Database Schema (PostgreSQL)
- sites (id, name, location, timezone, vpn_status)
- cameras (id, site_id, name, rtsp_url, status, last_frame_at)
- usecases (id, display_name, description, config_schema as JSONB)
- camera_usecases (id, camera_id, usecase_id, roi as JSONB, params as JSONB, enabled, version)
- lerts (id, site_id, camera_id, usecase_id, severity, detected_at, clip_path, metadata as JSONB, synced_to_hq)
- site_health (id, site_id, reported_at, gpu_util_pct, disk_free_gb, cameras_online, cameras_total)

## 7. Backend Features (FastAPI)
- Shared codebase for central and local sites.
- CRUD for sites, cameras, usecases.
- Camera RTSP test endpoint.
- ROI and config validation endpoint.
- Alerts and clips API.
- Scope-enforced auth (JWT).
- Sync endpoints (pull config, push events).
- Health endpoints.
- Bulk CSV onboarding.
- Audit logging.

## 8. Frontend Features (React)
- Site switcher (central only).
- Site/Camera onboarding forms with live preview.
- Use case assignment checkboxes.
- JSON-schema generated configuration forms.
- ROI drawing tool (Konva/Fabric).
- Camera grid and live status.
- Alerts feed with video clips.
- Cross-site reporting (central only).
- Bulk CSV upload.
- RBAC views (Supervisor, Admin, Head Office).

## 9. Development Flow
- Shared plugin interface for all 9 use cases (takes ROI + params, returns alerts).
- Local testing on video clips before deployment.

## 10. Deployment Flow
- One camera agent process per camera (Windows Service), loading models dynamically.
- 12 GPU servers + 1 Central server.
- Sync agent handles pulling config and pushing events.
- Versioned camera agent updates.

## 11. Folder Structure
- camera_agent/ (core, usecases, registry, config)
- model_server/ (models, configs for Triton/ONNX)
- ackend_api/ (routers, models, schemas, auth, main)
- sync_agent/ (sync script)
- dashboard/ (React app)
- db/ (migrations, schema)
- deploy/ (windows_service, docker, onboard_site)

## 12. Operational Must Haves
- Versioned agent updates.
- Site health heartbeats.
- Local clip retention policies.
- GPU benchmarking.
- Pluggable alert delivery (SMS, Webhooks).
- NTP time sync.
- Secure VPN, tokens, no public exposure.

## 13. Model and IP Protection
- TensorRT compiled export (encrypted at rest).
- Decrypted only in memory.
- Hardware-bound license key (GPU/Motherboard).
- Offline grace period for license check.
- Dedicated Windows Service user account isolation.
- Compiled Python plugin logic.

## 14. Initial Focus
1. Shared usecase plugin interface & schema pattern.
2. Camera agent as a Windows Service (stream, shared model, plugin dispatch).
3. First 2-3 plugins (PPE, Loitering).
4. Postgres schema & sync agent (local queue).
5. FastAPI backend with site-scoped auth.
6. Dashboard onboarding flow (site -> camera -> usecase -> ROI -> deploy).
7. Pilot on one core server.
