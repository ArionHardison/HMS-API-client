"use strict";
/**
 * Type definitions for the Protocol CRUD + AI Assist slice of the P2X API.
 *
 * Source of truth is `sdk/spec/endpoints.json` — every shape here corresponds
 * to a `request.shape` or `response.shape` for an endpoint matching one of
 * the slice predicates (URI starts with `/api/protocol/`, contains
 * `/codify-pipeline/`, starts with `/api/protocol-`, or `id` matches
 * `protocol.*` minus the PersonalChain sibling slice).
 *
 * All types are structural (interfaces, not branded aliases) so consumers
 * like `sys/` can drop their `as unknown as` workarounds.
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=protocol.js.map