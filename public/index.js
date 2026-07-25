document.addEventListener("DOMContentLoaded", () => {

    const loginButton = document.getElementById("login_button");
    const loginScreen = document.getElementById("login_screen");
    const loginScreenButton = document.getElementById("loginScreen_button");

    const signupScreen = document.getElementById("signup_screen");
    const signupButton = document.getElementById("signupScreen_button");
    const signupForm = document.getElementById("signup_form");

    const mainPage = document.getElementById("main_page");
    const homeButtons = document.querySelectorAll("#home_button, #home_button_signup");

    const listingContainer = document.getElementById("listing_container");

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
        const singupData = new FormData(signupForm);

        try {
            const response = await fetch("/api/users.php", {
                method: "POST",
                body: signupData
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

    async function loadListings() {
        try {
            const response = await fetch("/api/product_listings.php");
            const data = await response.json();
    
            data.results.forEach(listing => {
    
                // creates listing card and places inside of container
                const card = document.createElement("div");
                card.className = "listing_card";
    
                card.innerHTML = `
                    <img src="${listing.image}" alt="${listing.name}">
                    <h2>${listing.name}</h2>
                    <p>${listing.description}</p>
                    <p>Category: ${listing.category}</p>
                    <p>Price: £${listing.price}</p>
                `;
    
                listingContainer.appendChild(card);
            });
    
        } catch (error) {
            console.error(error);
            listingContainer.innerHTML = "Unable to load listings";
        }
    }
    
});

loadListings();
