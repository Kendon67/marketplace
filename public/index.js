document.addEventListener("DOMContentLoaded", async () => {
    const listingContainer = document.getElementById("listing_container");

    const loginBtn = document.getElementById("login_button");
    const loginScreen = document.getElementById("login_screen");
    const loginScreenBtn = document.getElementById("loginScreen_button");
    const loginForm = document.getElementById("login_form");

    const signupScreen = document.getElementById("signup_screen");
    const signupBtn = document.getElementById("signupScreen_button");
    const signupForm = document.getElementById("signup_form");

    const mainPage = document.getElementById("main_page");
    const homeBtns = document.querySelectorAll("#login_home_button, #signup_home_button");

    const accountPage = document.getElementById("account_screen");
    const accountPageBtn = document.getElementById("account_screen_button");

    const listingsPage = document.getElementById("listings_screen");
    const listingsPageBtn = document.getElementById("listings_screen_button");
    const addListingBtn = document.getElementById("add_listing_button");
    const deleteListingBtn = document.getElementById("delete_listing_button");

    const cartBtn = document.getElementById("cart_button");
    const cartSidebar = document.querySelector(".sidebar_cart");
    const cartItems = document.getElementById("cart_items");

    const searchInput = document.getElementById("search_input");

    let listingsArray = [];
    listingContainer.addEventListener("click", async (e) => {
        if (!e.target.classList.contains("add_to_cart_btn")) {
            return;
        }

        const listingId = e.target.dataset.id;

        try {
            const response = await fetch("/api/cart.php?action=addToCart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    listing_id: listingId
                })
            });

            if (response.ok) {
                alert("Product added to cart!");
                await loadCart();
            } else {
                alert("Failed to add product to cart.");
            }

        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
        }
    });


    // search bar listener
    searchInput.addEventListener("input", () => {

        const searchValue = searchInput.value.toLowerCase();

        const filteredResults = listingsArray.filter(listing =>
            listing.name.toLowerCase().includes(searchValue) ||
            listing.description.toLowerCase().includes(searchValue) ||
            listing.category.toLowerCase().includes(searchValue)
        );

        loadListings(filteredResults);
    });

    // opens login screen
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        mainPage.style.display = "none";
        loginScreen.style.display = "flex";
    });

    // opens signup screen
    signupBtn.addEventListener("click", (e) => {
        e.preventDefault();
        loginScreen.style.display = "none";
        signupScreen.style.display = "flex";
    });

    // back to login
    loginScreenBtn.addEventListener("click", (e) => {
        e.preventDefault();
        signupScreen.style.display = "none";
        loginScreen.style.display = "flex";
    });

    // returns to home 
    homeBtns.forEach(button => {

        button.addEventListener("click", (e) => {
            e.preventDefault();

            loginScreen.style.display = "none";
            signupScreen.style.display = "none";
            mainPage.style.display = "block";
        });

    });

    // open cart sidebar to be shown to the user
    cartBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        cartSidebar.classList.toggle("open");
        if (cartSidebar.classList.contains("open")) {
            await loadCart();
        }
    });

    // remove targeted from the cart button
    cartItems.addEventListener("click", async (e) => {
        e.preventDefault();
        if (!e.target.classList.contains("remove_item_button")) {
            return;
        }
        await removeFromCart(e.target.dataset.id);
    });

    // open account page
    accountPageBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Account clicked");
        mainPage.style.display = "none";
        listingsPage.style.display = "none";
        accountPage.style.display = "flex";
    });

    // open user's listings page
    listingsPageBtn.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("Listings clicked");
        mainPage.style.display = "none";
        accountPage.style.display = "none";
        listingsPage.style.display = "flex";

    });

    addListingBtn.addEventListener("click", (e) => {
        e.preventDefault();
    })

    deleteListingBtn.addEventListener("click", (e) => {
        e.preventDefault();
    })

    // sign user up
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const signupData = new FormData(signupForm);
        try {
            const response = await fetch("/api/users.php?action=addUser", {
                method: "POST",
                body: signupData
            });

            if (response.status === 201) {
                alert("Account successfully created!");
                signupScreen.style.display = "none";
                mainPage.style.display = "block";
                signupForm.reset();
            } else {
                alert("Account creation failed.");
            }
        } catch (error) {
            console.error(error);
        }
    });



    // log user in - stored in session
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const loginData = new FormData(loginForm);
        try {
            const response = await fetch("/api/users.php?action=checkUser", {
                method: "POST",
                body: loginData
            });

            if (response.ok) {
                alert("Login Successful!");
                loginScreen.style.display = "none";
                mainPage.style.display = "block";
                loginForm.reset();
            } else {
                alert("Invalid Username or Password");
            }
        } catch (error) {
            console.error(error);
        }

    });

    // load product listings to be displayed to users
    await fetchListings();
    async function fetchListings() {
        try {
            const response = await fetch("/api/product_listings.php");
            const data = await response.json();
            listingsArray = data.results;
            loadListings(listingsArray);
        } catch (error) {
            console.error("Fetching listings failed:", error);
        }
    }

    async function loadListings(listings) {
        listingContainer.innerHTML = "";
        listings.forEach(listing => {
            const card = document.createElement("div");
            card.className = "listing_card";

            card.innerHTML = `
                <img src="${listing.image}" alt="${listing.name}">
                <h2>${listing.name}</h2>
                <p>${listing.description}</p>
                <p>Category: ${listing.category}</p>
                <p>Price: £${listing.price}</p>
                <button class="add_to_cart_btn" data-id="${listing.listingId}">
                    Add to Cart
                </button>
            `;

            listingContainer.appendChild(card);
        });
    }

    async function loadCart() {
        try {
            const response = await fetch("/api/cart.php");
            const items = await response.json();

            cartItems.innerHTML = "";
            let totalPrice = 0;

            items.forEach(item => {
                totalPrice += Number(item.price);

                const itemCard = document.createElement("div");
                itemCard.className = "listing_card";

                itemCard.innerHTML = `
                    <h2>${item.name}</h2>
                    <p>£${Number(item.price).toFixed(2)}</p>
                    <button class="remove_item_button" data-id="${item.listingId}">
                        Remove
                    </button>
                `;

                cartItems.appendChild(itemCard);
            });

            document.getElementById("cart_total").textContent =`Total: £${totalPrice.toFixed(2)}`;
        } catch (error) {
            console.error("Cart error:", error);
        }

    }

    // remove item from cart
    async function removeFromCart(item) {
        try {
            const response = await fetch("/api/cart.php", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    listing_id: item
                })
            });

            if (response.ok) {
                await loadCart();
            }
        } catch (error) {
            console.error("Remove cart error:", error);
        }
    }
});
