// ======================================
// CampusOS
// Storage Service
// Version : 1.0
// ======================================

const Storage = {

    // ===============================
    // Save Data
    // ===============================
    save(key, data) {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

    },

    // ===============================
    // Get Data
    // ===============================
    get(key) {

        const data = localStorage.getItem(key);

        return data ? JSON.parse(data) : [];

    },

    // ===============================
    // Remove Data
    // ===============================
    remove(key) {

        localStorage.removeItem(key);

    },

    // ===============================
    // Clear Entire Storage
    // ===============================
    clear() {

        localStorage.clear();

    }

};