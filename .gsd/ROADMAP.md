# Multi-Site CV Platform - Roadmap

## Wave 1: Foundation & PostgreSQL Migration
**Objective**: Transition from prototype to production data layer and establish offline-capable structure.
- [ ] Migrate FastAPI Database from SQLite to PostgreSQL (SQLAlchemy).
- [ ] Implement JSONB support for camera_usecases schema.
- [ ] Establish sync_agent folder structure and skeleton script.
- [ ] Update ackend_api schemas to match Section 6 of SPEC.

## Wave 2: Core Camera Agent & Plugins
**Objective**: Build out the robust camera agent logic as specified.
- [ ] Define the shared Use Case Plugin Interface (ase.py).
- [ ] Refactor ppe_check.py to inherit from the new interface.
- [ ] Implement loitering_detection.py as the second plugin.
- [ ] Implement local SQLite queue in lert_dispatcher for offline resilience.

## Wave 3: Head Office vs Local Sync
**Objective**: Build the synchronization flow.
- [ ] Complete sync_agent.py to pull config from HQ and push alerts.
- [ ] Update ackend_api to support site-scoped token auth (JWT).
- [ ] Update React Dashboard to consume JWT and conditionally render Site Switcher.

## Wave 4: Model Protection & Triton (Future Scope)
**Objective**: Secure the AI models and deploy Triton Inference Server.
- [ ] Set up Triton model repository structure.
- [ ] Update shared_models.py to use gRPC client.
- [ ] Implement hardware-fingerprinting script.
- [ ] Encrypt/Decrypt wrapper for .engine files.
