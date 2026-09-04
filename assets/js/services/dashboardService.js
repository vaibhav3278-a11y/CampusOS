// ======================================
// CampusOS - Dashboard Service (Universal Key Reader)
// ======================================

const DashboardService = {
    // Helper to search across multiple potential localStorage key names
    getStorageData(keys) {
        for (const key of keys) {
            try {
                const raw = localStorage.getItem(key);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        return parsed;
                    }
                }
            } catch (e) {
                console.warn(`Error reading key "${key}":`, e);
            }
        }
        return [];
    },

    getStats() {
        // Look through all possible key names used across CampusOS modules
        const assignments = this.getStorageData(["campusos_assignments", "assignments", "assignment_list", "campus_assignments"]);
        const notes = this.getStorageData(["campusos_notes", "notes", "notesList", "campus_notes", "smart_notes"]);
        const planner = this.getStorageData(["campusos_planner", "planner", "tasks", "campus_planner", "study_plan"]);
        const internships = this.getStorageData(["campusos_internships", "internships", "applications", "campus_internships"]);

        // Assignments
        const pendingAssignments = assignments.filter(a => {
            const status = (a.status || "").toLowerCase();
            return status !== "completed" && status !== "submitted" && status !== "done";
        });

        // Tasks
        const pendingTasks = planner.filter(t => !t.completed && t.status !== "completed");

        // Productivity
        const totalItems = assignments.length + planner.length;
        const completedCount = (assignments.length - pendingAssignments.length) + (planner.length - pendingTasks.length);
        const productivity = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 100;

        return {
            assignments: pendingAssignments.length,
            totalAssignments: assignments.length,
            notes: notes.length,
            internships: internships.length,
            productivity: `${productivity}%`,
            recentNotes: notes.slice(-4).reverse(),
            upcomingAssignments: (pendingAssignments.length > 0 ? pendingAssignments : assignments).slice(0, 4),
            todayTasks: (pendingTasks.length > 0 ? pendingTasks : planner).slice(0, 4),
            internshipSummary: {
                applications: internships.length,
                interviews: internships.filter(i => /interview/i.test(i.status || "")).length,
                offers: internships.filter(i => /offer|accept/i.test(i.status || "")).length
            }
        };
    }
};

window.DashboardService = DashboardService;