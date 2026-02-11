from playwright.sync_api import sync_playwright
import time
import json
from datetime import datetime

def verify_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 412, 'height': 915} # Mobile size
        )

        mock_user = {
            "id": "USER123",
            "name": "Test Student",
            "role": "STUDENT",
            "credits": 500,
            "streak": 5,
            "mcqHistory": [],
            "isPremium": True,
            "subscriptionLevel": "ULTRA",
            "classLevel": "10",
            "board": "CBSE",
            "subscriptionEndDate": "2025-12-31T23:59:59.000Z"
        }

        today_str = datetime.now().strftime("%a %b %d %Y")

        page = context.new_page()

        print("Navigating to home...")
        page.goto("http://localhost:5000/")

        page.evaluate(f"""(user) => {{
            localStorage.setItem('nst_current_user', JSON.stringify(user));
            localStorage.setItem('nst_terms_accepted', 'true');
            localStorage.setItem('nst_has_seen_welcome', 'true');
            localStorage.setItem('nst_last_daily_tracker_date', '{today_str}');
            localStorage.setItem('nst_last_daily_challenge_date', '{today_str}');
        }}""", mock_user)

        print("Reloading...")
        page.reload()

        # POPUP HANDLING LOOP
        print("Handling popups...")
        start_time = time.time()
        while time.time() - start_time < 20:
            # 1. Check for Dashboard (Exit Condition)
            # We check if it is visible AND not covered by a backdrop.
            # But checking just visibility is usually enough if we handle popups correctly.
            if page.locator("text=Test Student").is_visible():
                # Double check no blocking elements
                try:
                    # Try to hover/click to ensure no overlay
                    # Actually, if popups are gone, we are good.
                    # We'll just break and let the final verification confirm.
                    pass
                except:
                    pass

                # Check if any popup exists
                if page.locator("div.z-\\[250\\]").count() == 0 and page.locator("div.z-\\[100\\]").count() == 0:
                     print("Dashboard visible and clear!")
                     break

            # 2. Check for "Okay" Alert (z-250) - Highest Priority
            try:
                okay_btn = page.locator("button:has-text('Okay')")
                if okay_btn.count() > 0 and okay_btn.first.is_visible():
                    print("Found 'Okay' alert. Clicking...")
                    okay_btn.first.click(timeout=2000)
                    time.sleep(1)
                    continue
            except Exception as e:
                pass # Might have disappeared or been intercepted (unlikely for top layer)

            # 3. Check for "CLAIM NOW" Reward (z-100)
            try:
                claim_btn = page.locator("button:has-text('CLAIM NOW')")
                if claim_btn.count() > 0 and claim_btn.first.is_visible():
                     print("Found 'CLAIM NOW' popup. Clicking...")
                     claim_btn.first.click(timeout=2000)
                     time.sleep(1)
                     continue
            except Exception as e:
                 print(f"Failed to click CLAIM NOW (probably blocked): {e}")
                 # If blocked, the blocking element (Alert) should be caught in next loop

            # 4. Check for "Claim Later" (Alternative)
            try:
                claim_later = page.locator("button:has-text('Claim Later')")
                if claim_later.count() > 0 and claim_later.first.is_visible():
                     print("Found 'Claim Later'. Clicking...")
                     claim_later.first.click(timeout=2000)
                     time.sleep(1)
                     continue
            except:
                pass

            time.sleep(0.5)

        # Final Dashboard Check
        try:
            page.wait_for_selector("text=Test Student", state="visible", timeout=5000)
            print("Dashboard loaded successfully.")
        except Exception as e:
            print(f"Dashboard load timed out: {e}")
            page.screenshot(path="verification_debug.png")

        time.sleep(2)

        page.screenshot(path="verification_home.png")
        print("Captured Home Screenshot (verification_home.png)")

        # Verify Sidebar
        try:
             page.locator("header button").first.click(timeout=5000)
             time.sleep(1)
             page.screenshot(path="verification_sidebar.png")
             print("Captured Sidebar Screenshot (verification_sidebar.png)")
             page.mouse.click(300, 300)
             time.sleep(0.5)
        except Exception as e:
             print(f"Sidebar interaction failed: {e}")

        # Verify AI Studio Tab
        try:
            ai_tab = page.locator("text=AI Studio")
            if ai_tab.count() > 0:
                ai_tab.click(timeout=5000)
                time.sleep(2)
                page.screenshot(path="verification_ai_studio.png")
                print("Captured AI Studio Screenshot (verification_ai_studio.png)")
            else:
                print("AI Studio tab not found.")
        except Exception as e:
            print(f"AI Studio interaction failed: {e}")

        browser.close()

if __name__ == "__main__":
    verify_dashboard()
