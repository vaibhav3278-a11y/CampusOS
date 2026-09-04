// ======================================
// CampusOS Toast System v1.0
// ======================================

const Toast = {

    show(message, type = "success") {

        const toast = document.createElement("div");

        toast.className = `toast toast-${type}`;

        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {

            toast.classList.add("show");

        }, 100);

        setTimeout(() => {

            toast.classList.remove("show");

            setTimeout(() => {

                toast.remove();

            }, 300);

        }, 3000);

    },

    success(message) {

        this.show("✅ " + message, "success");

    },

    error(message) {

        this.show("❌ " + message, "error");

    },

    warning(message) {

        this.show("⚠️ " + message, "warning");

    },

    info(message) {

        this.show("ℹ️ " + message, "info");

    }

};