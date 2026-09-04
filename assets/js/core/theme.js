// ======================================
// CampusOS
// Theme Manager v1.0
// ======================================

const Theme = {

    init() {

        const settings = SettingsService.getSettings();

        if (settings.darkMode) {

            document.body.classList.add("dark");

        } else {

            document.body.classList.remove("dark");

        }

    },

    toggle() {

        const settings = SettingsService.getSettings();

        settings.darkMode = !settings.darkMode;

        SettingsService.saveSettings(settings);

        this.init();

    }

};

// Apply theme immediately
document.addEventListener("DOMContentLoaded", () => {

    if (typeof SettingsService !== "undefined") {

        Theme.init();

    }

});