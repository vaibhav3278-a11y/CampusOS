// ======================================
// CampusOS Modal Manager v1.0
// ======================================

const Modal = {

    open(id) {

        const modal = document.getElementById(id);

        if (!modal) return;

        modal.classList.add("show");

    },

    close(id) {

        const modal = document.getElementById(id);

        if (!modal) return;

        modal.classList.remove("show");

    },

    bind(id) {

        const modal = document.getElementById(id);

        if (!modal) return;

        modal.addEventListener("click", function (e) {

            if (e.target === modal) {

                modal.classList.remove("show");

            }

        });

    }

};