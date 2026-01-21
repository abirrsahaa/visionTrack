from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to onboarding page
    page.goto("http://localhost:3000/onboarding")

    # Wait for welcome step
    page.wait_for_selector("text=Welcome")

    # Take screenshot
    page.screenshot(path="verification/onboarding_start.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
