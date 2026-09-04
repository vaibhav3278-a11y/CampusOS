// ======================================
// CampusOS
// Internship Service v1.0
// ======================================

const InternshipService = {

    storageKey: "internships",

    getAll() {

        return Storage.get(this.storageKey);

    },

    saveAll(internships) {

        Storage.save(this.storageKey, internships);

    },

    add(internship) {

        const internships = this.getAll();

        internships.push(internship);

        this.saveAll(internships);

    },

    getById(id) {

        return this.getAll().find(

            internship => internship.id === id

        );

    },

    update(updatedInternship) {

        const internships = this.getAll().map(internship =>

            internship.id === updatedInternship.id
                ? updatedInternship
                : internship

        );

        this.saveAll(internships);

    },

    delete(id) {

        const internships = this.getAll().filter(

            internship => internship.id !== id

        );

        this.saveAll(internships);

    },

    getStatistics() {

        const internships = this.getAll();

        return {

            total: internships.length,

            applied: internships.filter(i => i.status === "Applied").length,

            interview: internships.filter(i => i.status === "Interview").length,

            offer: internships.filter(i => i.status === "Offer").length,

            rejected: internships.filter(i => i.status === "Rejected").length

        };

    }

};