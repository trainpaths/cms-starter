import { test, expect } from '@playwright/test'

// Smoke test of the built site (docker compose stack): server-rendered pages, the site's block and template, admin.

test.describe('without JavaScript (server-rendered HTML)', () => {
	test.use({ javaScriptEnabled: false })

	test('home renders the site block, lang and theme scope', async ({ page }) => {
		await page.goto('/')
		await expect(page.getByTestId('cta')).toBeVisible()
		await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible()
		await expect(page.locator('html')).toHaveAttribute('lang', 'en')
		await expect(page.locator('.site-theme')).toHaveCount(1)
	})

	test('legal notice renders with its template and is linked in the footer', async ({ page }) => {
		await page.goto('/')
		await page.getByTestId('site-footer-link').filter({ hasText: 'Legal notice' }).click()
		await expect(page).toHaveURL(/\/legal$/)
		await expect(page.getByTestId('legal-details')).toBeVisible()
	})
})

test('customer accounts are off: /login is not found', async ({ page }) => {
	await page.goto('/login')
	await expect(page.getByText('Page not found')).toBeVisible()
})

test('admin login screen loads', async ({ page }) => {
	await page.goto('/admin/login')
	await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible()
})
