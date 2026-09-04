// ======================================
// CampusOS
// Smart Notes v2.1 (Multi-Mode AI & Case Studies)
// ======================================

const addNoteBtn = document.getElementById("addNoteBtn");
const noteModal = document.getElementById("noteModal");
const noteForm = document.getElementById("noteForm");
const notesList = document.getElementById("notesList");
const searchInput = document.getElementById("searchNote");
const cancelNoteBtn = document.getElementById("cancelNoteBtn");

let editingNoteId = null;

// ======================================
// Modal Bindings
// ======================================

Modal.bind("noteModal");
Modal.bind("aiModal");

if (addNoteBtn) {
    addNoteBtn.addEventListener("click", () => {
        editingNoteId = null;
        noteForm.reset();
        document.getElementById("noteModalTitle").textContent = "📝 New Note";
        Modal.open("noteModal");
    });
}

if (cancelNoteBtn) {
    cancelNoteBtn.addEventListener("click", () => {
        Modal.close("noteModal");
    });
}

// ======================================
// Save / Update Note
// ======================================

if (noteForm) {
    noteForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const title = document.getElementById("noteTitle").value.trim();
        const rawCategory = document.getElementById("noteCategory").value.trim();
        const content = document.getElementById("noteContent").value.trim();

        const category = rawCategory === "" ? "General" : rawCategory;

        if (!Validator.required(title)) {
            Toast.error("Title cannot be blank");
            return;
        }

        if (!Validator.required(content)) {
            Toast.error("Please write your note content");
            return;
        }

        if (!Validator.maxLength(title, 80)) {
            Toast.error("Title must be under 80 characters");
            return;
        }

        const note = {
            id: editingNoteId || Date.now(),
            title,
            category,
            content,
            pinned: editingNoteId
                ? NotesService.getById(editingNoteId).pinned
                : false,
            createdAt: editingNoteId
                ? NotesService.getById(editingNoteId).createdAt
                : DateUtils.format(new Date())
        };

        if (editingNoteId) {
            NotesService.update(note);
            Toast.success("Note updated");
        } else {
            NotesService.add(note);
            Toast.success("Note created");
        }

        editingNoteId = null;
        noteForm.reset();
        Modal.close("noteModal");
        renderNotes(searchInput ? searchInput.value : "");
    });
}

// ======================================
// Edit Note
// ======================================

function editNote(id) {
    const note = NotesService.getById(id);
    if (!note) return;

    editingNoteId = id;

    document.getElementById("noteTitle").value = note.title;
    document.getElementById("noteCategory").value = note.category;
    document.getElementById("noteContent").value = note.content;

    document.getElementById("noteModalTitle").textContent = "✏ Edit Note";
    Modal.open("noteModal");
}

// ======================================
// Render Notes
// ======================================

function renderNotes(search = "") {
    let notes = NotesService.getAll();

    notes.sort((a, b) => Number(b.pinned) - Number(a.pinned));

    if (search) {
        const keyword = search.toLowerCase();
        notes = notes.filter(note =>
            note.title.toLowerCase().includes(keyword) ||
            note.category.toLowerCase().includes(keyword) ||
            note.content.toLowerCase().includes(keyword)
        );
    }

    if (!notesList) return;
    notesList.innerHTML = "";

    if (notes.length === 0) {
        notesList.innerHTML = `
            <div class="empty-state">
                <h3>📝 No Notes Found</h3>
                <p>Create your first smart note or generate one with AI.</p>
            </div>
        `;
        updateStatistics();
        return;
    }

    notes.forEach(note => {
        notesList.innerHTML += `
            <div class="note-card">
                <div class="note-top">
                    <h3>${note.pinned ? "📌 " : ""}${note.title}</h3>
                    <span class="note-category">
                        ${note.category || "General"}
                    </span>
                </div>
                <div class="note-content" style="white-space: pre-wrap; line-height: 1.6;">${note.content}</div>
                <small style="display: block; margin-top: 10px; color: var(--text-muted, #94a3b8);">
                    📅 ${note.createdAt}
                </small>
                <div class="note-actions" style="margin-top: 12px;">
                    <button class="btn btn-outline" onclick="togglePin(${note.id})">
                        ${note.pinned ? "📍 Unpin" : "📌 Pin"}
                    </button>
                    <button class="btn btn-primary" onclick="editNote(${note.id})">
                        ✏ Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteNote(${note.id})">
                        🗑 Delete
                    </button>
                </div>
            </div>
        `;
    });

    updateStatistics();
}

// ======================================
// Delete / Pin
// ======================================

function deleteNote(id) {
    NotesService.delete(id);
    Toast.success("Note deleted");
    renderNotes(searchInput ? searchInput.value : "");
}

function togglePin(id) {
    NotesService.togglePin(id);
    Toast.success("Note updated");
    renderNotes(searchInput ? searchInput.value : "");
}

// ======================================
// Statistics & Search
// ======================================

function updateStatistics() {
    const stats = NotesService.getStatistics();

    const totalElem = document.getElementById("totalNotes");
    const pinnedElem = document.getElementById("pinnedNotes");
    const catElem = document.getElementById("totalCategories");

    if (totalElem) totalElem.textContent = stats.total;
    if (pinnedElem) pinnedElem.textContent = stats.pinned;
    if (catElem) catElem.textContent = stats.categories;
}

if (searchInput) {
    searchInput.addEventListener("input", function () {
        renderNotes(this.value);
    });
}

// ======================================
// AI Note Generation Handlers (Multi-Mode)
// ======================================

const aiNoteBtn = document.getElementById("aiNoteBtn");
const submitAiPrompt = document.getElementById("submitAiPrompt");
const aiPromptInput = document.getElementById("aiPrompt");
const aiLoading = document.getElementById("aiLoading");
const smartNoteMode = document.getElementById("smartNoteMode");

if (aiNoteBtn) {
    aiNoteBtn.addEventListener("click", () => {
        if (aiPromptInput) aiPromptInput.value = "";
        if (aiLoading) aiLoading.style.display = "none";
        Modal.open("aiModal");
    });
}

if (submitAiPrompt) {
    submitAiPrompt.addEventListener("click", async () => {
        const rawPrompt = aiPromptInput.value.trim();
        const mode = smartNoteMode ? smartNoteMode.value : "notes";

        if (!Validator.required(rawPrompt)) {
            Toast.error("Please enter a topic, scenario, or lecture text");
            return;
        }

        try {
            submitAiPrompt.disabled = true;
            if (aiLoading) aiLoading.style.display = "block";

            // Request AI note with selected mode (learn, notes, exam, casestudy, questions)
            const generatedData = await AIService.generateSmartNote(rawPrompt, mode);

            // Determine appropriate badge name according to mode
            let defaultCategory = "General";
            if (mode === "casestudy") defaultCategory = "Case Study";
            else if (mode === "questions") defaultCategory = "Exam Prep";
            else if (mode === "learn") defaultCategory = "Deep Dive";
            else if (mode === "exam") defaultCategory = "High Yield";

            const newNote = {
                id: Date.now(),
                title: generatedData.title || (mode === "casestudy" ? "Case Study" : "Important Questions"),
                category: generatedData.category || defaultCategory,
                content: generatedData.content || rawPrompt,
                pinned: false,
                createdAt: DateUtils.format(new Date())
            };

            NotesService.add(newNote);
            Toast.success(`Note created using ${mode.toUpperCase()} mode!`);

            Modal.close("aiModal");
            renderNotes(searchInput ? searchInput.value : "");

        } catch (error) {
            Toast.error(error.message || "Failed to generate note with AI");
        } finally {
            submitAiPrompt.disabled = false;
            if (aiLoading) aiLoading.style.display = "none";
        }
    });
}

// ======================================
// Keyboard Shortcut & Initial Load
// ======================================

document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        if (addNoteBtn) addNoteBtn.click();
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

    renderNotes();
});

// Window Exports
window.editNote = editNote;
window.deleteNote = deleteNote;
window.togglePin = togglePin;