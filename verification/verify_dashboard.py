
import json
import time
from playwright.sync_api import sync_playwright

def verify_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Dummy User Data
        user_data = {
            "id": "student123",
            "name": "Test Student",
            "role": "STUDENT",
            "email": "student@test.com",
            "classLevel": "10",
            "board": "CBSE",
            "stream": "Science",
            "isPremium": False,
            "credits": 100,
            "createdAt": "2023-01-01T00:00:00.000Z",
            "subscriptionTier": "FREE",
            "subscriptionLevel": "BASIC",
            "mcqHistory": [],
            "inbox": []
        }

        user_json = json.dumps(user_data)
        print(f"User Data: {user_json}")

        try:
            # Navigate to app
            page.goto("http://localhost:5000")
            print("Navigated to app")

            # Inject LocalStorage
            page.evaluate(f"localStorage.setItem('nst_current_user', '{user_json}');")
            page.evaluate("localStorage.setItem('nst_has_seen_welcome', 'true');")
            page.evaluate("localStorage.setItem('nst_terms_accepted', 'true');")
            print("Injected LocalStorage")

            # Reload to apply
            page.reload()
            print("Reloaded page")

            # Wait for content
            # Look for something distinct on the dashboard
            try:
                page.wait_for_selector("text=My Courses", timeout=5000)
                print("Found 'My Courses'!")
            except Exception as e:
                print(f"Wait failed: {e}")

            # Take screenshot
            page.screenshot(path="verification/dashboard_screenshot.png", full_page=True)
            print("Screenshot saved to verification/dashboard_screenshot.png")

        except Exception as e:
            print(f"Verification error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_dashboard()
