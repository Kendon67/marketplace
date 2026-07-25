const listingContainer = document.getElementById("listing_container");

async function loadListings() {
    try {
        const response = await fetch("/api/product_listings.php");
        const data = await response.json();

        listingContainer.innerHTML = "";

        data.results.forEach(listing => {
            const listingElement = document.createElement("div");

            listingElement.className = "listing_card";

            listingElement.innerHTML = `
                <img src="${listing.image}" alt="${listing.name}">
                <h2>${listing.name}</h2>
                <p>${listing.description}</p>
                <p>Category: ${listing.category}</p>
                <p>Price: £${listing.price}</p>
            `;

            listingContainer.appendChild(listingElement);
        });

    } catch (error) {
        console.error("Fetch error:", error);
        listingContainer.innerHTML = "Unable to load listings";
    }
}

loadListings();
