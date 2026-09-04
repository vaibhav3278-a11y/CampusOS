// ======================================
// CampusOS
// Analytics Service v1.0
// ======================================

const AnalyticsService = {

    // ======================================
    // Assignment Statistics
    // ======================================

    getAssignmentStats() {

        return AssignmentService.getStatistics();

    },

    // ======================================
    // Planner Statistics
    // ======================================

    getPlannerStats() {

        return PlannerService.getStatistics();

    },

    // ======================================
    // Notes Statistics
    // ======================================

    getNotesStats() {

        return NotesService.getStatistics();

    },

    // ======================================
    // Internship Statistics
    // ======================================

    getInternshipStats() {

        return InternshipService.getStatistics();

    },

    // ======================================
    // Placement Statistics
    // ======================================

    getPlacementStats() {

        return PlacementService.getStatistics();

    },

    // ======================================
    // Productivity
    // ======================================

    getProductivity() {

        return DashboardService.getProductivity();

    },

    // ======================================
    // Grade
    // ======================================

    getGrade() {

        const score = this.getProductivity();

        if (score >= 90) return "A+";

        if (score >= 80) return "A";

        if (score >= 70) return "B";

        if (score >= 60) return "C";

        return "Needs Improvement";

    },

    // ======================================
    // Achievements
    // ======================================

    getAchievements() {

        const achievements = [];

        const assignments = this.getAssignmentStats();

        const planner = this.getPlannerStats();

        const notes = this.getNotesStats();

        const internships = this.getInternshipStats();

        const placements = this.getPlacementStats();

        if (assignments.completed >= 10) {

            achievements.push("🏅 Assignment Master");

        }

        if (planner.completed >= 20) {

            achievements.push("📅 Planner Champion");

        }

        if (notes.total >= 20) {

            achievements.push("📝 Note Taking Pro");

        }

        if (internships.applications >= 10) {

            achievements.push("💼 Internship Hunter");

        }

        if (placements.total >= 10) {

            achievements.push("🎯 Placement Ready");

        }

        if (achievements.length === 0) {

            achievements.push("🌱 Keep going! Your first achievement is waiting.");

        }

        return achievements;

    }

};