// ======================================
// CampusOS Date Utility v1.0
// ======================================

const DateUtils = {

    format(date) {

        if (!date) return "";

        return new Date(date).toLocaleDateString("en-IN", {

            day: "2-digit",

            month: "short",

            year: "numeric"

        });

    },

    today() {

        return new Date().toISOString().split("T")[0];

    },

    isOverdue(date) {

        return new Date(date) < new Date();

    },

    daysLeft(date) {

        const today = new Date();

        const due = new Date(date);

        const diff = due - today;

        return Math.ceil(diff / (1000 * 60 * 60 * 24));

    }

};