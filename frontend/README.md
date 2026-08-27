# Lake Group Central Hub - Frontend Dashboard

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
