// ======================================
// CampusOS
// Settings Service v1.0
// ======================================

const SettingsService = {

    storageKey: "settings",

    getDefaultSettings() {

        return {

            darkMode: false,

            notifications: true,

            autoSave: true

        };

    },

    getSettings() {

        const settings = Storage.get(this.storageKey);

        if (!settings || Array.isArray(settings)) {

            return this.getDefaultSettings();

        }

        return {

            ...this.getDefaultSettings(),

            ...settings

        };

    },

    saveSettings(settings) {

        Storage.save(this.storageKey, settings);

    },

    resetSettings() {

        Storage.save(

            this.storageKey,

            this.getDefaultSettings()

        );

    }

};