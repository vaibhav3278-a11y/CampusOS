// ======================================
// CampusOS - Profile Logic
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.querySelector(".sidebar");

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active-mobile");
        });
    }

    // 2. Profile Form Handler with Enhanced Validation
    const profileForm = document.getElementById("profileForm");

    if (profileForm) {
        profileForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const nameEl = document.getElementById("profileName");
            const emailEl = document.getElementById("profileEmail");
            const collegeEl = document.getElementById("profileCollege");

            const name = nameEl ? nameEl.value.trim() : "";
            const email = emailEl ? emailEl.value.trim() : "";
            const college = collegeEl ? collegeEl.value.trim() : "";

            if (!Validator.required(name)) {
                Toast.error("Name cannot be blank");
                return;
            }

            if (email && !Validator.email(email)) {
                Toast.error("Please enter a valid email address");
                return;
            }

            if (!Validator.required(college)) {
                Toast.error("College name cannot be blank");
                return;
            }

            const updatedProfile = { name, email, college };
            Storage.set("campusUser", updatedProfile);
            Toast.success("Profile updated successfully");

            const studentNameElement = document.getElementById("studentName");
            if (studentNameElement) {
                studentNameElement.textContent = name;
            }
        });
    }
});
// ======================================
// CampusOS - Backup & Export / Import System
// ======================================

function exportData() {
    const backupData = {
        campusos_notes: JSON.parse(localStorage.getItem("campusos_notes")) || [],
        campusos_planner: JSON.parse(localStorage.getItem("campusos_planner")) || [],
        campusos_placements: JSON.parse(localStorage.getItem("campusos_placements")) || [],
        campusos_assignments: JSON.parse(localStorage.getItem("campusos_assignments")) || [],
        exportDate: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CampusOS_Backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    if (typeof Toast !== "undefined") Toast.success("Backup downloaded successfully!");
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);

            if (importedData.campusos_notes) localStorage.setItem("campusos_notes", JSON.stringify(importedData.campusos_notes));
            if (importedData.campusos_planner) localStorage.setItem("campusos_planner", JSON.stringify(importedData.campusos_planner));
            if (importedData.campusos_placements) localStorage.setItem("campusos_placements", JSON.stringify(importedData.campusos_placements));
            if (importedData.campusos_assignments) localStorage.setItem("campusos_assignments", JSON.stringify(importedData.campusos_assignments));

            if (typeof Toast !== "undefined") Toast.success("Data restored! Refreshing page...");
            setTimeout(() => location.reload(), 1200);
        } catch (error) {
            if (typeof Toast !== "undefined") Toast.error("Invalid backup JSON file.");
        }
    };
    reader.readAsText(file);
}

// Bind Export/Import Buttons
document.addEventListener("DOMContentLoaded", () => {
    const exportBtn = document.getElementById("exportDataBtn");
    const importInput = document.getElementById("importDataInput");

    if (exportBtn) exportBtn.addEventListener("click", exportData);
    if (importInput) importInput.addEventListener("change", importData);
});