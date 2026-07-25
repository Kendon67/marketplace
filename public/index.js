const listingContainer = document.getElementById("listing_container");

document.addEventListener("DOMContentLoaded", () => {
    const loginScreen = document.getElementById("login_screen");
    const loginButton = document.getElementById("login_button");
    const mainPage = document.getElementById("main_page");

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        mainPage.style.display = "none";
        loginScreen.style.display = "block";
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
