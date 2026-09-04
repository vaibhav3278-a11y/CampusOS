// ======================================
// CampusOS - Dashboard Page Controller
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.querySelector(".sidebar");
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener("click", () => sidebar.classList.toggle("active-mobile"));
    }

    // 2. Profile Info
    try {
        const rawProfile = localStorage.getItem("campusos_profile") || localStorage.getItem("profile");
        const profile = rawProfile ? JSON.parse(rawProfile) : {};
        const studentNameElem = document.getElementById("studentName");
        if (studentNameElem && profile.name) {
            studentNameElem.textContent = profile.name;
        }
    } catch (e) {
        console.error("Profile load error:", e);
    }

    // 3. Render Stats
    renderDashboardUI();
});

function renderDashboardUI() {
    if (typeof DashboardService === "undefined") {
        console.error("DashboardService is not defined. Check script loading order.");
        return;
    }

    const stats = DashboardService.getStats();

    // Top Metric Cards
    const elAssign = document.getElementById("dashboardAssignments");
    const elNotes = document.getElementById("dashboardNotes");
    const elIntern = document.getElementById("dashboardInternships");
    const elProd = document.getElementById("dashboardProductivity");

    if (elAssign) elAssign.textContent = stats.assignments;
    if (elNotes) elNotes.textContent = stats.notes;
    if (elIntern) elIntern.textContent = stats.internships;
    if (elProd) elProd.textContent = stats.productivity;

    // Today's Planner
    const plannerContainer = document.getElementById("todayPlannerList");
    if (plannerContainer) {
        plannerContainer.innerHTML = stats.todayTasks.length === 0
            ? `<li style="list-style: none; color: var(--text-muted, #94a3b8); font-size: 14px;">No study tasks scheduled yet.</li>`
            : stats.todayTasks.map(task => `
                <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; list-style: none; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
                    <span>📌 ${task.title || task.task || "Task"}</span>
                    <span style="font-size: 12px; color: var(--text-muted, #94a3b8);">${task.date || task.day || "Today"}</span>
                </li>
            `).join("");
    }

    // Upcoming Assignments
    const assignContainer = document.getElementById("upcomingAssignments");
    if (assignContainer) {
        assignContainer.innerHTML = stats.upcomingAssignments.length === 0
            ? `<li style="list-style: none; color: var(--text-muted, #94a3b8); font-size: 14px;">No upcoming assignments.</li>`
            : stats.upcomingAssignments.map(item => `
                <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; list-style: none; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
                    <span>📚 ${item.title || item.name}</span>
                    <span style="font-size: 12px; color: var(--primary, #6366f1); font-weight: 500;">${item.subject || item.dueDate || "Due Soon"}</span>
                </li>
            `).join("");
    }

    // Recent Activity (Notes Vault)
    const recentActivity = document.getElementById("recentActivityList");
    if (recentActivity) {
        recentActivity.innerHTML = stats.recentNotes.length === 0
            ? `<li style="list-style: none; color: var(--text-muted, #94a3b8); font-size: 14px;">No notes created yet. Go to Smart Notes to create one!</li>`
            : stats.recentNotes.map(note => `
                <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; list-style: none; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
                    <span>📝 <strong>${note.title}</strong></span>
                    <span style="font-size: 12px; color: var(--text-muted, #94a3b8);">${note.category || "General"}</span>
                </li>
            `).join("");
    }

    // Internships
    const elApps = document.getElementById("dashboardApplications");
    const elInts = document.getElementById("dashboardInterviews");
    const elOffs = document.getElementById("dashboardOffers");

    if (elApps) elApps.textContent = stats.internshipSummary.applications;
    if (elInts) elInts.textContent = stats.internshipSummary.interviews;
    if (elOffs) elOffs.textContent = stats.internshipSummary.offers;

    // AI Greeting
    const greetingElem = document.getElementById("dashboardGreeting");
    const suggestionElem = document.getElementById("dashboardSuggestion");
    if (greetingElem) {
        greetingElem.textContent = `You have ${stats.assignments} active assignment(s) and ${stats.notes} note(s) saved.`;
    }
    if (suggestionElem) {
        suggestionElem.textContent = stats.assignments > 0
            ? "💡 Tip: Ask the AI Assistant or use Smart Notes to prepare your coursework."
            : "🎉 All caught up! Create a new note or study plan to stay ahead.";
    }
}