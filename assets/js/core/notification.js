// ======================================
// CampusOS
// Notification Manager v2.0
// ======================================

const NotificationManager = {

    async requestPermission() {

        if (!("Notification" in window)) {

            return;

        }

        if (Notification.permission === "default") {

            await Notification.requestPermission();

        }

    },

    show(title, body) {

        if (!("Notification" in window)) {

            return;

        }

        if (Notification.permission !== "granted") {

            return;

        }

        new Notification(title, {

            body: body,

            icon: "../assets/images/logo.png"

        });

    },

    checkAssignments() {

        const overdue = DashboardService.getOverdueAssignments();

        overdue.forEach(item => {

            this.show(

                "📚 Assignment Overdue",

                `${item.title} is overdue.`

            );

        });

    },

    checkPlanner() {

        const today = DateUtils.today();

        const tasks = PlannerService
            .getAll()
            .filter(task =>
                task.date === today &&
                !task.completed
            );

        tasks.forEach(task => {

            this.show(

                "📅 Today's Task",

                task.title

            );

        });

    },

    checkInterviews() {

        InternshipService
            .getAll()
            .filter(item => item.status === "Interview")
            .forEach(item => {

                this.show(

                    "💼 Interview Reminder",

                    item.company

                );

            });

    },

    runDailyChecks() {

        this.checkAssignments();

        this.checkPlanner();

        this.checkInterviews();

    }

};