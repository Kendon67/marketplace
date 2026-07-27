document.addEventListener("DOMContentLoaded", () => {
    const listingContainer = document.getElementById("listing_container");

    const loginButton = document.getElementById("login_button");
    const loginScreen = document.getElementById("login_screen");
    const loginScreenButton = document.getElementById("loginScreen_button");
    const loginForm = document.getElementById("login_form")

    const signupScreen = document.getElementById("signup_screen");
    const signupButton = document.getElementById("signupScreen_button");
    const signupForm = document.getElementById("signup_form");

    const mainPage = document.getElementById("main_page");
    const homeButtons = document.querySelectorAll("#home_button, #home_button_signup");

    const addToCartButton = document.querySelector(".add_to_cart_btn");

    loadListings();

    // adds item to cart when button is clicked
    addToCartButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const product = addToCartButton.getAttribute("data-id"); // Get product ID from the button
    
        try {
            const response = await fetch("/api/cart.php?action=addToCart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    listing_id: product // Send product ID in the request body
                })
            });
    
            if (response.ok) {
                alert("Product added to cart!");
            } else {
                alert("Failed to add product to cart.");
            }
        } catch (error) {
            alert("Something went wrong.");
        }
    });
    
    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        mainPage.style.display = "none";
        loginScreen.style.display = "flex";
    });

    // Open signup screen
    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        loginScreen.style.display = "none";
        signupScreen.style.display = "flex";
    });

    loginScreenButton.addEventListener("click", (e) => {
        e.preventDefault();
        signupScreen.style.display = "none";
        loginScreen.style.display = "flex";
    });

    // Back home buttons
    homeButtons.forEach(button => {
        button.addEventListener("click", () => {
            loginScreen.style.display = "none";
            signupScreen.style.display = "none";
            mainPage.style.display = "block";
        });
    });

    // handles signup form submission
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const signupData = new FormData(signupForm);

        try {
            const response = await fetch("/api/users.php?action=addUser", {
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

    // handles login form submission
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const loginData = new FormData(loginForm);

        try {
            const response = await fetch("/api/users.php?action=checkUser", {
                method: "POST",
                body: loginData
            });
    
            if (response.ok) {
                const confirmed = confirm("Login Succssesful!");
    
                if (confirmed) {
                    loginScreen.style.display = "none";
                    mainPage.style.display = "block";
                    loginForm.reset();
                }
            } else {
                alert("Invalid Username or Password");
            }
        } catch (error) {
            console.error("Fetch error");
        }
    });

    // loads listings to display on the front page
    async function loadListings() {
        console.log("Loading listings...");
    
        try {
            const response = await fetch("/api/product_listings.php");
    
            console.log("Status:", response.status);
    
            const data = await response.json();
    
            console.log("Data:", data);
    
            data.results.forEach(listing => {
                const card = document.createElement("div");
                card.className = "listing_card";
    
                card.innerHTML = `
                    <img src="${listing.image}" alt="${listing.name}">
                    <h2>${listing.name}</h2>
                    <p>${listing.description}</p>
                    <p>Category: ${listing.category}</p>
                    <p>Price: £${listing.price}</p>
                    <button class="add_to_cart_btn" data-id="${listing.id}">Add to Cart</button>
                `;
    
                listingContainer.appendChild(card);
            });
    
        } catch (error) {
            console.error("Listing error:", error);
        }
    }
});
