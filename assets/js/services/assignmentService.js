// ======================================
// CampusOS
// Assignment Service v4.0
// ======================================

const AssignmentService = {

    storageKey: "assignments",

    getAll() {
        return Storage.get(this.storageKey);
    },

    saveAll(assignments) {
        Storage.save(this.storageKey, assignments);
    },

    add(assignment) {

        const assignments = this.getAll();

        assignments.push(assignment);

        this.saveAll(assignments);

    },

    getById(id) {

        return this.getAll().find(
            assignment => assignment.id === id
        );

    },

    update(updatedAssignment) {

        const assignments = this.getAll().map(assignment => {

            return assignment.id === updatedAssignment.id
                ? updatedAssignment
                : assignment;

        });

        this.saveAll(assignments);

    },

    delete(id) {

        const assignments = this.getAll().filter(
            assignment => assignment.id !== id
        );

        this.saveAll(assignments);

    },

    toggleComplete(id) {

        const assignments = this.getAll();

        assignments.forEach(assignment => {

            if (assignment.id === id) {

                assignment.completed = !assignment.completed;

            }

        });

        this.saveAll(assignments);

    },

    // ==========================
    // Statistics
    // ==========================

    getStatistics() {

        const assignments = this.getAll();

        return {

            total: assignments.length,

            pending: assignments.filter(a => !a.completed).length,

            completed: assignments.filter(a => a.completed).length,

            highPriority: assignments.filter(
                a => a.priority === "High"
            ).length

        };

    },

    // ==========================
    // Productivity
    // ==========================

    getCompletionRate() {

        const stats = this.getStatistics();

        if (stats.total === 0) return 0;

        return Math.round(
            (stats.completed / stats.total) * 100
        );

    },

    // ==========================
    // Due Today
    // ==========================

    getDueToday() {

        const today = new Date().toISOString().split("T")[0];

        return this.getAll().filter(a =>

            !a.completed &&
            a.dueDate === today

        );

    },

    // ==========================
    // Overdue
    // ==========================

    getOverdue() {

        const today = new Date().toISOString().split("T")[0];

        return this.getAll().filter(a =>

            !a.completed &&
            a.dueDate < today

        );

    },

    // ==========================
    // Upcoming
    // ==========================

    getUpcoming(days = 7) {

        const today = new Date();

        return this.getAll().filter(a => {

            if (a.completed) return false;

            const due = new Date(a.dueDate);

            const diff = Math.ceil(

                (due - today) /

                (1000 * 60 * 60 * 24)

            );

            return diff >= 0 && diff <= days;

        });

    }

};