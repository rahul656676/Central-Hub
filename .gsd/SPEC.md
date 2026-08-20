# Backend Architecture & PPE Monitoring Use Case Specification

**Status**: DRAFT

## 1. Overview
The goal is to implement the local camera agent and central backend API for the Multi-Site CV Platform, starting with the **PPE Monitoring** use case. This system will be deployed on-premises using Windows GPU machines.

## 2. Requirements

### 2.1 Directory Structure
The backend will follow the specified structure within the monorepo:
\\\
cv_platform/
+-- camera_agent/                # Python service, runs per camera as a Windows Service
¦   +-- core/
¦   ¦   +-- stream.py            # RTSP connect and reconnect
¦   ¦   +-- shared_models.py     # person and vehicle detector, loaded once
¦   ¦   +-- agent.py             # main per camera loop
¦   ¦   +-- alert_dispatcher.py  # sends alerts to local database and sync queue
¦   +-- usecases/
¦   ¦   +-- base.py              # shared use case plugin interface
¦   ¦   +-- ppe_check.py         # PPE monitoring logic
¦   +-- registry.py              # maps use case name to plugin class
¦   +-- config/
¦       +-- db_client.py         # reads camera config from local DB
+-- backend_api/                 # FastAPI, deployed centrally and at each site
¦   +-- routers/
¦   ¦   +-- sites.py
¦   ¦   +-- cameras.py
¦   ¦   +-- usecases.py
¦   ¦   +-- alerts.py
¦   ¦   +-- health.py
¦   ¦   +-- sync.py              # config pull and event push endpoints
¦   +-- models/                  # ORM models (SQLAlchemy)
¦   +-- schemas/                 # Pydantic schemas
¦   +-- auth/                    # token auth and site scope enforcement
¦   +-- main.py
+-- db/
    +-- migrations/
    +-- schema.sql
\\\

### 2.2 PPE Monitoring Use Case (Phase 1)
- **Objective**: Detect if personnel are wearing appropriate Personal Protective Equipment (hard hats, high-vis vests).
- **Integration**: Must conform to usecases/base.py plugin interface.
- **Dependency**: Uses shared_models.py (person detector) to first isolate people, then runs secondary classification for PPE.

### 2.3 Backend API (FastAPI)
- Expose REST endpoints for managing cameras, use cases, and alerts.
- Connect to local/central database using SQLAlchemy.

## 3. Open Questions for User
1. **Desktop UI Issues**: You mentioned some UI issues on desktop ("including previous ones"). Could you list them out or share a screenshot so I can squash them before we dive deep into the backend code?
2. **Database**: Should we use SQLite for local site testing, or assume PostgreSQL for both local and central?
3. **AI Framework**: Will we be using PyTorch/YOLO directly for the PPE models in shared_models.py, or ONNX/Triton?

Please review and reply so we can set this to FINALIZED.
