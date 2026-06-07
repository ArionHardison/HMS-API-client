/**
 * HMS API Authentication Example
 *
 * This example demonstrates how to use the HMS API client for authentication.
 */
import { hmsApiClient } from '../api';
/**
 * Login Example
 *
 * This example demonstrates how to login with email and password.
 */
export async function loginExample(email, password) {
    try {
        const response = await hmsApiClient.auth.login({
            email,
            password,
            rememberMe: true
        });
        if (response.data.success) {
            console.log('Login successful!');
            console.log('User:', response.data.data.user);
            console.log('Token expires at:', response.data.data.expiresAt);
            // The token is automatically stored in localStorage
        }
        else {
            console.error('Login failed:', response.data.message);
        }
    }
    catch (error) {
        console.error('Login error:', error.response?.data?.message || error.message);
    }
}
/**
 * Registration Example
 *
 * This example demonstrates how to register a new user.
 */
export async function registerExample(name, email, password, passwordConfirmation) {
    try {
        const response = await hmsApiClient.auth.register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            terms: true // Accept terms and conditions
        });
        if (response.data.success) {
            console.log('Registration successful!');
            console.log('User:', response.data.data.user);
            // The token is automatically stored in localStorage
        }
        else {
            console.error('Registration failed:', response.data.message);
        }
    }
    catch (error) {
        // Handle validation errors
        if (error.response?.status === 422 && error.response.data?.errors) {
            const errors = error.response.data.errors;
            Object.entries(errors).forEach(([field, messages]) => {
                console.error(`${field}: ${messages.join(', ')}`);
            });
        }
        else {
            console.error('Registration error:', error.response?.data?.message || error.message);
        }
    }
}
/**
 * Get Current User Example
 *
 * This example demonstrates how to get the currently authenticated user.
 */
export async function getCurrentUserExample() {
    try {
        // Check if user is authenticated first
        if (!hmsApiClient.auth.isAuthenticated()) {
            console.log('User is not authenticated. Please login first.');
            return;
        }
        const response = await hmsApiClient.auth.getCurrentUser();
        if (response.data.success) {
            console.log('Current user:', response.data.data);
        }
        else {
            console.error('Failed to get current user:', response.data.message);
        }
    }
    catch (error) {
        if (error.response?.status === 401) {
            console.error('Authentication error: Your session has expired. Please login again.');
            // Redirect to login page or show login modal
        }
        else {
            console.error('Error getting current user:', error.response?.data?.message || error.message);
        }
    }
}
/**
 * Logout Example
 *
 * This example demonstrates how to logout.
 */
export async function logoutExample() {
    try {
        const response = await hmsApiClient.auth.logout();
        if (response.data.success) {
            console.log('Logout successful!');
            // The token is automatically removed from localStorage
        }
        else {
            console.error('Logout failed:', response.data.message);
        }
    }
    catch (error) {
        console.error('Logout error:', error.response?.data?.message || error.message);
        // Note: Even if the API call fails, the token is still removed from localStorage
    }
}
/**
 * Password Reset Example
 *
 * This example demonstrates how to request a password reset and set a new password.
 */
export async function requestPasswordResetExample(email) {
    try {
        const response = await hmsApiClient.auth.requestPasswordReset({ email });
        if (response.data.success) {
            console.log('Password reset email sent!');
        }
        else {
            console.error('Password reset request failed:', response.data.message);
        }
    }
    catch (error) {
        console.error('Password reset error:', error.response?.data?.message || error.message);
    }
}
/**
 * Set New Password Example
 *
 * This example demonstrates how to set a new password with a reset token.
 */
export async function setNewPasswordExample(email, token, password, passwordConfirmation) {
    try {
        const response = await hmsApiClient.auth.setNewPassword({
            email,
            token,
            password,
            password_confirmation: passwordConfirmation
        });
        if (response.data.success) {
            console.log('Password reset successful!');
        }
        else {
            console.error('Password reset failed:', response.data.message);
        }
    }
    catch (error) {
        console.error('Password reset error:', error.response?.data?.message || error.message);
    }
}
// Example usage in a Vue component:
/*
<script setup lang="ts">
import { ref } from 'vue';
import { loginExample } from '@/examples/auth-example';

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

async function onLogin() {
  loading.value = true;
  error.value = null;
  
  try {
    await loginExample(email.value, password.value);
    // Redirect to dashboard or home page
    router.push('/dashboard');
  } catch (err: any) {
    error.value = err.message || 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="onLogin">
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" v-model="email" required />
    </div>
    
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" v-model="password" required />
    </div>
    
    <div v-if="error" class="error">{{ error }}</div>
    
    <button type="submit" :disabled="loading">
      {{ loading ? 'Logging in...' : 'Login' }}
    </button>
  </form>
</template>
*/ 
//# sourceMappingURL=auth-example.js.map