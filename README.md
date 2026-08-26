# Central-Hub

React frontend for the Central Hub Dashboard, including AI Analytics, Usecase Tracking, and System Management.


Central-Hub/
├── backend_api/                  # FastAPI Cloud Backend (Hosted on Render)
│   ├── main.py                   # API Entrypoint & CORS Config
│   ├── database.py               # SQLite / SQLAlchemy Engine Setup
│   ├── requirements.txt          # Cloud Dependencies
│   ├── models/                   # Database Schemas (ORM)
│   │   ├── alerts.py             # Stores incident records and threat levels
│   │   ├── cameras.py            # Camera stream configs (RTSP URLs)
│   │   ├── sites.py              # Location hierarchy
│   │   └── usecases.py           # Saved AI Models & ROI Polygons
│   └── routers/                  # API Endpoints (CRUD)
│       ├── alerts.py             
│       ├── cameras.py            
│       ├── sites.py              
│       └── usecases.py           
│
├── camera_agent/                 # Python Edge AI (Hosted on Render)
│   ├── requirements.txt          # OpenCV, Numpy, etc.
│   ├── core/                     # Engine Architecture
│   │   ├── agent.py              # Main inference loop & port-binding hack
│   │   ├── alert_dispatcher.py   # Pushes violations to backend_api
│   │   ├── shared_models.py      # Object Detection (YOLO placeholder)
│   │   └── stream.py             # RTSP Video Stream handler
│   ├── config/                   
│   │   └── db_client.py          # Fetches live ROI coordinates from API
│   ├── usecases/                 # Pluggable AI Logic
│   │   └── ppe_check.py          # Checks if objects are inside ROI & missing PPE
│   └── registry.py               # Plugin loader
│
└── src/                          # React Frontend Dashboard (Hosted on Vercel)
    ├── App.jsx                   # Main Layout & Sidebar State
    ├── index.css                 # Global styling & Tailwind-like utilities
    ├── api/                      # Backend Sync Hooks
    │   ├── useAlerts.js          # Live polling of backend alerts
    │   └── useConfig.js          # Fetches/Updates Camera ROIs
    ├── config/                   
    │   └── apiBase.js            # Env routing (localhost vs Cloud)
    └── components/               # UI Modules
        ├── Dashboard.jsx         # Live Feed, Charts, and Alert Drawer Modals
        ├── ConfigurationView.jsx # Camera Settings Tab
        ├── RoiCanvas.jsx         # Custom React-Konva relative-coordinate drawing
        ├── Header.jsx            # Top Navigation
        ├── Sidebar.jsx           # Mobile-responsive Side Navigation
        └── HealthMonitorView.jsx # System metrics