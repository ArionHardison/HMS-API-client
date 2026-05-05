/**
 * Vue 3 layer barrel — composables, Pinia stores, router config.
 *
 * Importing from the package root gives you ONLY the framework-agnostic
 * core. Anything that touches vue / pinia / vue-router lives here, behind
 * the ./vue3 subpath. Vue 2 / Node / SSR consumers can use the core without
 * pulling Vue 3 into their bundle.
 *
 * Example (paths resolved by the package exports map):
 *   - core:  package root
 *   - vue3:  package root + /vue3
 */

// Composables
export { useApi, useQuery, useMutation, useInfiniteQuery, useApiState } from '../composables/useApi';
export { useForm } from '../composables/useForm';

// Pinia stores
export { useAuthStore } from '../stores/auth';
export { useItemsStore } from '../stores/items';
export { useChatStore } from '../stores/chat';
export { useWizardStore } from '../stores/wizard';
export { useNotificationStore } from '../stores/notifications';

// Store types (re-exported as types)
export type { AuthState } from '../stores/auth';
export type { ItemsState } from '../stores/items';
export type { ChatState } from '../stores/chat';
export type { WizardState } from '../stores/wizard';
export type { NotificationState } from '../stores/notifications';

// Router (default export from router/index)
export { default as router } from '../router';
