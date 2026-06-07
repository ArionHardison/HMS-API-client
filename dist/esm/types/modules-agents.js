/**
 * Type definitions for `Modules/Agents`.
 *
 * Structural interfaces only — no runtime code. These mirror the Laravel
 * `Modules\Agents\Transformers\*Resource` shapes from `sdk/spec/endpoints.json`.
 *
 * Lots of fields are typed `unknown` because the upstream `*Resource` files
 * pass-through arbitrary JSON columns (capabilities, configuration, tools,
 * memory, metadata). When a downstream caller knows the inner shape they can
 * narrow with their own type guard — the SDK is intentionally not opinionated
 * about it.
 */
export {};
//# sourceMappingURL=modules-agents.js.map