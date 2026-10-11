/**
 * Notifications Store using Pinia
 * 
 * Manages application-wide notifications including toasts, alerts, and system messages.
 * Provides advanced features like notification persistence, grouping, and user preferences.
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface NotificationState {
  notifications: Notification[];
  maxNotifications: number;
  defaultTimeout: number;
  preferences: NotificationPreferences;
  soundEnabled: boolean;
  browserPermission: NotificationPermission;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timeout?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
  icon?: string;
  avatar?: string;
  group?: string;
  data?: any;
  createdAt: Date;
  readAt?: Date;
  dismissedAt?: Date;
}

interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

interface NotificationPreferences {
  showToasts: boolean;
  showBrowserNotifications: boolean;
  playSound: boolean;
  groupSimilar: boolean;
  maxVisible: number;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  enabledTypes: ('success' | 'error' | 'warning' | 'info')[];
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  showToasts: true,
  showBrowserNotifications: false,
  playSound: false,
  groupSimilar: true,
  maxVisible: 5,
  position: 'top-right',
  enabledTypes: ['success', 'error', 'warning', 'info']
};

export const useNotificationStore = defineStore('notifications', () => {
  // State
  const notifications = ref<Notification[]>([]);
  const maxNotifications = ref(100);
  const defaultTimeout = ref(5000);
  const preferences = ref<NotificationPreferences>({ ...DEFAULT_PREFERENCES });
  const soundEnabled = ref(false);
  const browserPermission = ref<NotificationPermission>('default');

  // Getters
  const visibleNotifications = computed(() => {
    return notifications.value
      .filter(n => !n.dismissedAt && preferences.value.enabledTypes.includes(n.type))
      .slice(0, preferences.value.maxVisible);
  });

  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.readAt && !n.dismissedAt);
  });

  const groupedNotifications = computed(() => {
    if (!preferences.value.groupSimilar) {
      return visibleNotifications.value.map(n => ({ ...n, count: 1 }));
    }

    const groups: Record<string, Notification & { count: number }> = {};
    
    visibleNotifications.value.forEach(notification => {
      const groupKey = notification.group || `${notification.type}-${notification.title}`;
      
      if (groups[groupKey]) {
        groups[groupKey].count++;
        // Keep the most recent notification data
        if (notification.createdAt > groups[groupKey].createdAt) {
          groups[groupKey] = { ...notification, count: groups[groupKey].count };
        }
      } else {
        groups[groupKey] = { ...notification, count: 1 };
      }
    });

    return Object.values(groups);
  });

  const notificationsByType = computed(() => {
    return notifications.value.reduce((acc, notification) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  });

  const hasUnread = computed(() => unreadNotifications.value.length > 0);

  // Notification sounds
  const playNotificationSound = () => {
    if (!preferences.value.playSound || !soundEnabled.value) return;
    
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(console.error);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  };

  // Browser notifications
  const showBrowserNotification = (notification: Notification) => {
    if (!preferences.value.showBrowserNotifications || browserPermission.value !== 'granted') {
      return;
    }

    try {
      const browserNotification = new window.Notification(notification.title, {
        body: notification.message,
        icon: notification.icon || '/favicon.ico',
        tag: notification.group || notification.id,
        requireInteraction: notification.persistent
      });

      browserNotification.onclick = () => {
        markAsRead(notification.id);
        browserNotification.close();
      };

      if (!notification.persistent && notification.timeout) {
        setTimeout(() => {
          browserNotification.close();
        }, notification.timeout);
      }
    } catch (error) {
      console.warn('Could not show browser notification:', error);
    }
  };

  // Actions
  function generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  function add(notificationData: Omit<Notification, 'id' | 'createdAt'>) {
    const notification: Notification = {
      id: generateId(),
      createdAt: new Date(),
      timeout: notificationData.timeout ?? defaultTimeout.value,
      ...notificationData
    };

    // Add to the beginning of the array
    notifications.value.unshift(notification);

    // Limit total notifications
    if (notifications.value.length > maxNotifications.value) {
      notifications.value = notifications.value.slice(0, maxNotifications.value);
    }

    // Play sound
    playNotificationSound();

    // Show browser notification
    showBrowserNotification(notification);

    // Auto-dismiss if not persistent
    if (!notification.persistent && notification.timeout && notification.timeout > 0) {
      setTimeout(() => {
        dismiss(notification.id);
      }, notification.timeout);
    }

    return notification;
  }

  function success(title: string, message?: string, options?: Partial<Notification>) {
    return add({
      type: 'success',
      title,
      message,
      ...options
    });
  }

  function error(title: string, message?: string, options?: Partial<Notification>) {
    return add({
      type: 'error',
      title,
      message,
      persistent: true, // Errors are persistent by default
      ...options
    });
  }

  function warning(title: string, message?: string, options?: Partial<Notification>) {
    return add({
      type: 'warning',
      title,
      message,
      ...options
    });
  }

  function info(title: string, message?: string, options?: Partial<Notification>) {
    return add({
      type: 'info',
      title,
      message,
      ...options
    });
  }

  function dismiss(id: string) {
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
      notification.dismissedAt = new Date();
    }
  }

  function dismissAll() {
    const now = new Date();
    notifications.value.forEach(notification => {
      if (!notification.dismissedAt) {
        notification.dismissedAt = now;
      }
    });
  }

  function remove(id: string) {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  }

  function removeAll() {
    notifications.value = [];
  }

  function markAsRead(id: string) {
    const notification = notifications.value.find(n => n.id === id);
    if (notification && !notification.readAt) {
      notification.readAt = new Date();
    }
  }

  function markAllAsRead() {
    const now = new Date();
    notifications.value.forEach(notification => {
      if (!notification.readAt) {
        notification.readAt = now;
      }
    });
  }

  function clear() {
    // Remove dismissed notifications older than 24 hours
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 1);
    
    notifications.value = notifications.value.filter(n => 
      !n.dismissedAt || n.dismissedAt > cutoff
    );
  }

  function updatePreferences(newPreferences: Partial<NotificationPreferences>) {
    preferences.value = { ...preferences.value, ...newPreferences };
    
    // Save to localStorage
    localStorage.setItem('notification-preferences', JSON.stringify(preferences.value));
  }

  function loadPreferences() {
    try {
      const saved = localStorage.getItem('notification-preferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        preferences.value = { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.warn('Could not load notification preferences:', error);
    }
  }

  async function requestBrowserPermission() {
    if (!('Notification' in window)) {
      console.warn('Browser notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      browserPermission.value = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  function enableSound() {
    soundEnabled.value = true;
  }

  function disableSound() {
    soundEnabled.value = false;
  }

  // Utility functions for common notification patterns
  function apiSuccess(message: string = 'Operation completed successfully') {
    return success('Success', message, {
      timeout: 3000,
      group: 'api-success'
    });
  }

  function apiError(err: any, context?: string) {
    // The parameter used to be named `error`, shadowing the store's own
    // `error()` above — `useApi`'s default error-notification path threw
    // `TypeError: error is not a function` instead of toasting. Pinned in
    // src/composables/__tests__/useApi.retry.test.ts.
    const message = err?.message || err?.toString() || 'An unexpected error occurred';
    const title = context ? `${context} Failed` : 'Error';

    return error(title, message, {
      group: 'api-error',
      data: { error: err, context }
    });
  }

  function validationError(message: string) {
    return warning('Validation Error', message, {
      timeout: 8000,
      group: 'validation'
    });
  }

  function connectionError() {
    return error('Connection Error', 'Unable to connect to the server. Please check your internet connection.', {
      group: 'connection',
      actions: [
        {
          label: 'Retry',
          action: () => window.location.reload(),
          style: 'primary'
        }
      ]
    });
  }

  function featureUnavailable(feature: string) {
    return info('Feature Unavailable', `${feature} is not available in your current plan.`, {
      timeout: 10000,
      group: 'feature-unavailable'
    });
  }

  function maintenanceMode() {
    return warning('Maintenance Mode', 'The system is currently under maintenance. Some features may be unavailable.', {
      persistent: true,
      group: 'maintenance'
    });
  }

  // Initialize
  function initialize() {
    loadPreferences();
    
    // Check browser notification permission
    if ('Notification' in window) {
      browserPermission.value = Notification.permission;
    }
    
    // Set up periodic cleanup
    setInterval(clear, 60 * 60 * 1000); // Clean every hour
  }

  return {
    // State
    notifications,
    maxNotifications,
    defaultTimeout,
    preferences,
    soundEnabled,
    browserPermission,
    
    // Getters
    visibleNotifications,
    unreadNotifications,
    groupedNotifications,
    notificationsByType,
    hasUnread,
    
    // Basic actions
    add,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
    remove,
    removeAll,
    markAsRead,
    markAllAsRead,
    clear,
    
    // Settings
    updatePreferences,
    loadPreferences,
    requestBrowserPermission,
    enableSound,
    disableSound,
    
    // Utility methods
    apiSuccess,
    apiError,
    validationError,
    connectionError,
    featureUnavailable,
    maintenanceMode,
    
    // Initialize
    initialize
  };
});