// ======================================
// CampusOS - Settings Page Logic
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.querySelector(".sidebar");

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active-mobile");
        });
    }

    // 2. Dark Mode Switch Listener
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
        darkModeToggle.checked = document.body.classList.contains("dark");
        darkModeToggle.addEventListener("change", (e) => {
            if (e.target.checked) {
                document.body.classList.add("dark");
                Storage.set("theme", "dark");
            } else {
                document.body.classList.remove("dark");
                Storage.set("theme", "light");
            }
        });
    }

    // 3. Clear Storage / Reset Safety Prompt
    const clearDataBtn = document.getElementById("clearDataBtn");
    if (clearDataBtn) {
        clearDataBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to reset all local CampusOS data? This action cannot be undone.")) {
                localStorage.clear();
                Toast.success("All local data cleared successfully");
                setTimeout(() => {
                    window.location.href = "../index.html";
                }, 1200);
            }
        });
    }
});