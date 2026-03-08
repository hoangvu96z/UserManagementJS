import { test, expect } from '@playwright/test';

test.describe('Login Smoke Test', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    
    // Check if the page title or a header is present
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
    
    // Check if the form fields are present
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should show error message on invalid login', async ({ page }) => {
    await page.goto('/login');
    
    // Enter invalid credentials
    await page.fill('#username', 'wronguser');
    await page.fill('#password', 'wrongpass');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for the error message or alert (if any)
    // Based on login.component.html: @if (errorMessage) { <div class="alert alert-danger"> {{ errorMessage }} </div> }
    // Let's check for the alert-danger class.
    const errorMessage = page.locator('.alert-danger');
    await expect(errorMessage).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    
    // Click on the "Sign up here" link
    await page.click('text=Sign up here');
    
    // Check if the URL changed to /register
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
  });
});
