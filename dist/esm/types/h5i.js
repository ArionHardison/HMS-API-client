/**
 * Types for `H5iApiClient` — the H5i (i5h) messaging-protocol module.
 *
 * Source of truth: `Modules/H5i/Routes/api.php`, the two FormRequests
 * (`StoreH5iMessageRequest`, `InboxH5iMessageRequest`), and
 * `H5iMessage::toWireFormat()`. The controller responses do NOT use the
 * `{success, message, data}` envelope — they return bespoke top-level
 * shapes, so the client types `ApiResponse<T>` where `T` is the full
 * controller body.
 */
export {};
//# sourceMappingURL=h5i.js.map