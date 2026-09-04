const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    const user = JSON.parse(localStorage.getItem("campusUser"));

    if (!user) {

        alert("No account found. Please register first.");

        window.location.href = "register.html";

        return;

    }

    if (email === user.email && password === user.password) {

        alert("Login Successful 🎉");

        window.location.href = "dashboard.html";

    }

    else{

        alert("Invalid Email or Password");

    }

});