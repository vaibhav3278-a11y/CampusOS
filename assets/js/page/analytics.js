// ======================================
// CampusOS
// Analytics Page v1.0
// ======================================

// ======================================
// Productivity
// ======================================

function loadProductivity() {

    document.getElementById("analyticsProductivity").textContent =
        AnalyticsService.getProductivity() + "%";

    document.getElementById("analyticsGrade").textContent =
        "Grade : " + AnalyticsService.getGrade();

}

// ======================================
// Statistics
// ======================================

function loadStatistics() {

    const assignmentStats =
        AnalyticsService.getAssignmentStats();

    const plannerStats =
        AnalyticsService.getPlannerStats();

    const notesStats =
        AnalyticsService.getNotesStats();

    const internshipStats =
        AnalyticsService.getInternshipStats();

    document.getElementById("analyticsAssignments").textContent =
        assignmentStats.total;

    document.getElementById("analyticsPlanner").textContent =
        plannerStats.total;

    document.getElementById("analyticsNotes").textContent =
        notesStats.total;

    document.getElementById("analyticsInternships").textContent =
        internshipStats.applications;

}

// ======================================
// Achievements (Enhanced View Rendering)
// ======================================

function loadAchievements() {

    const achievements = AnalyticsService.getAchievements();
    const list = document.getElementById("achievementList");

    if (!list) return;

    list.innerHTML = "";

    achievements.forEach(item => {
        const li = document.createElement("li");
        li.style.padding = "12px 16px";
        li.style.marginBottom = "8px";
        li.style.borderRadius = "10px";
        li.style.background = "var(--primary-light, #EEF2FF)";
        li.style.color = "var(--dark, #0F172A)";
        li.style.fontWeight = "600";
        li.textContent = item;
        list.appendChild(li);
    });
}

// ======================================
// Initialize
// ======================================

function initializeAnalytics() {

    loadProductivity();

    loadStatistics();

    loadAchievements();

}

initializeAnalytics();
// ======================================
// Mobile Menu Toggle (RC1 Audit)
// ======================================
document.addEventListener("DOMContentLoaded", () => {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.querySelector(".sidebar");

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active-mobile");
        });
    }
});