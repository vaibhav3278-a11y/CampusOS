console.log("Register JS Loaded");
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;

    }

    const user = {

        name,

        email,

        password

    };

    localStorage.setItem("campusUser", JSON.stringify(user));

    alert("Account created successfully! 🎉");

    window.location.href = "login.html";

});