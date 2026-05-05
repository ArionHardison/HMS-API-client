# CLAUDE.md — sdk

## P2X Ecosystem Role
**Five-Step Wizard Client** — type-safe TypeScript client for the wizard API
Drives the deal/policy lifecycle: Define Problem -> Codify Solution -> Setup Program -> Execute Program -> Verify Outcome. Provides WebSocket-based real-time updates for long-running operations. Consult the top-level `/CLAUDE.md` for the full ecosystem map.

## Tech Stack
- **Language:** TypeScript
- **HTTP:** Axios
- **Real-time:** WebSocket for job progress tracking
- **Build:** npm

## Commands
```bash
npm run build    # Build the client library
npm test         # Run tests
```

## Key Concepts
- Five-Step Wizard: Define Problem -> Codify Solution -> Setup Program -> Execute Program -> Verify Outcome
- Async processing with job progress tracking via WebSocket
- Full versioning and snapshot system for deal objects
- Built-in token management for API authentication

## Reference
See `README.md` in this directory for full API documentation and usage examples.
