document.addEventListener("DOMContentLoaded", () => {

    const loginButton = document.getElementById("login_button");
    const loginScreen = document.getElementById("login_screen");
    const loginScreenButton = document.getElementById("loginScreen_button");

    const signupScreen = document.getElementById("signup_screen");
    const signupButton = document.getElementById("signupScreen_button");
    const signupForm = document.getElementById("signup_form");

    const mainPage = document.getElementById("main_page");
    const homeButtons = document.querySelectorAll("#home_button, #home_button_signup");

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        mainPage.style.display = "none";
        loginScreen.style.display = "block";
    });


    // Open signup screen
    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        loginScreen.style.display = "none";
        signupScreen.style.display = "block";
    });

    loginScreenButton.addEventListener("click", (e) => {
        e.preventDefault();
        signupScreen.style.display = "none";
        loginScreen.style.display = "block";
    });

    // Back home buttons
    homeButtons.forEach(button => {
        button.addEventListener("click", () => {
            loginScreen.style.display = "none";
            signupScreen.style.display = "none";
            mainPage.style.display = "block";
        });
    });

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(signupForm);

        try {
            const response = await fetch("/api/users.php", {
                method: "POST",
                body: formData
            });
    
            if (response.status === 201) {
                const confirmed = confirm("Account successfully created!");
    
                if (confirmed) {
                    signupScreen.style.display = "none";
                    mainPage.style.display = "block";
                    signupForm.reset();
                }
            } else {
                alert("Account creation failed.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Something went wrong.");
        }
    });
});
