// ======================================
// CampusOS
// AI Assistant Service v1.0
// ======================================

const AssistantService = {

    // ================================
    // Greeting
    // ================================

    getGreeting() {

        const profile = ProfileService.getProfile();

        const firstName = profile.fullName
            ? profile.fullName.split(" ")[0]
            : "Student";

        const hour = new Date().getHours();

        let greeting = "Good Evening";

        if (hour < 12) {

            greeting = "Good Morning";

        }
        else if (hour < 17) {

            greeting = "Good Afternoon";

        }

        return `${greeting}, ${firstName} 👋`;

    },

    // ================================
    // Dashboard Summary
    // ================================

    getSummary() {

        return {

            assignments:
                AssignmentService.getStatistics().pending,

            planner:
                PlannerService.getStatistics().pending,

            internships:
                InternshipService.getStatistics().applications,

            offers:
                InternshipService.getStatistics().offers,

            placements:
                PlacementService.getStatistics().total,

            productivity:
                DashboardService.getProductivity()

        };

    },

    // ================================
    // Recommendations
    // ================================

    getRecommendations() {

        const tips = [];

        const assignmentStats =
            AssignmentService.getStatistics();

        const plannerStats =
            PlannerService.getStatistics();

        const internshipStats =
            InternshipService.getStatistics();

        const productivity =
            DashboardService.getProductivity();

        if (assignmentStats.pending > 0) {

            tips.push(
                `📚 Complete your ${assignmentStats.pending} pending assignment(s).`
            );

        }

        if (plannerStats.pending > 0) {

            tips.push(
                `📅 You have ${plannerStats.pending} planner task(s) remaining today.`
            );

        }

        if (internshipStats.interviews > 0) {

            tips.push(
                `💼 Prepare for ${internshipStats.interviews} upcoming interview(s).`
            );

        }

        if (internshipStats.offers > 0) {

            tips.push(
                `🎉 Congratulations! You have ${internshipStats.offers} internship offer(s).`
            );

        }

        if (productivity >= 90) {

            tips.push(
                "🔥 Excellent productivity today. Keep it up!"
            );

        }
        else if (productivity >= 70) {

            tips.push(
                "👍 You're doing well. Finish today's remaining tasks."
            );

        }
        else {

            tips.push(
                "💡 Focus on high-priority tasks to improve your productivity."
            );

        }

        if (tips.length === 0) {

            tips.push(
                "🎉 Everything looks great! Enjoy your day."
            );

        }

        return tips;

    }

};