// ======================================
// CampusOS - Case Study Solver Controller
// ======================================

let currentSolvedCase = null;

document.addEventListener("DOMContentLoaded", () => {
    // Mobile Drawer Toggle
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.querySelector(".sidebar");
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener("click", () => sidebar.classList.toggle("active-mobile"));
    }

    const solveBtn = document.getElementById("solveCaseBtn");
    const saveNotesBtn = document.getElementById("saveToNotesBtn");

    if (solveBtn) solveBtn.addEventListener("click", handleSolveCase);
    if (saveNotesBtn) saveNotesBtn.addEventListener("click", handleSaveToNotes);
});

async function handleSolveCase() {
    const caseInput = document.getElementById("caseInput");
    const promptText = caseInput ? caseInput.value.trim() : "";
    const loadingElem = document.getElementById("caseLoading");
    const solveBtn = document.getElementById("solveCaseBtn");
    const container = document.getElementById("caseResultContainer");

    if (!promptText) {
        Toast.error("Please enter a case scenario or question");
        return;
    }

    try {
        solveBtn.disabled = true;
        if (loadingElem) loadingElem.style.display = "inline-block";

        const result = await AIService.solveCaseStudy(promptText);
        currentSolvedCase = result;

        // Populate Result Elements
        document.getElementById("resultTitle").textContent = result.title || "Solved Case Study";
        document.getElementById("resultProblem").textContent = result.problem || "No problem statement specified.";
        document.getElementById("resultFramework").textContent = result.framework || "Standard Analytical Framework";
        document.getElementById("resultSolution").textContent = result.solution || "No solution provided.";

        const insightsList = document.getElementById("resultInsights");
        insightsList.innerHTML = "";
        if (Array.isArray(result.insights)) {
            result.insights.forEach(insight => {
                insightsList.innerHTML += `<li>${insight}</li>`;
            });
        }

        if (container) container.style.display = "block";
        Toast.success("Case study solved successfully!");

    } catch (err) {
        Toast.error(err.message || "Failed to solve case study");
    } finally {
        solveBtn.disabled = false;
        if (loadingElem) loadingElem.style.display = "none";
    }
}

function handleSaveToNotes() {
    if (!currentSolvedCase) {
        Toast.error("No case data to save");
        return;
    }

    const formattedContent = `PROBLEM STATEMENT:
${currentSolvedCase.problem}

FRAMEWORK:
${currentSolvedCase.framework}

STRATEGIC SOLUTION:
${currentSolvedCase.solution}

KEY LEARNINGS & INSIGHTS:
${(currentSolvedCase.insights || []).map((ins, i) => `${i + 1}. ${ins}`).join("\n")}`;

    const newNote = {
        id: Date.now(),
        title: `Case: ${currentSolvedCase.title}`,
        category: "Case Study",
        content: formattedContent,
        pinned: false,
        createdAt: DateUtils.format ? DateUtils.format(new Date()) : new Date().toLocaleDateString()
    };

    NotesService.add(newNote);
    Toast.success("Saved directly into your Smart Notes vault!");
}