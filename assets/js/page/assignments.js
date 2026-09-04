// ======================================
// CampusOS
// Assignment Manager Pro v3.0
// ======================================

const addAssignmentBtn = document.getElementById("addAssignmentBtn");
const assignmentModal = document.getElementById("assignmentModal");
const assignmentForm = document.getElementById("assignmentForm");
const assignmentList = document.getElementById("assignmentList");
const searchInput = document.getElementById("searchAssignment");

let editingAssignmentId = null;

// ================================
// Modal
// ================================

addAssignmentBtn.addEventListener("click", () => {

    editingAssignmentId = null;

    assignmentForm.reset();

    document.querySelector(".modal-content h2").textContent =
        "📚 New Assignment";

    Modal.open("assignmentModal");

});

Modal.bind("assignmentModal");

// ================================
// Save / Update Assignment
// ================================

assignmentForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const assignment = {

        id: editingAssignmentId || Date.now(),

        title: document.getElementById("title").value.trim(),

        subject: document.getElementById("subject").value.trim(),

        dueDate: document.getElementById("dueDate").value,

        priority: document.getElementById("priority").value,

        completed: editingAssignmentId
            ? AssignmentService.getById(editingAssignmentId).completed
            : false

    };

    if (editingAssignmentId) {

        AssignmentService.update(assignment);

        Toast.success("Assignment Updated Successfully");

    } else {

        AssignmentService.add(assignment);

        Toast.success("Assignment Saved Successfully");

    }

    assignmentForm.reset();

    Modal.close("assignmentModal");

    editingAssignmentId = null;

    renderAssignments(searchInput.value);

});

// ================================
// Render Assignments
// ================================

function renderAssignments(search = "") {

    let assignments = AssignmentService.getAll();

    if (search) {

        assignments = assignments.filter(a =>

            a.title.toLowerCase().includes(search.toLowerCase()) ||

            a.subject.toLowerCase().includes(search.toLowerCase())

        );

    }

    assignmentList.innerHTML = "";

    assignments.forEach((assignment) => {

        assignmentList.innerHTML += `

<div class="assignment-card ${assignment.completed ? "completed-card" : ""}">

    <div class="assignment-top">

        <h3>📚 ${assignment.title}</h3>

        <span class="priority ${assignment.priority.toLowerCase()}">

            ${assignment.priority}

        </span>

    </div>

    <p>

        <strong>Subject</strong><br>

        ${assignment.subject}

    </p>

    <p>

        <strong>Due Date</strong><br>

        ${assignment.dueDate}

    </p>

    <div class="status">

        ${assignment.completed ? "🟢 Completed" : "🟡 Pending"}

    </div>

    <div class="action-buttons">

        <button
            class="btn btn-success"
            onclick="toggleComplete(${assignment.id})">

            ${assignment.completed ? "↩ Undo" : "✔ Complete"}

        </button>

        <button
            class="btn btn-outline"
            onclick="editAssignment(${assignment.id})">

            ✏ Edit

        </button>

        <button
            class="btn btn-danger"
            onclick="deleteAssignment(${assignment.id})">

            🗑 Delete

        </button>

    </div>

</div>

`;

    });

    updateStatistics();

}

// ================================
// Edit
// ================================

function editAssignment(id) {

    const assignment = AssignmentService.getById(id);

    editingAssignmentId = id;

    document.getElementById("title").value = assignment.title;
    document.getElementById("subject").value = assignment.subject;
    document.getElementById("dueDate").value = assignment.dueDate;
    document.getElementById("priority").value = assignment.priority;

    document.querySelector(".modal-content h2").textContent =
        "✏ Edit Assignment";

    Modal.open("assignmentModal");

}

// ================================
// Delete
// ================================

function deleteAssignment(id) {

    AssignmentService.delete(id);

    Toast.success("Assignment Deleted");

    renderAssignments(searchInput.value);

}

// ================================
// Complete
// ================================

function toggleComplete(id) {

    AssignmentService.toggleComplete(id);

    Toast.success("Assignment Updated");

    renderAssignments(searchInput.value);

}


// ================================
// Statistics
// ================================

function updateStatistics() {

    const stats = AssignmentService.getStatistics();

    document.getElementById("totalAssignments").textContent = stats.total;
    document.getElementById("pendingAssignments").textContent = stats.pending;
    document.getElementById("completedAssignments").textContent = stats.completed;
    document.getElementById("highPriorityAssignments").textContent = stats.highPriority;

}

// ================================
// Search
// ================================

searchInput.addEventListener("input", function () {

    renderAssignments(this.value);

});

// ================================
// Initial Load
// ================================

renderAssignments();