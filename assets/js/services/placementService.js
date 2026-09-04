// ======================================
// CampusOS
// Placement Service v1.0
// ======================================

const PlacementService = {

    storageKey: "placements",

    getAll() {

        return Storage.get(this.storageKey);

    },

    saveAll(placements) {

        Storage.save(this.storageKey, placements);

    },

    add(placement) {

        const placements = this.getAll();

        placements.push(placement);

        this.saveAll(placements);

    },

    getById(id) {

        return this.getAll().find(

            placement => placement.id === id

        );

    },

    update(updatedPlacement) {

        const placements = this.getAll().map(placement =>

            placement.id === updatedPlacement.id
                ? updatedPlacement
                : placement

        );

        this.saveAll(placements);

    },

    delete(id) {

        const placements = this.getAll().filter(

            placement => placement.id !== id

        );

        this.saveAll(placements);

    },

    getStatistics() {

        const placements = this.getAll();

        return {

            total: placements.length,

            preparing: placements.filter(

                p => p.status === "Preparing"

            ).length,

            interviewing: placements.filter(

                p => p.status === "Interview"

            ).length,

            selected: placements.filter(

                p => p.status === "Selected"

            ).length,

            rejected: placements.filter(

                p => p.status === "Rejected"

            ).length

        };

    }

};