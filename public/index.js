document.addEventListener("DOMContentLoaded", async () => {
    const listingContainer = document.getElementById("listing_container");
    const listingImage = document.getElementById("listing_image");
    const imagePreview = document.getElementById("image_preview");

    // login elements
    const loginBtn = document.getElementById("login_button");
    const loginScreen = document.getElementById("login_screen");
    const loginScreenBtn = document.getElementById("loginScreen_button");
    const loginForm = document.getElementById("login_form");

    // signup elements
    const signupScreen = document.getElementById("signup_screen");
    const signupBtn = document.getElementById("signupScreen_button");
    const signupForm = document.getElementById("signup_form");

    // home page elements
    const mainPage = document.getElementById("main_page");
    const homeBtns = document.querySelectorAll("#login_home_button, #signup_home_button");
    const navButtons = document.querySelectorAll(".nav_button");
    const homeNavBtn = document.getElementById("home_screen_button");

    // search bar elements
    const searchBar = document.getElementById("search_bar");
    const searchInput = document.getElementById("search_input");
    const bannerText = document.getElementById("banner_title");

    // account page elements
    const accountPage = document.getElementById("account_screen");
    const accountPageBtn = document.getElementById("account_screen_button");
    const deleteAccountBtn = document.getElementById("delete_account_button");
    const changeEmailBtn = document.getElementById("change_email_button");
    const changeUsernameBtn = document.getElementById("change_username_button");
    const changePasswordBtn = document.getElementById("change_password_button");
    const createListingBtn = document.getElementById("create_listing_button");
    const addListingForm = document.getElementById("add_listing_form");
    const userListingsContainer = document.getElementById("user_listings_container");

    // listing page elements
    const listingsPage = document.getElementById("listings_screen");
    const listingsPageBtn = document.getElementById("listings_screen_button");
    const listingModal = document.getElementById("listing_modal");
    const closeListingModal = document.getElementById("close_listing_modal");

    // about page elements
    const aboutPage = document.getElementById("about_screen");
    const aboutPageBtn = document.getElementById("about_screen_button");

    // banner elements

    // cart elements
    const cartBtn = document.getElementById("cart_button");
    const cartSidebar = document.querySelector(".sidebar_cart");
    const cartItems = document.getElementById("cart_items");

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
            alert("Something went wrong.");
        }
    });

    // give user image preview before submission
    listingImage.addEventListener("change", () => {
        const file = listingImage.files[0];
    
        if (file) {
            imagePreview.src = URL.createObjectURL(file);
            imagePreview.style.display = "block";
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

        loadListings(filteredResults, listingContainer);
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

    // open user's listings page
    homeNavBtn.addEventListener("click", (e) => {
        e.preventDefault();
        hideAllPages();
        mainPage.style.display = 'block';
        updateBanner("MARKET", true, true, true, false);
    });

    // open user's listings page
    listingsPageBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        hideAllPages();
        listingsPage.style.display = 'flex';
        updateBanner("Your Listings", false , false, false, true);

        await fetchUserListings();
    });

    // open account page
    accountPageBtn.addEventListener("click", (e) => {
        e.preventDefault();
        hideAllPages();

        accountPage.style.display = 'flex';
        updateBanner("Your Account");
    });

    // delete current logged in account
    deleteAccountBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const confirmed = confirm("Are you sure you want to delete your account? This action cannot be undone afterwards.");
        if(confirmed){
            await deleteUser();
        }
    })

    // open add listing form
    createListingBtn.addEventListener("click", (e) => {
        e.preventDefault();
        listingModal.style.display = "flex";
    });

    // close listing modal if clicked outside of or close button clicked
    listingModal.addEventListener("click", (e) => {
        if (e.target === listingModal) {
            listingModal.style.display = "none";
        }
    });

    closeListingModal.addEventListener("click", () => {
        listingModal.style.display = "none";
    });

    // create listing upon form submission
    addListingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addListing();
    })

    // delete listing, dynamic event listener
    userListingsContainer.addEventListener("click", async (e) => {
        if (!e.target.classList.contains("delete_listing_btn")) {
            return;
        }
    
        const listingId = e.target.dataset.id;
        await deleteListing(listingId);
    });

    // change nav button activity depending on which is active
    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            navButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");
        });
    });

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
            alert("Account creation failed.");
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
            alert("Something Went Wrong. Please Try Again");
            console.error("Login Error");
        }

    });

    // fetch product listings from api
    await fetchListings();
    async function fetchListings() {
        try {
            const response = await fetch("/api/product_listings.php");
            const data = await response.json();

            listingsArray = data.results;
            loadListings(listingsArray, listingContainer);
        } catch (error) {
            alert("Something Went Wrong. Please Reload Page");
            console.error("Listings Display Error");
        }
    }

    // load listings for display to user
    async function loadListings(listings, container, isUserListings = false) {
        console.log("isUserListings:", isUserListings);
        container.innerHTML = "";
        
        if(!listings.length > 0){

            container.innerHTML = `
                <div class="empty_message">
                    <h2>No listings found</h2>
                    <p>Listings Will Load Here.</p>
                </div>
            `;
    
            return;
        }

        listings.forEach(listing => {
            const card = document.createElement("div");
            card.className = "listing_card";
            
            card.innerHTML = `
            <img src="${listing.image}" alt="${listing.name}">
            <h2>${listing.name}</h2>
            <p>${listing.description}</p>
            <p>Category: ${listing.category}</p>
            <p>Price: £${listing.price}</p>

            ${
                isUserListings
                    ? `<button class="delete_listing_btn" data-id="${listing.listingId}">
                           Delete Listing
                       </button>`
                    : `<button class="add_to_cart_btn" data-id="${listing.listingId}">
                           Add to Cart
                       </button>`
            }
        `;

            container.appendChild(card);
        });
    }

    // fetch listings specific to the user
    async function fetchUserListings() {
        const response = await fetch("/api/product_listings.php?action=userListings");
        const data = await response.json();
    
        loadListings(data.results, userListingsContainer, true);
    }

    // add listing to database
    async function addListing() {
        const listingData = new FormData(addListingForm);
    
        try {
            const response = await fetch("/api/product_listings.php", {
                method: "POST",
                body: listingData
            });
    
            if (response.status.ok) {
                alert("Listing successfully created!");
                addListingForm.reset();
                listingModal.style.display = "none";
                await fetchUserListings();
            } else {
                alert("Listing creation failed.");
            }
        } catch (error) {
            alert("Something Went Wrong. Please Try Again");
            console.error("Add Listing Error")
        }
    }

    // delete listing from database
    async function deleteListing(listingId) {
        try {
            const response = await fetch("/api/product_listings.php", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify({
                    listing_id: listingId
                })
            });
    
            if (response.ok) {
                alert("Listing successfully deleted!");
                await fetchUserListings();
            } else {
                alert("Listing deletion failed.");
            }
        } catch (error) {
            alert("Something Went Wrong. Please Try Again");
            console.error("Listing Deletion Error");
        }
    }

    // fetch cart from database and load
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
            alert("Something Went Wrong. Please Try Again");
            console.error("Loading Cart Error");
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
            console.error("Remove cart error");
        }
    }

    // delete user from database
    async function deleteUser(){
        try {
            const response = await fetch("/api/users.php", {
                method: "DELETE"
            });

            if(response.ok){
                alert("Account Deleted Successfully!");
                window.location.reload();
            } else{
                alert("Account Deletion Failed");
            }
    
        } catch(error){
            alert("Something Went Wrong. Please Try Again");
            console.error("User Deletion Error");
        }
    }

    // hide all pages 
    function hideAllPages(){
        mainPage.style.display = "none";
        listingsPage.style.display = "none";
        accountPage.style.display = "none";
        loginScreen.style.display = "none";
        signupScreen.style.display = "none";
    }

    // update banner appearance based on current page
    function updateBanner(title, showSearch = false, showLogin = false, showCart = false, showCreateListing = false) {
        bannerText.innerHTML = "";
        bannerText.innerHTML = title;
    
        searchBar.style.display = showSearch ? "flex" : "none";
        loginBtn.style.display = showLogin ? "flex" : "none";
        cartBtn.style.display = showCart ? "flex" : "none";
        createListingBtn.style.display = showCreateListing ? "flex" : "none";
    }
    
});
