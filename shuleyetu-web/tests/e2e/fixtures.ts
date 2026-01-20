import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login page
    await page.goto('/auth/login');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Fill login form (using test credentials)
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });
    
    await use(page);
  },
});

export { expect };
