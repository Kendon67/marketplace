document.addEventListener("DOMContentLoaded", async() => {
    const listingContainer = document.getElementById("listing_container");

    const loginBtn = document.getElementById("login_button");
    const loginScreen = document.getElementById("login_screen");
    const loginScreenBtn = document.getElementById("loginScreen_button");
    const loginForm = document.getElementById("login_form")

    const signupScreen = document.getElementById("signup_screen");
    const signupBtn = document.getElementById("signupScreen_button");
    const signupForm = document.getElementById("signup_form");

    const mainPage = document.getElementById("main_page");
    const homeBtns = document.querySelectorAll("#home_button, #home_button_signup");
    const accountPageBtn = document.getElementById("")

    const cartBtn = document.getElementById("cart_button");
    const cartSidebar = document.querySelector(".sidebar_cart");
    const cartItems = document.getElementById("cart_items");
    
    await loadListings();

    // add to cart button - event listener due to dynamically updating listing container
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
    // TODO: add check for user login status before allowing add to cart functionality

    
    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        mainPage.style.display = "none";
        loginScreen.style.display = "flex";
    });

    // Open signup screen
    signupBtn.addEventListener("click", (e) => {
        e.preventDefault();
        loginScreen.style.display = "none";
        signupScreen.style.display = "flex";
    });

    loginScreenBtn.addEventListener("click", (e) => {
        e.preventDefault();
        signupScreen.style.display = "none";
        loginScreen.style.display = "flex";
    });

    // Back home buttons
    homeBtns.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            loginScreen.style.display = "none";
            signupScreen.style.display = "none";
            mainPage.style.display = "block";
        });
    });

    cartBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        cartSidebar.classList.toggle("open");
    
        if (cartSidebar.classList.contains("open")) {
            await loadCart();
        }
    });

    cartItems.addEventListener("click", async(e) => {
        e.preventDefault();
        if (!e.target.classList.contains("remove_item_button")) {
            return;
        }

        const itemToRemove = e.target.dataset.id;
        await removeFromCart(itemToRemove);
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
            const data = await response.json();
    
            data.results.forEach(listing => {
                const card = document.createElement("div");
                card.className = "listing_card";
    
                card.innerHTML = `
                    <img src="${listing.image}" alt="${listing.name}">
                    <h2>${listing.name}</h2>
                    <p>${listing.description}</p>
                    <p>Category: ${listing.category}</p>
                    <p>Price: £${listing.price}</p>
                    <button class="add_to_cart_btn" data-id="${listing.listingId}">Add to Cart</button>
                `;
    
                listingContainer.appendChild(card);
            });
    
        } catch (error) {
            console.error("Listing error");
        }
    }

    async function loadCart(){
        try{
            const response = await fetch ("/api/cart.php");
            const text = await response.text();
            console.log(text);

            const items = JSON.parse(text);
            cartItems.innerHTML="";
            let totalPrice = 0;

            items.forEach(item => {
                const itemCard = document.createElement("div");
                itemCard.className = "listing_card";
                totalPrice += Number(item.price);
            
                itemCard.innerHTML = `
                    <h2>${item.name}</h2>
                    <p>£${Number(item.price).toFixed(2)}</p>
                    <button class="remove_item_button" data-id="${item.listingId}">Remove</button>`;
            
                cartItems.appendChild(itemCard);
            });
            document.getElementById("cart_total").textContent = `Total: £${totalPrice.toFixed(2)}`;

        } catch (error) {
            console.error("cart error", error);
        }
    }

    async function logout(){
        const response = await fetch ("/api/users.php?action=logout", {
            method: "POST"});
        
            if (response.ok){
                cartItems.innerHTML = "";
            }
    }

    async function removeFromCart(item){
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
            } else {
                console.error("Failed to remove item");
            }
    
        } catch (error) {
            console.error("remove cart error", error);
        }
    }    
});
