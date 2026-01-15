/**
 * Mock User Data
 * Simulates authenticated user profile
 */

export interface UserProfile {
    id: string;
    name: string;
    email?: string;
    avatarUrl?: string;
}

// TODO: Replace with authenticated user name from BE
export const getCurrentUser = (): UserProfile => {
    return {
        id: 'user_001',
        name: 'HOANG DIEU',
        email: 'hoangdieu@example.com',
    };
};
