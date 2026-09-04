// ======================================
// CampusOS
// Internship Tracker v1.0
// Part 1
// ======================================

const addInternshipBtn = document.getElementById("addInternshipBtn");
const internshipModal = document.getElementById("internshipModal");
const internshipForm = document.getElementById("internshipForm");
const internshipList = document.getElementById("internshipList");
const searchInput = document.getElementById("searchInternship");
const cancelInternshipBtn = document.getElementById("cancelInternshipBtn");

let editingInternshipId = null;

// ======================================
// Modal
// ======================================

Modal.bind("internshipModal");

addInternshipBtn.addEventListener("click", () => {

    editingInternshipId = null;

    internshipForm.reset();

    document.getElementById("internshipModalTitle").textContent =
        "💼 New Internship";

    document.getElementById("applicationDate").value =
        DateUtils.today();

    Modal.open("internshipModal");

});

cancelInternshipBtn.addEventListener("click", () => {

    Modal.close("internshipModal");

});

// ======================================
// Save / Update Internship (Enhanced Validation)
// ======================================

internshipForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const company = document.getElementById("company").value.trim();
    const role = document.getElementById("role").value.trim();
    const location = document.getElementById("location").value.trim();
    const packageValue = document.getElementById("package").value.trim();
    const applicationDate = document.getElementById("applicationDate").value;
    const status = document.getElementById("status").value;
    const jobLink = document.getElementById("jobLink").value.trim();
    const notes = document.getElementById("internshipNotes").value.trim();

    // Validation
    if (!Validator.required(company)) {
        Toast.error("Company name cannot be blank");
        return;
    }

    if (!Validator.required(role)) {
        Toast.error("Role title cannot be blank");
        return;
    }

    if (!Validator.date(applicationDate)) {
        Toast.error("Please select a valid application date");
        return;
    }

    const internship = {
        id: editingInternshipId || Date.now(),
        company,
        role,
        location,
        package: packageValue,
        applicationDate,
        status,
        jobLink,
        notes
    };

    if (editingInternshipId) {
        InternshipService.update(internship);
        Toast.success("Application updated");
    } else {
        InternshipService.add(internship);
        Toast.success("Application added");
    }

    internshipForm.reset();
    editingInternshipId = null;
    Modal.close("internshipModal");
    renderInternships(searchInput.value);
});

// ======================================
// Edit Internship
// ======================================

function editInternship(id) {

    const internship = InternshipService.getById(id);

    editingInternshipId = id;

    document.getElementById("company").value =
        internship.company;

    document.getElementById("role").value =
        internship.role;

    document.getElementById("location").value =
        internship.location;

    document.getElementById("package").value =
        internship.package;

    document.getElementById("applicationDate").value =
        internship.applicationDate;

    document.getElementById("status").value =
        internship.status;

    document.getElementById("jobLink").value =
        internship.jobLink;

    document.getElementById("internshipNotes").value =
        internship.notes;

    document.getElementById("internshipModalTitle").textContent =
        "✏ Edit Internship";

    Modal.open("internshipModal");

}
// ======================================
// Render Internships
// ======================================

function renderInternships(search = "") {

    let internships = InternshipService.getAll();

    if (search) {

        const keyword = search.toLowerCase();

        internships = internships.filter(item =>

            item.company.toLowerCase().includes(keyword) ||

            item.role.toLowerCase().includes(keyword) ||

            item.location.toLowerCase().includes(keyword)

        );

    }

    internshipList.innerHTML = "";

    if (internships.length === 0) {

        internshipList.innerHTML = `

<div class="empty-state">

    <h3>💼 No Internship Applications</h3>

    <p>Add your first internship application.</p>

</div>

`;

        updateStatistics();

        return;

    }

    internships.forEach(item => {

        internshipList.innerHTML += `

<div class="internship-card">

    <div class="internship-top">

        <div>

            <div class="company-name">

                🏢 ${item.company}

            </div>

            <div class="role-name">

                ${item.role}

            </div>

        </div>

        <span class="status ${item.status.toLowerCase()}">

            ${item.status}

        </span>

    </div>

    <div class="internship-info">

        <div class="info-item">

            📍 <strong>Location:</strong><br>

            ${item.location || "-"}

        </div>

        <div class="info-item">

            💰 <strong>Package:</strong><br>

            ${item.package || "-"}

        </div>

        <div class="info-item">

            📅 <strong>Applied:</strong><br>

            ${DateUtils.format(item.applicationDate)}

        </div>

        <div class="info-item">

            🔗 <strong>Job Link:</strong><br>

            ${
                item.jobLink
                ? `<a href="${item.jobLink}" target="_blank">Open</a>`
                : "-"
            }

        </div>

    </div>

    ${
        item.notes
        ? `

<div>

<strong>Notes</strong>

<p>${item.notes}</p>

</div>

`
        : ""
    }

    <div class="internship-actions">

        <button
            class="btn btn-outline"
            onclick="editInternship(${item.id})">

            ✏ Edit

        </button>

        <button
            class="btn btn-danger"
            onclick="deleteInternship(${item.id})">

            🗑 Delete

        </button>

    </div>

</div>

`;

    });

    updateStatistics();

}

// ======================================
// Delete Internship
// ======================================

function deleteInternship(id) {

    InternshipService.delete(id);

    Toast.success("Application deleted");

    renderInternships(searchInput.value);

}

// ======================================
// Statistics
// ======================================

function updateStatistics() {

    const stats = InternshipService.getStatistics();

    document.getElementById("totalApplications").textContent =
        stats.total;

    document.getElementById("appliedApplications").textContent =
        stats.applied;

    document.getElementById("interviewApplications").textContent =
        stats.interview;

    document.getElementById("offerApplications").textContent =
        stats.offer;

    document.getElementById("rejectedApplications").textContent =
        stats.rejected;

}

// ======================================
// Search
// ======================================

searchInput.addEventListener("input", function () {

    renderInternships(this.value);

});

// ======================================
// Initial Load
// ======================================

renderInternships();

// ======================================
// Export Functions
// ======================================

window.editInternship = editInternship;
window.deleteInternship = deleteInternship;
// ======================================
// Mobile Menu Toggle (RC1 Audit)
// ======================================
document.addEventListener("DOMContentLoaded", () => {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.querySelector(".sidebar");

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active-mobile");
        });
    }
});