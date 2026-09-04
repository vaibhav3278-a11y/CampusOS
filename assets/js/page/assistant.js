// ======================================
// CampusOS
// AI Assistant Page v1.0
// ======================================

// ======================================
// Greeting
// ======================================

function loadGreeting() {

    document.getElementById("assistantGreeting").textContent =
        AssistantService.getGreeting();

}

// ======================================
// Summary
// ======================================

function loadSummary() {

    const summary = AssistantService.getSummary();

    const list = document.getElementById("summaryList");

    list.innerHTML = "";

    const items = [

        `📚 Pending Assignments : ${summary.assignments}`,

        `📅 Pending Planner Tasks : ${summary.planner}`,

        `💼 Internship Applications : ${summary.internships}`,

        `🎉 Internship Offers : ${summary.offers}`,

        `🎯 Placement Records : ${summary.placements}`

    ];

    items.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item;

        list.appendChild(li);

    });

}

// ======================================
// Recommendations
// ======================================

function loadRecommendations() {

    const recommendations =
        AssistantService.getRecommendations();

    const list =
        document.getElementById("recommendationList");

    list.innerHTML = "";

    recommendations.forEach(tip => {

        const li = document.createElement("li");

        li.textContent = tip;

        list.appendChild(li);

    });

}

// ======================================
// Productivity
// ======================================

function loadProductivity() {

    const summary =
        AssistantService.getSummary();

    document.getElementById("productivityScore").textContent =
        summary.productivity + "%";

}

// ======================================
// Initialize
// ======================================

function initializeAssistant() {

    loadGreeting();

    loadSummary();

    loadRecommendations();

    loadProductivity();

}

initializeAssistant();
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
// ======================================
// Chat Submission Validation
// ======================================

function handleSendMessage() {
    const chatInput = document.getElementById("chatInput");
    if (!chatInput) return;

    const query = chatInput.value.trim();

    if (!Validator.required(query)) {
        Toast.error("Please enter a message or command");
        return;
    }

    if (!Validator.maxLength(query, 500)) {
        Toast.error("Query must be under 500 characters");
        return;
    }

    // Process rule-based response
    AssistantService.processQuery(query);
    chatInput.value = "";
}