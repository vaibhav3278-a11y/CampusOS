// ======================================
// CampusOS
// Planner Pro v2.1 (AI & Resource Links)
// ======================================

const addTaskBtn = document.getElementById("addTaskBtn");
const plannerModal = document.getElementById("plannerModal") || document.getElementById("taskModal");
const plannerForm = document.getElementById("plannerForm") || document.getElementById("taskForm");
const plannerList = document.getElementById("plannerList");
const searchInput = document.getElementById("searchTask");
const cancelPlannerBtn = document.getElementById("cancelPlannerBtn") || document.getElementById("cancelTaskBtn");

let editingTaskId = null;

// ======================================
// Modal Bindings
// ======================================

if (document.getElementById("taskModal")) Modal.bind("taskModal");
if (document.getElementById("plannerModal")) Modal.bind("plannerModal");
Modal.bind("aiPlannerModal");

if (addTaskBtn) {
    addTaskBtn.addEventListener("click", () => {
        editingTaskId = null;
        if (plannerForm) plannerForm.reset();

        const titleElem = document.getElementById("plannerModalTitle") || document.getElementById("taskModalTitle");
        if (titleElem) titleElem.textContent = "📅 New Task";

        const dateElem = document.getElementById("taskDate");
        if (dateElem) dateElem.value = DateUtils.today ? DateUtils.today() : new Date().toISOString().split("T")[0];

        const targetModal = document.getElementById("taskModal") ? "taskModal" : "plannerModal";
        Modal.open(targetModal);
    });
}

if (cancelPlannerBtn) {
    cancelPlannerBtn.addEventListener("click", () => {
        const targetModal = document.getElementById("taskModal") ? "taskModal" : "plannerModal";
        Modal.close(targetModal);
    });
}

// ======================================
// Save / Update Task
// ======================================

if (plannerForm) {
    plannerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const title = document.getElementById("taskTitle").value.trim();
        const catElem = document.getElementById("taskCategory");
        const rawCategory = catElem ? catElem.value.trim() : "";
        const date = document.getElementById("taskDate").value;
        const priorityElem = document.getElementById("taskPriority");
        const priority = priorityElem ? priorityElem.value : "Medium";
        const linkElem = document.getElementById("taskLink");
        const link = linkElem ? linkElem.value.trim() : "";

        const category = rawCategory === "" ? "General" : rawCategory;

        if (!Validator.required(title)) {
            Toast.error("Task title cannot be blank");
            return;
        }

        if (Validator.date && !Validator.date(date)) {
            Toast.error("Please select a valid target date");
            return;
        }

        if (!Validator.maxLength(title, 100)) {
            Toast.error("Task title must be under 100 characters");
            return;
        }

        const task = {
            id: editingTaskId || Date.now(),
            title,
            category,
            date,
            priority,
            link: link || "",
            completed: editingTaskId
                ? PlannerService.getById(editingTaskId).completed
                : false
        };

        if (editingTaskId) {
            PlannerService.update(task);
            Toast.success("Task updated");
        } else {
            PlannerService.add(task);
            Toast.success("Task added");
        }

        plannerForm.reset();
        editingTaskId = null;
        const targetModal = document.getElementById("taskModal") ? "taskModal" : "plannerModal";
        Modal.close(targetModal);
        renderTasks(searchInput ? searchInput.value : "");
    });
}

// ======================================
// Edit Task
// ======================================

function editTask(id) {
    const task = PlannerService.getById(id);
    if (!task) return;

    editingTaskId = id;

    document.getElementById("taskTitle").value = task.title;

    const catElem = document.getElementById("taskCategory");
    if (catElem) catElem.value = task.category || "General";

    document.getElementById("taskDate").value = task.date;

    const priorityElem = document.getElementById("taskPriority");
    if (priorityElem) priorityElem.value = task.priority || "Medium";

    const linkElem = document.getElementById("taskLink");
    if (linkElem) linkElem.value = task.link || task.resourceLink || "";

    const titleElem = document.getElementById("plannerModalTitle") || document.getElementById("taskModalTitle");
    if (titleElem) titleElem.textContent = "✏ Edit Task";

    const targetModal = document.getElementById("taskModal") ? "taskModal" : "plannerModal";
    Modal.open(targetModal);
}

// ======================================
// Render Tasks
// ======================================

function renderTasks(search = "") {
    let tasks = PlannerService.getAll();

    // Pending tasks first
    tasks.sort((a, b) => Number(a.completed) - Number(b.completed));

    if (search) {
        const keyword = search.toLowerCase();
        tasks = tasks.filter(task =>
            task.title.toLowerCase().includes(keyword) ||
            (task.category && task.category.toLowerCase().includes(keyword))
        );
    }

    if (!plannerList) return;
    plannerList.innerHTML = "";

    if (tasks.length === 0) {
        plannerList.innerHTML = `
            <div class="empty-state">
                <h3>📅 No Tasks Found</h3>
                <p>Create your first task or generate a study plan with AI.</p>
            </div>
        `;
        updateStatistics();
        return;
    }

    tasks.forEach(task => {
        const displayDate = DateUtils.format ? DateUtils.format(task.date) : task.date;
        const priorityClass = task.priority ? task.priority.toLowerCase() : "medium";
        const resourceUrl = task.link || task.resourceLink || "";

        const resourceButton = resourceUrl ? `
            <a href="${resourceUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="text-decoration: none; display: inline-flex; align-items: center; gap: 4px; font-size: 12px; padding: 6px 10px; color: var(--primary, #6366f1); border-color: var(--primary, #6366f1);">
                🔗 Resource ↗
            </a>
        ` : "";

        plannerList.innerHTML += `
            <div class="planner-card ${task.completed ? "completed" : ""}">
                <div class="planner-top">
                    <h3>${task.completed ? "✅" : "📅"} ${task.title}</h3>
                    <span class="priority ${priorityClass}">
                        ${task.priority || "Medium"}
                    </span>
                </div>
                <div class="task-category">
                    ${task.category || "General"}
                </div>
                <div class="task-date">
                    📅 ${displayDate}
                </div>
                <div class="task-actions">
                    ${resourceButton}
                    <button class="btn btn-success" onclick="toggleComplete(${task.id})">
                        ${task.completed ? "↩ Undo" : "✔ Complete"}
                    </button>
                    <button class="btn btn-outline" onclick="editTask(${task.id})">
                        ✏ Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteTask(${task.id})">
                        🗑 Delete
                    </button>
                </div>
            </div>
        `;
    });

    updateStatistics();
}

// ======================================
// Delete Task
// ======================================

function deleteTask(id) {
    PlannerService.delete(id);
    Toast.success("Task deleted");
    renderTasks(searchInput ? searchInput.value : "");
}

// ======================================
// Complete / Undo
// ======================================

function toggleComplete(id) {
    PlannerService.toggleComplete(id);
    Toast.success("Task updated");
    renderTasks(searchInput ? searchInput.value : "");
}

// ======================================
// Statistics
// ======================================

function updateStatistics() {
    const stats = PlannerService.getStatistics ? PlannerService.getStatistics() : null;
    if (!stats) return;

    const totalElem = document.getElementById("totalTasks");
    const pendingElem = document.getElementById("pendingTasks");
    const completedElem = document.getElementById("completedTasks");
    const highElem = document.getElementById("highPriorityTasks");

    if (totalElem) totalElem.textContent = stats.total;
    if (pendingElem) pendingElem.textContent = stats.pending;
    if (completedElem) completedElem.textContent = stats.completed;
    if (highElem) highElem.textContent = stats.high;
}

// ======================================
// Search
// ======================================

if (searchInput) {
    searchInput.addEventListener("input", function () {
        renderTasks(this.value);
    });
}

// ======================================
// AI Study Planner Event Handlers
// ======================================

const aiPlannerBtn = document.getElementById("aiPlannerBtn");
const submitAiPlanner = document.getElementById("submitAiPlanner");
const aiPlannerSubject = document.getElementById("aiPlannerSubject");
const aiPlannerDays = document.getElementById("aiPlannerDays");
const aiPlannerLoading = document.getElementById("aiPlannerLoading");

// Open AI Planner Modal
if (aiPlannerBtn) {
    aiPlannerBtn.addEventListener("click", () => {
        if (aiPlannerSubject) aiPlannerSubject.value = "";
        if (aiPlannerDays) aiPlannerDays.value = "5";
        if (aiPlannerLoading) aiPlannerLoading.style.display = "none";
        Modal.open("aiPlannerModal");
    });
}

// Handle AI Schedule Generation Trigger
if (submitAiPlanner) {
    submitAiPlanner.addEventListener("click", async () => {
        const subject = aiPlannerSubject.value.trim();
        const days = parseInt(aiPlannerDays.value, 10) || 5;

        if (!Validator.required(subject)) {
            Toast.error("Please enter a subject, certificate, or topic");
            return;
        }

        try {
            submitAiPlanner.disabled = true;
            if (aiPlannerLoading) aiPlannerLoading.style.display = "block";

            // Call Gemini AIService to generate multi-day schedule with resources
            const planArray = await AIService.generateStudyPlan(subject, days);

            const today = new Date();

            // Iterate over generated items and save to PlannerService
            planArray.forEach((item, index) => {
                const taskDate = new Date(today);
                taskDate.setDate(today.getDate() + index);
                const formattedDate = taskDate.toISOString().split("T")[0];

                const newTask = {
                    id: Date.now() + index,
                    title: `${item.day}: ${item.task}`,
                    category: subject.substring(0, 20),
                    date: formattedDate,
                    link: item.resourceLink || item.link || "",
                    priority: "High",
                    completed: false
                };

                PlannerService.add(newTask);
            });

            Toast.success(`Generated a ${days}-day study plan with resources!`);
            Modal.close("aiPlannerModal");
            renderTasks(searchInput ? searchInput.value : "");

        } catch (error) {
            Toast.error(error.message || "Failed to generate study plan with AI");
        } finally {
            submitAiPlanner.disabled = false;
            if (aiPlannerLoading) aiPlannerLoading.style.display = "none";
        }
    });
}

// ======================================
// Keyboard Shortcut & Initial Load
// ======================================

document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        if (addTaskBtn) addTaskBtn.click();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.querySelector(".sidebar");

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("active-mobile");
        });
    }

    renderTasks();
});

// Window Exports
window.editTask = editTask;
window.deleteTask = deleteTask;
window.toggleComplete = toggleComplete;