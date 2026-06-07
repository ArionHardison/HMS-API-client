/**
 * HMS API Authentication Example
 *
 * This example demonstrates how to use the HMS API client for authentication.
 */
/**
 * Login Example
 *
 * This example demonstrates how to login with email and password.
 */
export declare function loginExample(email: string, password: string): Promise<void>;
/**
 * Registration Example
 *
 * This example demonstrates how to register a new user.
 */
export declare function registerExample(name: string, email: string, password: string, passwordConfirmation: string): Promise<void>;
/**
 * Get Current User Example
 *
 * This example demonstrates how to get the currently authenticated user.
 */
export declare function getCurrentUserExample(): Promise<void>;
/**
 * Logout Example
 *
 * This example demonstrates how to logout.
 */
export declare function logoutExample(): Promise<void>;
/**
 * Password Reset Example
 *
 * This example demonstrates how to request a password reset and set a new password.
 */
export declare function requestPasswordResetExample(email: string): Promise<void>;
/**
 * Set New Password Example
 *
 * This example demonstrates how to set a new password with a reset token.
 */
export declare function setNewPasswordExample(email: string, token: string, password: string, passwordConfirmation: string): Promise<void>;
//# sourceMappingURL=auth-example.d.ts.map