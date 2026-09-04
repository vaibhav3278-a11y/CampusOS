// ======================================
// CampusOS
// Placement Tracker v2.0 (AI Enabled)
// ======================================

const addPlacementBtn = document.getElementById("addPlacementBtn");
const placementModal = document.getElementById("placementModal");
const placementForm = document.getElementById("placementForm");
const placementList = document.getElementById("placementList");
const searchInput = document.getElementById("searchPlacement");
const cancelPlacementBtn = document.getElementById("cancelPlacementBtn");

let editingPlacementId = null;

// ======================================
// Modal Bindings
// ======================================

Modal.bind("placementModal");
Modal.bind("aiPlacementModal");

addPlacementBtn.addEventListener("click", () => {
    editingPlacementId = null;
    placementForm.reset();

    document.getElementById("placementModalTitle").textContent = "🎯 New Placement";
    document.getElementById("driveDate").value = DateUtils.today();

    Modal.open("placementModal");
});

cancelPlacementBtn.addEventListener("click", () => {
    Modal.close("placementModal");
});

// ======================================
// Save / Update Placement (Enhanced Validation)
// ======================================

placementForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const company = document.getElementById("company").value.trim();
    const role = document.getElementById("role").value.trim();
    const location = document.getElementById("location").value.trim();
    const packageValue = document.getElementById("package").value.trim();
    const driveDate = document.getElementById("driveDate").value;
    const status = document.getElementById("status").value;
    const notes = document.getElementById("placementNotes").value.trim();

    // Validation Checks
    if (!Validator.required(company)) {
        Toast.error("Company name cannot be blank");
        return;
    }

    if (!Validator.required(role)) {
        Toast.error("Role title cannot be blank");
        return;
    }

    if (!Validator.date(driveDate)) {
        Toast.error("Please select a valid drive date");
        return;
    }

    const placement = {
        id: editingPlacementId || Date.now(),
        company,
        role,
        location,
        package: packageValue,
        driveDate,
        status,
        notes
    };

    if (editingPlacementId) {
        PlacementService.update(placement);
        Toast.success("Placement updated");
    } else {
        PlacementService.add(placement);
        Toast.success("Placement added");
    }

    placementForm.reset();
    editingPlacementId = null;
    Modal.close("placementModal");
    renderPlacements(searchInput.value);
});

// ======================================
// Edit Placement
// ======================================

function editPlacement(id) {
    const placement = PlacementService.getById(id);
    if (!placement) return;

    editingPlacementId = id;

    document.getElementById("company").value = placement.company;
    document.getElementById("role").value = placement.role;
    document.getElementById("location").value = placement.location;
    document.getElementById("package").value = placement.package;
    document.getElementById("driveDate").value = placement.driveDate;
    document.getElementById("status").value = placement.status;
    document.getElementById("placementNotes").value = placement.notes;

    document.getElementById("placementModalTitle").textContent = "✏ Edit Placement";

    Modal.open("placementModal");
}

// ======================================
// Render Placements
// ======================================

function renderPlacements(search = "") {
    let placements = PlacementService.getAll();

    if (search) {
        const keyword = search.toLowerCase();
        placements = placements.filter(item =>
            item.company.toLowerCase().includes(keyword) ||
            item.role.toLowerCase().includes(keyword) ||
            item.location.toLowerCase().includes(keyword)
        );
    }

    placementList.innerHTML = "";

    if (placements.length === 0) {
        placementList.innerHTML = `
            <div class="empty-state">
                <h3>🎯 No Placement Records</h3>
                <p>Add your first placement application or use AI to optimize your resume bullets.</p>
            </div>
        `;
        updateStatistics();
        return;
    }

    placements.forEach(item => {
        placementList.innerHTML += `
            <div class="placement-card">
                <div class="placement-top">
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
                <div class="placement-info">
                    <div class="info-item">
                        📍 <strong>Location</strong><br>
                        ${item.location || "-"}
                    </div>
                    <div class="info-item">
                        💰 <strong>Package</strong><br>
                        ${item.package || "-"}
                    </div>
                    <div class="info-item">
                        📅 <strong>Drive Date</strong><br>
                        ${DateUtils.format(item.driveDate)}
                    </div>
                    <div class="info-item">
                        📝 <strong>Notes</strong><br>
                        ${item.notes || "-"}
                    </div>
                </div>
                <div class="placement-actions">
                    <button class="btn btn-outline" onclick="editPlacement(${item.id})">
                        ✏ Edit
                    </button>
                    <button class="btn btn-danger" onclick="deletePlacement(${item.id})">
                        🗑 Delete
                    </button>
                </div>
            </div>
        `;
    });

    updateStatistics();
}

// ======================================
// Delete Placement
// ======================================

function deletePlacement(id) {
    PlacementService.delete(id);
    Toast.success("Placement deleted");
    renderPlacements(searchInput.value);
}

// ======================================
// Statistics
// ======================================

function updateStatistics() {
    const stats = PlacementService.getStatistics();

    document.getElementById("totalPlacements").textContent = stats.total;
    document.getElementById("preparingPlacements").textContent = stats.preparing;
    document.getElementById("interviewPlacements").textContent = stats.interview;
    document.getElementById("selectedPlacements").textContent = stats.selected;
    document.getElementById("rejectedPlacements").textContent = stats.rejected;
}

// ======================================
// Search
// ======================================

searchInput.addEventListener("input", function () {
    renderPlacements(this.value);
});

// ======================================
// AI Placement Assistant Event Handlers
// ======================================

const aiPlacementBtn = document.getElementById("aiPlacementBtn");
const submitAiPlacement = document.getElementById("submitAiPlacement");
const aiPlacementInput = document.getElementById("aiPlacementInput");
const aiPrepType = document.getElementById("aiPrepType");
const aiPlacementLoading = document.getElementById("aiPlacementLoading");
const aiPlacementResult = document.getElementById("aiPlacementResult");

if (aiPlacementBtn) {
    aiPlacementBtn.addEventListener("click", () => {
        if (aiPlacementInput) aiPlacementInput.value = "";
        if (aiPlacementResult) {
            aiPlacementResult.style.display = "none";
            aiPlacementResult.textContent = "";
        }
        if (aiPlacementLoading) aiPlacementLoading.style.display = "none";
        Modal.open("aiPlacementModal");
    });
}

if (submitAiPlacement) {
    submitAiPlacement.addEventListener("click", async () => {
        const inputVal = aiPlacementInput.value.trim();
        const mode = aiPrepType.value;

        if (!Validator.required(inputVal)) {
            Toast.error("Please enter a role or bullet point");
            return;
        }

        try {
            submitAiPlacement.disabled = true;
            if (aiPlacementLoading) aiPlacementLoading.style.display = "block";
            if (aiPlacementResult) aiPlacementResult.style.display = "none";

            const resultText = await AIService.generatePlacementPrep(inputVal, mode);

            if (aiPlacementResult) {
                aiPlacementResult.textContent = resultText;
                aiPlacementResult.style.display = "block";
            }
            Toast.success("Generated successfully!");

        } catch (error) {
            Toast.error(error.message || "Failed to generate placement prep");
        } finally {
            submitAiPlacement.disabled = false;
            if (aiPlacementLoading) aiPlacementLoading.style.display = "none";
        }
    });
}

// ======================================
// Initial Load & Mobile Menu
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.querySelector(".sidebar");

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active-mobile");
        });
    }

    renderPlacements();
});

// Window Exports
window.editPlacement = editPlacement;
window.deletePlacement = deletePlacement;