from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to test page...")
            page.goto("http://localhost:3000/test-pixel", timeout=60000)

            print("Waiting for canvas...")
            # Wait for canvas to be visible
            canvas = page.locator("canvas")
            expect(canvas).to_be_visible(timeout=30000)

            # Wait a bit for animation/image load
            page.wait_for_timeout(3000)

            print("Taking screenshot...")
            page.screenshot(path="verification/pixel_board.png")
            print("Screenshot saved.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
