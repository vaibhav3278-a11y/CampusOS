// ======================================
// CampusOS
// Profile Service v1.0
// ======================================

const ProfileService = {

    storageKey: "profile",

    // ================================
    // Default Profile
    // ================================

    getDefaultProfile() {

        return {

            fullName: "",

            email: "",

            phone: "",

            college: "",

            degree: "",

            branch: "",

            semester: "",

            linkedin: "",

            github: "",

            careerGoal: "",

            bio: "",

            profileImage: ""

        };

    },

    // ================================
    // Get Profile
    // ================================

    getProfile() {

        const profile = Storage.get(this.storageKey);

        if (!profile || Array.isArray(profile)) {

            return this.getDefaultProfile();

        }

        return {

            ...this.getDefaultProfile(),

            ...profile

        };

    },

    // ================================
    // Save Profile
    // ================================

    saveProfile(profile) {

        Storage.save(this.storageKey, profile);

    },

    // ================================
    // Reset Profile
    // ================================

    resetProfile() {

        Storage.save(

            this.storageKey,

            this.getDefaultProfile()

        );

    }

};