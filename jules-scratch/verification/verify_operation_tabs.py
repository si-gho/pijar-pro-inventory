from playwright.sync_api import sync_playwright, Page, expect

def verify_tabs(page: Page):
    """
    Verifies the new tabbed UI on the operations page.
    Uses robust, scoped locators to ensure stability.
    """
    print("Navigating to the operations page...")
    page.goto("http://localhost:3000/operations", timeout=60000)

    try:
        # --- Wait for page to be ready and verify "Barang Masuk" tab ---
        print("Verifying 'Barang Masuk' tab...")

        # Wait for the tab list to be visible first
        expect(page.get_by_role("tablist")).to_be_visible(timeout=20000)
        print("Tab list is visible.")

        # Scope the search to the active tab panel
        active_panel = page.get_by_role("tabpanel")

        # Find the header within the active panel
        incoming_header = active_panel.get_by_text("Barang Masuk", exact=True)
        expect(incoming_header).to_be_visible()
        print("'Barang Masuk' title is visible.")

        # Verify the add button exists in the incoming form
        expect(active_panel.get_by_role("button", name="Tambah barang baru")).to_be_visible()

        print("Taking screenshot of 'Barang Masuk' tab...")
        page.screenshot(path="jules-scratch/verification/verification-masuk.png")
        print("Screenshot 'verification-masuk.png' saved.")

        # --- Switch to and Verify "Barang Keluar" tab ---
        print("Switching to 'Barang Keluar' tab...")
        page.get_by_role("tab", name="Barang Keluar").click()

        print("Verifying 'Barang Keluar' tab content...")

        # The active panel is now the "Barang Keluar" one.
        # We re-query for it to ensure we have the new one.
        active_panel = page.get_by_role("tabpanel")

        # Find the header within the new active panel
        outgoing_header = active_panel.get_by_text("Barang Keluar", exact=True)
        expect(outgoing_header).to_be_visible()
        print("'Barang Keluar' title is visible.")

        # CRUCIAL: Verify the add button does NOT exist in the outgoing form
        expect(active_panel.get_by_role("button", name="Tambah barang baru")).not_to_be_visible()
        print("Confirmed: 'Tambah barang baru' button is not present.")

        print("Taking screenshot of 'Barang Keluar' tab...")
        page.screenshot(path="jules-scratch/verification/verification-keluar.png")
        print("Screenshot 'verification-keluar.png' saved.")

    except Exception as e:
        print("\n--- DEBUGGING: An error occurred during verification ---")
        failure_screenshot_path = "jules-scratch/verification/failure_screenshot.png"
        page.screenshot(path=failure_screenshot_path)
        print(f"Saved failure screenshot to: {failure_screenshot_path}")
        raise e

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_tabs(page)
            print("\n✅ Frontend verification script completed successfully!")
        except Exception:
            print(f"\n❌ Frontend verification script failed.")
        finally:
            browser.close()

if __name__ == "__main__":
    main()