// ======================================
// CampusOS Validator Engine v1.0
// ======================================

const Validator = {

    required(value) {

        return value.trim() !== "";

    },

    email(value) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    },

    minLength(value, length) {

        return value.trim().length >= length;

    },

    maxLength(value, length) {

        return value.trim().length <= length;

    },

    date(value) {

        return value !== "";

    }

};