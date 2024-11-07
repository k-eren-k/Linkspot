function toggleForm(form) {
    const loginDiv = document.querySelector('.login');
    const registerDiv = document.querySelector('.register');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    if (form === 'login') {
        loginDiv.classList.add('active');
        registerDiv.classList.remove('active');
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');
    } else {
        registerDiv.classList.add('active');
        loginDiv.classList.remove('active');
        registerBtn.classList.add('active');
        loginBtn.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    toggleForm('register');
});

document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.querySelector(".register form");
    const inputs = registerForm.querySelectorAll("input");
    const submitButton = registerForm.querySelector("button[type='submit']");

    function checkInputs() {
        const allFilled = Array.from(inputs).every(input => input.value.trim() !== "");

        if (allFilled) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    inputs.forEach(input => {
        input.addEventListener("input", checkInputs);
    });

    checkInputs();
});

document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector(".login form");
    const inputs = loginForm.querySelectorAll("input");
    const submitButton = loginForm.querySelector("button[type='submit']");

    function checkInputs() {
        const allFilled = Array.from(inputs).every(input => input.value.trim() !== "");

        if (allFilled) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    inputs.forEach(input => {
        input.addEventListener("input", checkInputs);
    });

    checkInputs();
});

