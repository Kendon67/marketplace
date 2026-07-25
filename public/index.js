const listingContainer = document.getElementById("listing_container");

document.addEventListener("DOMContentLoaded", () => {
    const loginScreen = document.getElementById("login_screen");
    const loginButton = document.getElementById("login_button");
    const show_signup = document.getElementById("show_signup");
    const mainPage = document.getElementById("main_page");
    const homeButton = document.getElementById("home_button");

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        mainPage.style.display = "none";
        loginScreen.style.display = "block";
    });

    homeButton.addEventListener("click", (e) => {
        e.preventDefault();
        loginScreen.style.display = "none";
        mainPage.style.display = "block";
    });

    show_signup.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/signup.html";
    });
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

loadListings();
